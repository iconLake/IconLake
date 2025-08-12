import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

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
        path: 'storage',
        name: 'projectStorageSetting',
        component: () => import('../views/project/setting/Storage.vue')
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
        path: 'theme',
        name: 'themeSetting',
        component: () => import('../views/project/setting/Theme.vue')
      },
      {
        path: 'ticket',
        name: 'ticketSetting',
        component: () => import('../views/project/setting/Ticket.vue')
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
    path: '/icons/:projectId/protect/:id',
    name: 'iconsProtect',
    component: () => import('../views/icons/Protect.vue')
  },
  {
    path: '/icons/:projectId/appreciate/:id',
    name: 'iconsAppreciate',
    component: () => import('../views/icons/Appreciate.vue')
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
  },
  {
    path: '/user/tickets',
    name: 'userTickets',
    component: () => import('../views/user/Tickets.vue')
  },
  {
    path: '/user/assets/drop/init',
    name: 'initDROP',
    component: () => import('../views/user/assets/drop/Init.vue')
  },
  {
    path: '/user/setting',
    name: 'userSetting',
    component: () => import('../views/user/Setting.vue'),
    redirect: () => {
      return '/user/setting/info'
    },
    children: [
      {
        path: 'bind',
        name: 'userSettingBind',
        component: () => import('../views/user/setting/Bind.vue')
      },
      {
        path: 'info',
        name: 'userSettingInfo',
        component: () => import('../views/user/setting/Info.vue')
      },
      {
        path: 'theme',
        name: 'userSettingTheme',
        component: () => import('../views/user/setting/Theme.vue')
      },
      {
        path: 'usage',
        name: 'userSettingUsage',
        component: () => import('../views/user/setting/Usage.vue')
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
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
