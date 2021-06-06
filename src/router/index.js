import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫 无权限不能跳转路径的作用
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from：从哪里跳转而来
  // next放行函数 next('/login') 强行跳转
  if (to.path === '/login')
    return next()
  // 否则获取token 有则放行
  const tokenStr = window.sessionStorage.getItem('token');
  // token 为空 强制跳转login 否则放行
  if (!tokenStr) return next('/login');
  next();


})

export default router
