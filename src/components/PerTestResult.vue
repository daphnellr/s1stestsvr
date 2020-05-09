<template>
    <div class="PerTestResult" style="padding: 3px">
        <a-tabs class="card-container" type="card">
            <a-tab-pane key="tab_1" tab="性能监控">
                <a-collapse v-model="activeKey_1">
                    <a-collapse-panel header="筛选条件" key="collapse_select" style="min-width: 400px;">
                        <a-row  type="flex" align="bottom"  :gutter="16">
                            <a-col span="8" style="width: 220px; text-align: center">
                                <div align="left">日期</div>
                                <a-range-picker @change="onDateChange"  :defaultValue="[moment(getLastMonth(), date_format), moment(getToday(), date_format)]" :format="date_format"></a-range-picker>
                            </a-col>
                            <a-col span="8">
                                <div align="left">页面类型</div>
                                <a-select @change="onTabChange"  default-value="mixer_tab" style="width: 150px">
                                    <a-select-option value="mixer_tab">混排页</a-select-option>
                                    <a-select-option value="music_tab">音乐tab</a-select-option>
                                </a-select>
                            </a-col>
                        </a-row>
                    </a-collapse-panel>
                </a-collapse>
                <a-divider>测试结果</a-divider>
                <div class="card-container">
                    <a-tabs  :v-model="tab_select">
                        <a-tab-pane key="1" tab="性能总览">
                            <div class="perall">
                                <h2>页面性能总览</h2>
                                <a-row :gutter="16">
                                    <a-col :span="9">
                                        <a-card :bordered="true" style="height: 311px">  <!--111*n+89-->
                                            <h3>页面加载时间(ms)</h3>
                                            <p>1758</p>
                                            <p class="p_css"  v-for="data in resourcelist_main" :key="data[0]">{{ data[0] }}:{{ data[1] }}</p>
                                        </a-card>
                                    </a-col>
                                    <a-col :span="7">
                                        <div v-for="data in resourcelist_left" :key="data[0]">
                                            <a-card :bordered="true" style="height: 90px">
                                                <h4>{{ data[0] }}</h4><p>{{ data[1] }}</p>
                                            </a-card>
                                            <br>
                                        </div>
                                    </a-col>
                                    <a-col :span="7">
                                        <div v-for="data in resourcelist_right" :key="data[0]">
                                            <a-card :bordered="true" style="height: 90px">
                                                <h4>{{ data[0] }}</h4><p>{{ data[1] }}</p>
                                            </a-card>
                                            <br>
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                            <br>
                            <div class="perall">
                                <h3>网络性能</h3>
                                <a-table bordered :dataSource="netperData" :columns="netperColumns" style="margin: 0 0; padding:0 0">
                                </a-table>
                            </div>
                            <br>
                            <div class="perall">
                                <h3>资源性能</h3>
                                <a-table bordered :dataSource="resperData" :columns="resperColumns" style="margin: 0 0; padding:0 0">
                                </a-table>
                            </div>
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="详情分析">
                            <p>Content of Tab Pane 2</p>
                            <p>Content of Tab Pane 2</p>
                            <p>Content of Tab Pane 2</p>
                        </a-tab-pane>
                        <a-tab-pane key="3" tab="元素分布">
                            <p>Content of Tab Pane 3</p>
                            <p>Content of Tab Pane 3</p>
                            <p>Content of Tab Pane 3</p>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-tab-pane>
            <a-tab-pane key="tab_2" tab="性能指标">
                <a-collapse v-model="activeKey_2">
                    <a-collapse-panel header="示例1" key="collapse_1">
                        文件总数：65<br>总加载时长：12.594s<br>CPU最高占用：70%以上
                    </a-collapse-panel>
                    <a-collapse-panel header="示例2" key="collapse_2">
                        Cache:缓存读取时间，或304错误的处理时间<br>
                        BlockTime: 请求等待时间，取决于缓存检查，网络连接等待<br>
                        DNS Lookup: DNS服务器茶渣时间，取决于dns服务的数量，dns注册的域<br>
                        Connect：TCP链接时间，取决于链接类型<br>
                        Send first to last: 发送请求内容的时间，取决于请求内容大小及上行传输速度<br>
                        Wait: 等待相应的时间，取决于网络环境的响应，Web服务器的处理时间<br>
                        Receive first to last: 接受响应内容的时间，取决于响应内容、下行的传输速度、服务器的带宽<br>
                    </a-collapse-panel>
                </a-collapse>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import moment from 'moment'
const netperColumns = [{
        title: '指标',
        dataIndex: 'title'
    },
    {
        title: '明细',
        dataIndex: 'detail'
    }];
const resperColumns = [{
        title: '资源',
        dataIndex: 'title'
    }, {
        title: '大小(kb)',
        dataIndex: 'size'
    }, {
        title: '耗时',
        dataIndex: 'times'
    }, {
        title: '个数',
        dataIndex: 'counts'
    }];
export default {
    name: 'PerTestResult',
    data () {
        return {
            activeKey_1: ['collapse_select'],
            activeKey_2: ['collapse_1', 'collapse_2'],
            date_format: "YYYY-MM-DD",
            start_time: "",
            end_time: "",
            netperData: [],
            resperData: [],
            tab_select: "",
            netperColumns,
            resperColumns,
            resourcelist_main: [
                ["首字节时间(ms)", "24"],
                ["内容加载时间(ms)", "26"],
                ["DOM树解析时间(ms)", "1731"],
                ["DNS缓存时间(ms)", "0"],
                ["DNS查询时间(ms)", "0"],
                ["TCP连接耗时(ms)", "0"],
                ["白屏时间(ms)", "219"],
                ["重定向时间(ms)", "0"]
            ],
            resourcelist_left: [
                ["加载总流量(kb)", "0"],
                ["Cookies大小(kb)", "0"],
                ["待定", "0"]
            ],
            resourcelist_right: [
                ["requst请求数", "49"],
                ["DOM节点数", "3878"],
                ["memory", "74.27%"]
            ]
        }
    },
    methods: {
        moment,
        getToday () {
            return this.$tools.getDefaultFormatDate(new Date());
        },
        getLastMonth () {
            return this.$tools_t.getLastMonth();
        },
        onDateChange (dates, dateStrings) {
            this.start_time = dateStrings[0];
            this.start_time = this.start_time.replace(/-/g, '/');

            let date = new Date(this.start_time);
            date.setDate(date.getDate() - 1);
            this.start_time = this.$tools.getDefaultFormatDate(date);
            this.end_time = dateStrings[1];

            // 载入数据 todo
            // this.loadTaskList();
        },
        onTabChange (value) {
            console.log(`selected ${value}`);
            // 载入数据 todo
            // this.loadTaskList();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.perall{
    background-color: #eeeeee;
    padding: 20px;
    width: 670px;
    margin:0 auto;
    text-align: center;
    vertical-align: middle;
}
.p_css{
    margin: 0 auto;
    text-align: left;
    max-width: 650px;
 }
.card-container {
  overflow: hidden;
  padding: 24px;
}
</style>
