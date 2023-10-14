import { Router } from 'express'
import { login as oauthGithub } from '../controllers/oauth/github.js'
import { login as oauthGitee } from '../controllers/oauth/gitee.js'
import { login as oauthCode } from '../controllers/oauth/code.js'
import { login as oauthBlockchain } from '../controllers/oauth/blockchain.js'
import * as userInfo from '../controllers/user/info.js'
import userMiddleware from '../controllers/user/middleware.js'
import * as projectInfo from '../controllers/project/info.js'
import * as projectList from '../controllers/project/list.js'
import * as projectGroup from '../controllers/project/group.js'
import * as projectMonitor from '../controllers/project/monitor.js'
import * as projectInvite from '../controllers/project/invite.js'
import * as projectMember from '../controllers/project/member.js'
import * as projectIcon from '../controllers/project/icon.js'
import * as projectFile from '../controllers/project/file.js'
import * as iconInfo from '../controllers/icon/info.js'
import { params as loginParams } from '../controllers/login/index.js'
import { init as initDrop } from '../controllers/blockchain/drop.js'
import { info as blockchainInfo } from '../controllers/blockchain/info.js'

const router = Router()

router.get('/login/params', loginParams)

router.get('/oauth/github', oauthGithub)
router.get('/oauth/gitee', oauthGitee)
router.get('/oauth/code', oauthCode)
router.post('/oauth/blockchain', oauthBlockchain)

router.get('/user/info', userMiddleware, userInfo.info)
router.get('/user/logout', userMiddleware, userInfo.logout)

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
router.get('/project/icon/info', userMiddleware, projectIcon.info)
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

router.post('/icon/info/edit', userMiddleware, iconInfo.edit)

router.get('/blockchain/drop/init', userMiddleware, initDrop)
router.get('/blockchain/info', blockchainInfo)

export default router
