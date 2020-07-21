import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/user/User.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'
import Cate from './components/good/Cate.vue'
import Params from './components/good/Params.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { name: 'login', path: '/login', component: Login },
        {
            name: 'home', path: '/home', component: Home,redirect:'/welcome',
            children: [
                { name: 'welcome', path: '/welcome', component: Welcome },
                {name:'user',path:'/users',component:User},
                {name:'rights',path:'/rights',component:Rights},
                {name:'roles',path:'/roles',component:Roles},
                {name:'categories',path:'/categories',component:Cate},
                {name:'params',path:'/params',component:Params},
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