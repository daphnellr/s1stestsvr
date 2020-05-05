import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import HelloWorld from '@/components/HelloWorld'
import PerTestResult from '../components/PerTestResult'
import LogTestResult from '../components/LogTestResult'

Vue.use(Router)

const router = new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            name: '首页',
            component: HelloWorld
        },
        {
            path: '/PerTestResult',
            name: '性能测试',
            component: PerTestResult
        },
        {
            path: '/LogTestResult',
            name: '上报测试',
            component: LogTestResult
        },
        {
            path: '/HelloWorld',
            name: 'HelloWorld',
            component: HelloWorld
        }
    ]
})

router.beforeEach((to, from, next) => {
  // 更新面包导航
  store.dispatch("setLevel", to.name.split("-"));
  next();
});

export default router;
