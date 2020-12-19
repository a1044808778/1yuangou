import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
  const routes = [

    {
        path: '/login',// 登录
        name: 'login',
        component: function () {
            return import( '../views/login.vue')
        }
    },
    {
        path: '/', //visa首页
        name: 'index',
        component: function () {
            return import( '../views/index.vue')
        }
    },
    {
        path: '/rule', //规则
        name: 'rule',
        component: function () {
            return import( '../views/rule.vue')
        }
    },
    {
        path: '/detail',//商品详情
        name: 'detail',
        component: function () {
            return import( '../views/detail.vue')
        }
    },
    {
        path: '/checkOrder',//确认订单
        name: 'checkOrder',
        component: function () {
            return import( '../views/checkOrder.vue')
        }
    },
    {
        path: '/myorder', //我的订单
        name: 'myorder',
        component: function () {
            return import( '../views/myorder.vue')
        }
    },
    {
        path: '/order',//订单详情
        name: 'order',
        component: function () {
            return import( '../views/order.vue')
        }
    },
    {
        path: '/pay',//收银台
        name: 'pay',
        component: function () {
            return import( '../views/pay.vue')
        }
    },
]
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
