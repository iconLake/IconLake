import { includeKeys } from 'filter-obj'
import { ERROR_CODE } from '../../utils/const.js'
import { User } from '../../models/user.js'
import { AI_MODELS, aiGenerateTheme } from '../../utils/ai.js'

/**
 * @api {post} /user/theme/edit 修改主题
 */
export async function edit (req, res) {
  const theme = includeKeys(req.body, ['creator'])
  if (typeof theme.creator !== 'string') {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const result = await User.updateOne({
    _id: req.user._id
  }, {
    $set: {
      theme
    }
  })
  res.json(result.modifiedCount > 0
    ? {}
    : {
        error: ERROR_CODE.FAIL
      })
}

/**
 * @api {get} /user/theme/info 主题
 */
export async function info (req, res) {
  const address = req.query.address
  if (!address || typeof address !== 'string') {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const user = await User.findOne({
    'blockchain.id': address
  }, 'theme')
  res.json(user ? user.theme : {})
}

/**
 * @api {post} /user/theme/generate 生成主题
 */
export async function generate (req, res) {
  const text = await aiGenerateTheme({
    prompt: req.body.prompt,
    userId: req.user._id,
    model: AI_MODELS.CODER
  }).catch((e) => {
    res.json({
      error: e.message
    })
  })
  if (!text) {
    return
  }
  const metches = /```.*?\n([\s\S]*?)```/.exec(text)
  res.json({ codes: metches ? metches[1] : 'ERROR: no codes' })
}
