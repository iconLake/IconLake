import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home/Index.vue')
  },
  {
    path: '/project/create',
    name: 'createProject',
    component: () => import('../views/project/Create.vue')
  },
  {
    path: '/project/:id/setting',
    name: 'projectSetting',
    component: () => import('../views/project/Setting.vue'),
    redirect: to => {
      return `/project/${to.params.id}/setting/info`
    },
    children: [
      {
        path: 'info',
        name: 'projectInfoSetting',
        component: () => import('../views/project/setting/Info.vue')
      },
      {
        path: 'group',
        name: 'projectGroupSetting',
        component: () => import('../views/project/setting/Group.vue')
      },
      {
        path: 'member',
        name: 'projectMemberSetting',
        component: () => import('../views/project/setting/Member.vue')
      },
      {
        path: 'monitor',
        name: 'projectMonitorSetting',
        component: () => import('../views/project/setting/Monitor.vue')
      },
      {
        path: 'advance',
        name: 'projectAdvanceSetting',
        component: () => import('../views/project/setting/Advance.vue')
      }
    ]
  },
  {
    path: '/icons/:id',
    name: 'icons',
    component: () => import('../views/icons/Index.vue')
  },
  {
    path: '/icons/:id/create',
    name: 'iconsCreate',
    component: () => import('../views/icons/Create.vue')
  },
  {
    path: '/icons/:id/use',
    name: 'iconsUse',
    component: () => import('../views/icons/Use.vue')
  },
  {
    path: '/project/:id/invite',
    name: 'projectInvite',
    component: () => import('../views/project/Invite.vue')
  },
  {
    path: '/analyse/icon/:projectId/:id',
    name: 'analyseIcon',
    component: () => import('../views/analyse/Icon.vue')
  },
  {
    path: '/user/assets',
    name: 'userAssets',
    component: () => import('../views/user/Assets.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/manage/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return {
      top: 0
    }
  }
})

export default router
