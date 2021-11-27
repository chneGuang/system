import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/index'
  },
  {
    path:'/login',
    component:()=>import('../views/login.vue')
  },
  {
    path:'/index',
    component:()=>import('../views/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
