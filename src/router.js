import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/user/User.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { name: 'login', path: '/login', component: Login },
        {
            name: 'home', path: '/home', component: Home,redirect:'/welcome',
            children: [
                { name: 'welcome', path: '/welcome', component: Welcome },
                {name:'user',path:'/users',component:User}
            ]
        },
    ]
})

//挂载路由守卫
router.beforeEach((to, from, next) => {
    //to去哪里
    //from从哪儿来
    //next一个函数表示放行

    //用户要登录
    if (to.path === '/login') return next()

    //获取token
    const tokenstr = window.sessionStorage.getItem('token')
    if (!tokenstr) return next('/login')
    next()
})


export default router