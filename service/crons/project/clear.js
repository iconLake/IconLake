import { deleteOldFiles } from '../../controllers/project/icon/gen/index.js'
import { ONE_DAY_SECONDS, PERMANENT_FILE_EXPIRE } from '../../utils/const.js'

const isExpired = (createTime, expire) => (
  expire < PERMANENT_FILE_EXPIRE && Math.floor((Date.now() - createTime) / ONE_DAY_SECONDS) >= expire
)

/**
 * 清理过期文件
 * @param {{\
 *  files: {\
 *    css: []\
 *    js: []\
 *  }\
 * }} project
 */
export async function clearExpiredFiles (project) {
  if (project.files) {
    if (project.files.css instanceof Array && project.files.css.length > 0) {
      const cssFiles = project.files.css.filter(e => isExpired(e.createTime, e.expire))
      if (cssFiles.length > 0) {
        await deleteOldFiles(project._id, cssFiles, 'css')
      }
    }
    if (project.files.css instanceof Array && project.files.css.length > 0) {
      const jsFiles = project.files.css.filter(e => isExpired(e.createTime, e.expire))
      if (jsFiles.length > 0) {
        await deleteOldFiles(project._id, jsFiles, 'js')
      }
    }
  }
}
