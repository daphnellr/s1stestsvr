// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import tools from './util/tools'
import tools_t from './util/toolsfortime'
import { Button, Layout, Menu, Avatar, Col, Row, Icon, Breadcrumb, Tabs, Table, Collapse, Select, DatePicker,
Divider, Tag, Card, Statistic, message } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VCharts from 'v-charts'

Vue.use(Button);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Avatar);
Vue.use(Col);
Vue.use(Row);
Vue.use(Icon);
Vue.use(Breadcrumb);
Vue.use(Tabs);
Vue.use(Table);
Vue.use(Collapse);
Vue.use(Select);
Vue.use(DatePicker);
Vue.use(Divider);
Vue.use(Tag);
Vue.use(Card);
Vue.use(Statistic);

Vue.use(VCharts);


Vue.prototype.$tools = tools;
Vue.prototype.$tools_t = tools_t;
Vue.prototype.$message = message;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});
