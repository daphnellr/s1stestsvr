<template>
    <a-layout id="app" style="min-height: 100vh">
        <a-layout-sider v-model="collapsed" collapsible>
            <a-row>
                <br><br>
                <a-col span="24" align="center">
                    <h3 v-if="collapsed" style="color: white">Result</h3>
                    <h1 v-else style="color: white">搜一搜<br>测试结果</h1>
                </a-col>
            </a-row>
            <a-row>
                <a-col span="24" align="center">
                    <a-avatar size="large" :src="loginUserAvatar" align="center" />
                </a-col>
                <a-col span="24" align="center">
                    <h5 v-if="collapsed" style="color: white">{{loginUserEngName}}</h5>
                    <h5 v-else style="color: white">{{loginUserEngName}}({{loginUserChnName}})</h5>
                </a-col>
            </a-row>
            <a-menu theme="dark" mode="inline" style="padding-top: 20px" align="left"
                :defaultSelectedKeys="[selectedKey.key]" :defaultOpenKeys="[selectedKey.box]">
                <a-menu-item key="0">
                    <router-link to="/mmsearchtest/LogTestResult">
                        <a-icon type="dashboard" /><span>首页</span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="1">
                    <router-link to="/mmsearchtest/LogTestResult">
                        <a-icon type="file-text" /><span>上报测试</span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="2">
                    <router-link to="/mmsearchtest/PerTestResult">
                        <a-icon type="dot-chart" /><span>性能测试</span>
                    </router-link>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-content style="margin: 0 16px; position: relative">
                <a-breadcrumb style="margin: 16px 0"  align="left">
                    <a-breadcrumb-item v-for="bread in getBread" :key="bread">{{ bread }}</a-breadcrumb-item>
                </a-breadcrumb>
                <div :style="{ padding: '5px', background: '#fff', minHeight: '360px' }">
                    <router-view class="view"></router-view>
                </div>
            </a-layout-content>
            <br>
            <a-layout-footer style="text-align: center; bottom: 0;">
                微信测试中心      Copyright © 1998-2022 Tencent Inc. All Rights Reserved.
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script>
import store from './store'
export default {
    name: 'App',
    data () {
        return {
            collapsed: false,
            selectedKey: this.getSelectedKeys(),
            loginUserEngName: "Guest",
            loginUserChnName: "南极企鹅",
            loginUserAvatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
            breadList: []

        }
    },
    methods: {
        getSelectedKeys: function () {
            // console.log(window.location.href);
            let url = window.location.href;
            if (url.search("Dashboard") !== -1)
                return {key: "0", box: ""};
            if (url.search("LogTestResult") !== -1)
                return {key: "1", box: ""};
            if (url.search("PerTestResult") !== -1)
                return {key: "2", box: ""};
            return {key: '0', box: ''};
        }

    },
    computed: {
        getBread () {
            // eslint-disable-next-line
            this.breadList = store.getters.getLevel;
            return store.getters.getLevel;
        }
    }
}
</script>

<style>
#app {
    position:relative;
    min-height:100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    color: #2c3e50;
    height: 32px;
    margin: 2px;
}
</style>
