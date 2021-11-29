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
    component:()=>import('../views/index.vue'),
    children:[
      // 用户
      {
        path:'user',
        component:()=>import('../views/index/user.vue'),
        children:[
          {
            path:'/',
            redirect:'user_list'
          },
          {
            path:'user_list',
            component:()=>import('../components/user_list.vue')
          }
        ]
      },
      // 数据
      {
        path:'data',
        component:()=>import('../views/index/data.vue'),
        children:[
          {
            path:'/',
            redirect:'data_list'
          },
          {
            path:'data_list',
            component:()=>import('../components/data_list.vue')
          }
        ]
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
