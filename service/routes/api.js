import { Router } from 'express'
import { login as oauthGithub } from '../controllers/oauth/github.js'
import { login as oauthGitee } from '../controllers/oauth/gitee.js'
import { login as oauthGoogle } from '../controllers/oauth/google.js'
import { login as oauthCode } from '../controllers/oauth/code.js'
import { login as oauthBlockchain } from '../controllers/oauth/blockchain.js'
import * as webAuthn from '../controllers/oauth/webAuthn.js'
import * as mailAuthn from '../controllers/oauth/mail/index.js'
import * as userInfo from '../controllers/user/info.js'
import * as userTheme from '../controllers/user/theme.js'
import * as userSetting from '../controllers/user/setting.js'
import * as userFile from '../controllers/user/file.js'
import userMiddleware from '../controllers/user/middleware.js'
import * as projectInfo from '../controllers/project/info.js'
import * as projectList from '../controllers/project/list.js'
import * as projectGroup from '../controllers/project/group.js'
import * as projectMonitor from '../controllers/project/monitor.js'
import * as projectInvite from '../controllers/project/invite.js'
import * as projectMember from '../controllers/project/member.js'
import * as projectIcon from '../controllers/project/icon.js'
import * as projectFile from '../controllers/project/file.js'
import * as projectTheme from '../controllers/project/theme.js'
import * as iconInfo from '../controllers/icon/info.js'
import { params as loginParams } from '../controllers/login/index.js'
import { init as initDrop } from '../controllers/blockchain/drop.js'
import { info as blockchainInfo } from '../controllers/blockchain/info.js'
import { add as addBlacklist, del as delBlacklist } from '../controllers/blacklist/update.js'
import adminMiddleware from '../controllers/admin/middleware.js'
import { verify as verifyAdmin } from '../controllers/admin/info.js'
import { verifyNFT, verifyProject, verifyAddress } from '../controllers/blacklist/verify.js'
import * as appreciate from '../controllers/icon/appreciate.js'
import * as exhibition from '../controllers/exhibition/index.js'

const router = Router()

router.get('/login/params', loginParams)

router.get('/oauth/github', oauthGithub)
router.get('/oauth/gitee', oauthGitee)
router.get('/oauth/google', oauthGoogle)
router.get('/oauth/code', oauthCode)
router.post('/oauth/blockchain', oauthBlockchain)
router.post('/oauth/webAuthn/register', webAuthn.register)
router.post('/oauth/webAuthn/login', webAuthn.login)
router.post('/oauth/mail/send', mailAuthn.send)
router.post('/oauth/mail/login', mailAuthn.login)

router.get('/user/info', userMiddleware, userInfo.info)
router.post('/user/info/edit', userMiddleware, userInfo.edit)
router.get('/user/info/usage', userMiddleware, userInfo.usage)
router.get('/user/logout', userMiddleware, userInfo.logout)

router.get('/user/setting/unbind', userMiddleware, userSetting.unbind)
router.get('/user/setting/regenAccessKey', userMiddleware, userSetting.regenAccessKey)
router.post('/user/file/upload', userMiddleware, userFile.upload)

router.post('/user/theme/edit', userMiddleware, userTheme.edit)
router.post('/user/theme/generate', userMiddleware, userTheme.generate)
router.get('/user/theme/info', userTheme.info)

router.get('/project/list', userMiddleware, projectList.list)
router.get('/project/info/:id', projectInfo.info)
router.post('/project/info/edit', userMiddleware, projectInfo.edit)
router.post('/project/del', userMiddleware, projectInfo.del)
router.post('/project/clean', userMiddleware, projectInfo.clean)
router.post('/project/group/edit', userMiddleware, projectGroup.edit)
router.post('/project/group/del', userMiddleware, projectGroup.del)
router.post('/project/monitor/edit', userMiddleware, projectMonitor.edit)
router.post('/project/invite/updateCode', userMiddleware, projectInvite.updateCode)
router.post('/project/invite/accept', userMiddleware, projectInvite.accept)
router.get('/project/member/list', userMiddleware, projectMember.list)
router.post('/project/member/del', userMiddleware, projectMember.del)
router.get('/project/icon/info', projectIcon.info)
router.post('/project/icon/del', userMiddleware, projectIcon.del)
router.post('/project/icon/add', userMiddleware, projectIcon.add)
router.post('/project/icon/edit', userMiddleware, projectIcon.edit)
router.post('/project/icon/addTag', userMiddleware, projectIcon.addTag)
router.post('/project/icon/delTag', userMiddleware, projectIcon.delTag)
router.get('/project/icon/pages', userMiddleware, projectIcon.pages)
router.post('/project/icon/batchGroup', userMiddleware, projectIcon.batchGroup)
router.post('/project/icon/gen', userMiddleware, projectIcon.gen)
router.post('/project/icon/setExpire', userMiddleware, projectIcon.setExpire)
router.post('/project/file/upload', userMiddleware, projectFile.upload)
router.get('/project/file/storageInfo', userMiddleware, projectFile.storageInfo)
router.post('/project/theme/edit', userMiddleware, projectTheme.edit)
router.get('/project/theme/info', projectTheme.info)

router.get('/icon/appreciate/list', appreciate.list)

router.post('/icon/info/edit', userMiddleware, iconInfo.edit)

router.get('/blockchain/drop/init', userMiddleware, initDrop)
router.get('/blockchain/info', blockchainInfo)

router.get('/admin/info/verify', userMiddleware, verifyAdmin)
router.post('/admin/blacklist/add', adminMiddleware, addBlacklist)
router.post('/admin/blacklist/del', adminMiddleware, delBlacklist)

router.get('/blacklist/verify/nft', verifyNFT)
router.get('/blacklist/verify/project', verifyProject)
router.get('/blacklist/verify/address', verifyAddress)

router.get('/exhibition/classInfo/:id', exhibition.classInfo)
router.get('/exhibition/nftList/:id', exhibition.nftList)
router.get('/exhibition/nftInfo/:projectId/:iconId', exhibition.nftInfo)
router.get('/exhibition/creatorInfo/:id', exhibition.creatorInfo)

export default router
