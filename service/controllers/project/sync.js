import axios from 'axios'
import filterObject from 'filter-obj'
import { History } from '../../models/history.js'
import { Project } from '../../models/project.js'
import { SOURCE_TYPE } from '../../utils/const.js'

/**
 * 同步源信息
 * @param {object} sourceInfo 源信息
 * @param {object} originalData 原始数据
 */
function syncSourceInfo (sourceInfo, originalData) {
  if (sourceInfo.type === SOURCE_TYPE.ICONFONT) {
    sourceInfo.name = originalData.name
    sourceInfo.prefix = originalData.css_prefix_text
    sourceInfo.className = originalData.font_family
  }
}

/**
 * 同步图标信息
 * @param {object} iconInfo 源信息
 * @param {object} originalData 原始数据
 */
function syncIconInfo (iconInfo, originalData) {
  if (iconInfo.sourceType === SOURCE_TYPE.ICONFONT) {
    !iconInfo.name && (iconInfo.name = originalData.name)
    !iconInfo.code && (iconInfo.code = originalData.font_class)
  }
}

/**
 * 同步图标
 * @param {array} icons 全部图标
 * @param {array} originalData 同步过来的原始数据
 * @param {string} sourceId 源的ID
 * @param {number} sourceType 源的类型
 */
function syncIcons (icons, originalData, sourceId, sourceType) {
  if (!(originalData instanceof Array) || originalData.length === 0) {
    return
  }
  const iconMap = new Map()
  icons.forEach(e => {
    if (e.sourceId.toString() === sourceId.toString()) {
      iconMap.set(e.code, e)
    }
  })
  const syncTime = new Date()
  originalData.forEach(e => {
    const icon = {
      sourceId,
      sourceType,
      syncTime,
      originalData: e
    }
    syncIconInfo(icon, e)
    if (iconMap.has(icon.code)) {
      const info = iconMap.get(icon.code)
      if (!info.name) {
        info.name = icon.name
      }
      info.syncTime = syncTime
      info.originalData = icon.originalData
    } else {
      icons.push(icon)
    }
  })
  // 移除的icon放到存档里
  const history = {
    icons: []
  }
  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i]
    if (icon.syncTime < syncTime) {
      history.icons.push(icon)
      icons.splice(i, 1)
      --i
    }
  }
  return {
    icons,
    history
  }
}

/**
 * 同步图标
 */
export default async function sync (req, res) {
  if (!req.params.id || !req.body._id) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const projectId = req.params.id
  const sourceId = req.body._id
  const project = await Project.findOne({
    _id: projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    },
    'sources._id': sourceId
  }, 'sources icons')
  if (!project) {
    res.json({
      error: 'noPermission'
    })
    return
  }
  const source = project.sources.id(sourceId)
  const syncUrl = source.syncUrl
  const sourceType = source.type
  if (!source || !syncUrl) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const data = {
    syncStartTime: new Date(),
    type: sourceType
  }
  // TODO: axios 替换为node-fetch
  const syncRes = await axios.get(syncUrl, {
    headers: {
      'User-Agent': 'iconLake'
    }
  })
  if (syncRes.status === 200) {
    data.syncEndTime = new Date()
    const sourceData = syncRes.data
    const iconsKey = {
      [SOURCE_TYPE.ICONFONT]: 'glyphs'
    }[sourceType]
    const originalData = filterObject(sourceData, k => k !== iconsKey)
    data.originalData = originalData
    syncSourceInfo(data, originalData)
    const $set = {}
    Object.keys(data).forEach(e => {
      $set[`sources.$.${e}`] = data[e]
    })
    await Project.updateOne({
      _id: projectId,
      userId: req.user._id,
      'sources._id': sourceId
    }, {
      $set
    })
    const result = syncIcons(project.icons, sourceData[iconsKey], sourceId, sourceType)
    if (result.history.icons.length) {
      const history = await History.findById(projectId, 'sources')
      if (history && history.sources.length) {
        const source = history.sources[history.sources.length - 1]
        await History.updateOne({
          _id: projectId
        }, {
          $push: {
            icons: result.history.icons.map(e => {
              e.sourceId = source._id
              return e
            })
          }
        })
      }
    }
    // TODO: 同时多个同步操作会导致数据覆盖问题，后续需要优化
    await Project.updateOne({
      _id: projectId
    }, {
      $set: {
        icons: project.icons
      }
    })
    // TODO: 等到同步完成再返回可能导致请求超时，后续需要优化
    res.json({})
  } else {
    res.json({
      error: 'syncFail'
    })
  }
}
