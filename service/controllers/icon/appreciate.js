import { Appreciate } from '../../models/appreciate.js'
import { Project } from '../../models/project.js'
import { AI_MODELS, aiAppreciate, getAI } from '../../utils/ai.js'
import { ERROR_CODE } from '../../utils/const.js'
import { completeURL } from '../../utils/file.js'
import { middleware as userMiddleware } from '../user/middleware.js'

const AppreciateTypes = ['good', 'normal', 'bad', 'great']

export async function list (req, res) {
  if (
    typeof req.query.projectId !== 'string' ||
    !req.query.projectId ||
    typeof req.query.iconId !== 'string' ||
    !req.query.iconId ||
    typeof req.query.type !== 'string' ||
    !req.query.type ||
    !AppreciateTypes.includes(req.query.type)
  ) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }

  const project = await Project.findOne({
    _id: req.query.projectId
  }, 'icons isPublic members')
  if (!project) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }

  const forceLogin = async () => {
    await userMiddleware(req, res, () => {})
    if (!project.members.some(e => e.userId.toString() === req.user._id.toString())) {
      res.json({
        error: ERROR_CODE.PERMISSION_DENIED
      })
      return false
    }
    return true
  }

  if (!project.isPublic && !await forceLogin()) {
    return
  }

  const icon = project.icons.id(req.query.iconId)
  if (!icon) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }

  let info = await Appreciate.findOne({
    projectId: req.query.projectId,
    iconId: req.query.iconId
  })

  const appreciateByAI = async () => {
    const ai = getAI(AI_MODELS.APPRECIATE)
    return {
      url: icon.img?.url ?? icon.svg?.url,
      text: await aiAppreciate({
        model: AI_MODELS.APPRECIATE,
        imgUrl: completeURL(icon.img?.url ?? icon.svg?.url),
        type: req.query.type,
        locale: req.cookies.locale,
        userId: req.user._id
      }),
      ai: ai.name
    }
  }

  try {
    if (!info) {
      const content = {
        good: [],
        normal: [],
        bad: [],
        great: []
      }
      if (!await forceLogin()) {
        return
      }
      content[req.query.type].push(await appreciateByAI())
      info = new Appreciate({
        projectId: req.query.projectId,
        iconId: req.query.iconId,
        content
      })
      await info.save()
    } else if (info.content[req.query.type].length === 0 || req.query.update) {
      if (!await forceLogin()) {
        return
      }
      const content = await appreciateByAI()
      info.content[req.query.type].push(content)
      await Appreciate.updateOne({
        _id: info._id
      }, {
        $push: {
          [`content.${req.query.type}`]: content
        }
      })
    }
    res.json({
      list: info.content[req.query.type]
    })
  } catch (e) {
    if (e.error?.code === '4003') {
      return res.json({
        error: ERROR_CODE.IMAGE_FORMAT_NOT_SUPPORTED
      })
    }
    console.error(e)
    res.json({
      error: e.message || ERROR_CODE.INTERNAL_ERROR
    })
  }
}
