import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'
import i18n from '@/locales/index'

Vue.use(Router)

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/ui-refactor/views/login'], resolve),
    hidden: true
  },
  {
    path:'/forgot',
    component: (resolve) => require(['@/ui-refactor/views/forgot-password'], resolve),
    hidden: true
  },
  {
    path: '/sso',
    component: (resolve) => require(['@/views/sso'], resolve),
    hidden: true
  },
  {
    path: '/social-login',
    component: (resolve) => require(['@/views/socialLogin'], resolve),
    hidden: true
  },
  {
    path: '/privacy-statement',
    component: (resolve) => require(['@/views/privacy-statement'], resolve),
    hidden: true
  },
  {
    path: '/get-started',
    component: (resolve) => require(['@/views/get-started'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [{
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        // name: '首页',
        // meta: {title: '首页', icon: 'dashboard', affix: true}
        name: 'HomePage',
        hidden: true,
        meta: {title: i18n.t('homePage.homePage'), icon: 'home', affix: true}
      }
    ]
  },
  {
    path: '',
    component: Layout,
    hidden: true,
    redirect: 'tracking',
    children: [{
        path: 'tracking',
        component: (resolve) => require(['@/views/track/track'], resolve),
        name: 'tracking',
        meta: {title: i18n.t('track.track'), icon: 'map1', affix: true}
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [{
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: {title: i18n.t('homePage.personalCenter'), icon: 'user'}
      }, {
        path: 'notify-message',
        component: (resolve) => require(['@/views/system/notify/my/index'], resolve),
        name: 'MyNotifyMessage',
        meta: { title: i18n.t('homePage.myStationMail'), icon: 'message' },
    }, {
      path: 'subscribe-message',
      component: (resolve) => require(['@/views/system/notify/mySubscribe/index'], resolve),
      name: 'MySubscribe',
      meta: { title: 'My Subscribe', icon: 'message' },
  }]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [{
        path: 'type/data/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'SystemDictData',
        meta: {title: '字典数据', icon: '', activeMenu: '/system/dict'}
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [{
        path: 'log',
        component: (resolve) => require(['@/views/infra/job/log'], resolve),
        name: 'InfraJobLog',
        meta: {title: '调度日志', activeMenu: '/infra/job'}
      }
    ]
  }, {
    path: '/codegen',
    component: Layout,
    hidden: true,
    children: [{
        path: 'edit/:tableId(\\d+)',
        component: (resolve) => require(['@/views/infra/codegen/editTable'], resolve),
        name: 'InfraCodegenEditTable',
        meta: {title: '修改生成配置', activeMenu: '/infra/codegen'}
      }
    ]
  },
  {
    path: '/property',
    component: Layout,
    hidden: true,
    children: [{
      path: 'value/:propertyId(\\d+)',
      component: (resolve) => require(['@/views/mall/product/property/value'], resolve),
      name: 'ProductPropertyValue',
      meta: {title: '商品属性值', icon: '', activeMenu: '/product/property'}
    }
    ]
  },
  {
    path: '/spu',
    component: Layout,
    hidden: true,
    children: [{
      path: 'edit/:spuId(\\d+)',
      component: (resolve) => require(['@/views/mall/product/spu/save'], resolve),
      name: 'ProductSpuUpdate',
      meta: {title: '修改商品', activeMenu: '/product/spu'}
    },
      {
        path: 'add',
        component: (resolve) => require(['@/views/mall/product/spu/save'], resolve),
        name: 'ProductSpuCreate',
        meta: {title: 'Add Product', activeMenu: '/product/spu'}
      }
    ]
  },
  {
    path: '/trade/order',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'detail',
        name: 'TradeOrderDetail',
        hidden: true,
        meta: { title: '订单详情' },
        component: (resolve) => require(['@/views/mall/trade/order/detail'], resolve)
      }
    ]
  }
  // ,
  // {
  //   path: '/pay',
  //   component: Layout,
  //   hidden: true,
  //   children: [{
  //     path: 'order/submit',
  //     name: 'PayOrderSubmit',
  //     hidden: true,
  //     meta: {
  //       title: '收银台',
  //       noCache: true
  //     },
  //     component: (resolve) => require(['@/views/pay/order/submit'], resolve)
  //   }]
  // }
]

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

export default new Router({
  base: process.env.VUE_APP_APP_NAME ? process.env.VUE_APP_APP_NAME : "/",
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})
