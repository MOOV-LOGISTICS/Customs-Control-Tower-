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
        { path: '/customs/document-review', component: () => import('@/views/customs/documentReview/index.vue'),  meta: { title: 'Document Review' } },
        { path: '/customs/document-center', component: () => import('@/views/customs/documentCenter/index.vue'),  meta: { title: 'Document Center' } },
        // Old Broker Downloads entry — absorbed into Document Center
        { path: '/customs/broker-download', redirect: '/customs/document-center' },
        // Old Pepco Review entry — renamed to Document Review; keeps saved links working
        { path: '/customs/pepco-review',    redirect: to => ({ path: '/customs/document-review', query: to.query }) },
      ]
    }
  ]
})
