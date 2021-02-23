import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/components/Login";

Vue.use(Router);

const router = new Router({
    routes: [
        {path: '/', redirect: '/login'},
        {path: '/login', component: Login},
    ]
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next()
});

// to将要访问的路径
// from 代表从哪个路径调转来
// next是一个函数，表示放行
// next()放行，next('/login')强制跳转

export default router