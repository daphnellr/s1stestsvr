import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import PerTestResult from '../components/PerTestResult'
import LogTestResult from '../components/LogTestResult'
import WeiboCapture from '../components/Others/WeiboCapture'

Vue.use(Router);

const router = new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            name: '首页',
            component: LogTestResult
        },
        {
            path: '/mmsearchtest',
            name: '首页',
            component: LogTestResult
        },
        {
            path: '/mmsearchtest/PerTestResult',
            name: '性能测试',
            component: PerTestResult
        },
        {
            path: '/mmsearchtest/LogTestResult',
            name: '上报测试',
            component: LogTestResult
        },
        {
            path: '/mmsearchtest/Others/WeiboCapture',
            name: '其他-微博截图',
            component: WeiboCapture
        }
    ]
});

router.beforeEach((to, from, next) => {
  // 更新面包导航
  store.dispatch("setLevel", to.name.split("-"));
  next();
});

export default router;
