import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/index.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/customs/document-upload',
      children: [
        { path: '/customs/dashboard',       component: () => import('@/views/customs/dashboard/index.vue'),       meta: { title: 'Customs Dashboard' } },
        { path: '/customs/document-upload', component: () => import('@/views/customs/documentUpload/index.vue'),  meta: { title: 'Document Upload' } },
        { path: '/customs/pepco-review',    component: () => import('@/views/customs/pepcoReview/index.vue'),     meta: { title: 'Pepco Review' } },
        { path: '/customs/document-center', component: () => import('@/views/customs/documentCenter/index.vue'),  meta: { title: 'Document Center' } },
        // Old Broker Downloads entry — absorbed into Document Center
        { path: '/customs/broker-download', redirect: '/customs/document-center' },
      ]
    }
  ]
})
