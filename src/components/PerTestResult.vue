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
                                            <h3>页面加载总时长(ms)</h3>
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
                            <ve-bar :data="water_data" :settings="water_setting" :extend="water_extend" />
                        </a-tab-pane>
                        <a-tab-pane key="3" tab="元素分布">
                            <div style="align-content: center">资源类型统计</div>
                            <a-row  type="flex" justify="space-around">
                            <a-col>
                                <ve-pie :data="chartData1" width=400px></ve-pie>
                                <div align="center">请求数</div>
                            </a-col>
                            <a-col>
                                <ve-pie :data="chartData2" width=400px></ve-pie>
                                <div align="center">大小(Bytes)</div>
                            </a-col>
                            </a-row>
                            <br>
                            <br>
                            <br>
                            <a-table id="table_result" bordered :dataSource="taskList" :columns="taskColumns" style="margin: 0 0; padding:0 0; text-align: center"></a-table>
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
                        DNS Lookup: DNS服务器查询时间，取决于dns服务的数量，dns注册的域<br>
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
import ACol from "ant-design-vue/es/grid/Col";
import ARow from "ant-design-vue/es/grid/Row";
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
const taskColumns = [{
        title: '资源类型',
        dataIndex: 'resourse_type'
    },
    {
        title: '请求数量',
        dataIndex: 'counts'
    },
    {
        title: '大小(Bytes)',
        dataIndex: 'sizes'
    }];
export default {
    name: 'PerTestResult',
    components: {ARow, ACol},
    data () {
        this.water_extend = {
            yAxis: {
                axisLabel: {
                    show: true,
                    borderWidth: 1,
                    formatter: function (a) { let domain = a.match(/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/); return domain }
                }
            }
        };
        this.water_setting = {
            stack: {
              'xxx': ['startTime', 'dns', 'connect', 'ssl', 'ttfb', 'send', 'push', 'EndTime']
            },
            labelMap: {
                'startTime': '准备时间',
                'dns': 'dns解析率',
                'connect': '链接',
                'ssl': 'SSL认证',
                'ttfb': '首字节时间',
                'send': '下载时间',
                'push': '等待时间',
                'EndTime': '加载完毕'
            }
        };
        return {
            activeKey_1: ['collapse_select'],
            activeKey_2: ['collapse_1', 'collapse_2'],
            date_format: "YYYY-MM-DD",
            start_time: "",
            end_time: "",
            netperData: [],
            resperData: [],
            taskList: [],
            water_data: {
                columns: ['url', 'startTime', 'dns', 'connect', 'ssl', 'ttfb', 'send', 'push', 'EndTime'],
                rows: []
            },
            tab_select: "",
            netperColumns,
            resperColumns,
            taskColumns,
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
                ["文件总数", "36"]
            ],
            resourcelist_right: [
                ["requst请求数", "49"],
                ["DOM节点数", "3878"],
                ["内存占用率", "74.27%"]
            ],
            chartData1: {
                columns: ['resourse_type', 'counts'],
                rows: []
            },
            chartData2: {
                columns: ['resourse_type', 'sizes'],
                rows: []
            }
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
        },
        loadppt () {
            let data_time = [{'receiveHeadersEnd': 0, 'startTime': 0, 'url': 'https://tvax4.sinaimg.cn/crop.0.0.1080.1080.50/70dfbeb7ly8gdiqka5fssj20u00u0ju3.jpg?KID=imgbed,tva&Expires=1589040157&ssig=CqEx0JkwWE', 'send': 167, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 261, 'EndTime': 1, 'ttfb': 71, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 5, 'url': 'https://res.wx.qq.com/a/fed_upload/3b038488-88e4-423f-91db-28674abc66f7/weibo.png', 'send': 158, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 255, 'EndTime': 1, 'ttfb': 81, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 14, 'url': 'http://mmbiz.qpic.cn/mmbiz_png/792jO0g8MgjUdsf3ATXoPAhkXN1br0IGp3HeFsYvdYNZShyheRsCd6yeeFicQ6rlsscX8tAswHHa0FSYq3KcWsw/640?wx_fmt=png&wxfrom=200', 'send': 106, 'ssl': 0, 'connect': 99, 'dns': 70, 'push': 182, 'EndTime': 1, 'ttfb': 28, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 23, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/gyK2CToA8JNFiak3tT2MswSGve0XtGv6FYRJ777owDQBqpH4oUzTfG8JY5QMTKRgR2bnxQO02EpmzYa0FJ31icsg/0?wx_fmt=jpeg', 'send': 136, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 265, 'EndTime': 1, 'ttfb': 75, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 21, 'url': 'https://vpic.video.qq.com/93550819/o0961kbyokd.png', 'send': 173, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 242, 'EndTime': 1, 'ttfb': 63, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 11, 'url': 'http://y.gtimg.cn/music/photo_new/T002R120x120M000000NnvgI44vpm8_1.jpg', 'send': 110, 'ssl': 0, 'connect': 101, 'dns': 100, 'push': 137, 'EndTime': 1, 'ttfb': 40, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 11, 'url': 'http://y.gtimg.cn/music/photo_new/T002R120x120M000002uirzM4Ep3AO_1.jpg', 'send': 145, 'ssl': 0, 'connect': 104, 'dns': 102, 'push': 93, 'EndTime': 1, 'ttfb': 44, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 32, 'url': 'https://res.wx.qq.com/a/fed_upload/b219f4e7-3e2d-430f-9e26-f9067cc346dc/play.svg', 'send': 147, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 250, 'EndTime': 1, 'ttfb': 70, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 30, 'url': 'https://res.wx.qq.com/a/fed_upload/6007a6a6-6c2c-4dac-8d90-8cb6a925395c/music_3x.png', 'send': 156, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 227, 'EndTime': 1, 'ttfb': 86, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 21, 'url': 'http://shp.qpic.cn/emoji/0/76d4a9f342c3710ce7d74d6cc50e488c/140', 'send': 143, 'ssl': 0, 'connect': 136, 'dns': 70, 'push': 109, 'EndTime': 1, 'ttfb': 20, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 21, 'url': 'http://shp.qpic.cn/emoji/0/e08a94f8bbe2741ae25642787f1d1062/140', 'send': 139, 'ssl': 0, 'connect': 138, 'dns': 84, 'push': 86, 'EndTime': 1, 'ttfb': 31, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 29, 'url': 'http://shp.qpic.cn/emoji/0/5b0ed1b4943acc2b823553de657b2e8d/140', 'send': 192, 'ssl': 0, 'connect': 187, 'dns': 58, 'push': 1, 'EndTime': 1, 'ttfb': 32, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 22, 'url': 'http://shp.qpic.cn/emoji/0/d86ffc31ee0db0513d41633d6a60e3cb/140', 'send': 140, 'ssl': 0, 'connect': 136, 'dns': 74, 'push': 100, 'EndTime': 1, 'ttfb': 27, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 26, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/ficovxrludeiaOyC2lz8M2ibiaBsyZpRSOOc0RT3MTD4zVKle8oeJMBXpTrryU85Vd0NsCTUzVsKEw9PPkEhxCuQsg/640', 'send': 115, 'ssl': 0, 'connect': 97, 'dns': 82, 'push': 153, 'EndTime': 1, 'ttfb': 26, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 33, 'url': 'http://mmbiz.qpic.cn/sz_mmbiz_jpg/40ibWictOeb22qvUO6GzuSVmDVqDqJ2QXtIC5Qj49FRVXhuyqliaicl8AEbdO92lE1GNRTibtcAIAxvV0CgB1vQDBicg/640', 'send': 111, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 187, 'EndTime': 1, 'ttfb': 168, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 37, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/QEJPGBu54kqTicK5jlib5yOIjX477lGjvxaQzmicib1S6UU4rBFGEZJBYicINrCstHIK9jB5aPic5QpKF5jA6h92ibibaQ/640', 'send': 229, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 172, 'EndTime': 1, 'ttfb': 61, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 29, 'url': 'http://tx2.a.yximgs.com/upic/2020/01/06/08/BMjAyMDAxMDYwODI2MzhfMTE4NDU4NTQxNl8yMTM2OTY4MDk5NV8xXzM=_B9224490243ecba286b2a95b6ebafdda7.jpg?tag=1-1578486672-pt-0-gdriieicfy-e3d5cdaccb915700&type=hot', 'send': 104, 'ssl': 0, 'connect': 100, 'dns': 70, 'push': 158, 'EndTime': 1, 'ttfb': 38, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 41, 'url': 'http://mmbiz.qpic.cn/mmbiz_png/oZDLo2IWswDB6ZMr77vF4ibPvS5Hn9MzSzZ3WpzMge68wUCXUWShyK3zvsFezV9Vvjpjrpwx9YjOEKktRgwm2iaA/0?wx_fmt=png', 'send': 135, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 226, 'EndTime': 1, 'ttfb': 97, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 36, 'url': 'http://tx2.a.yximgs.com/upic/2019/10/08/11/BMjAxOTEwMDgxMTQ4NThfMTIyODMyOTA1NV8xODMzMTgzNDA4NV8yXzM=_Be0623cf00e5a99deb7ed7c77a118d3f4.jpg?tag=1-1574088381-pt-0-muafbe7efk-22bf5aad89372620&type=hot', 'send': 117, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 179, 'EndTime': 1, 'ttfb': 167, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 25, 'url': 'http://hw.a.yximgs.com/upic/2019/07/29/01/BMjAxOTA3MjkwMTM5MzhfMjQxMzc1ODExXzE1NzQzMzg1Njk5XzJfMw==_B39c2738c03f76d1afc2b0d9a42b1023d.jpg?tag=1-1575981138-pt-0-0lykltsz3p-fdf3a1597284bc3a', 'send': 96, 'ssl': 0, 'connect': 83, 'dns': 82, 'push': 128, 'EndTime': 1, 'ttfb': 85, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 48, 'url': 'http://mmbiz.qpic.cn/sz_mmbiz_jpg/uwMZ1kejWUn66p5WibNyZZDmNdbfMAFqzgvDc2icY5ulb6cEaMlhHn5Q6Rd2J9jctweqIQASV6NmKjciaMBSnOgWw/640', 'send': 132, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 244, 'EndTime': 1, 'ttfb': 75, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 44, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/dkFyPgxv5G4ZqrvaXgrtCLWkD4yGa740zyw01o8snVdHLfOOgaznibiaYiayPLES2WIUoibsWG9OyHvevibIicF3yticA/640', 'send': 161, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 219, 'EndTime': 1, 'ttfb': 75, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 45, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/Cq9ceVNbdhuShK1cXKoCNBw3OOq2icuiaEkSSCu3tnCnve2a10bR0osHSY5ricBoLnlVicgHuicDfRCYB388wz1K9Jg/640', 'send': 149, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 211, 'EndTime': 1, 'ttfb': 94, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 45, 'url': 'https://mmbiz.qlogo.cn/mmbiz_jpg/gLIhZ6t58xMaCPow26L0T2hV00e5Eic15Xa8ggIicWys97rsic8KmYg9zBQEL2CrJ8ZibH2UuYSiaWT4ndKNzNVMVJw/0?wx_fmt=jpeg', 'send': 154, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 207, 'EndTime': 1, 'ttfb': 93, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 46, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/SL01kv8vjY3VJWa8nicTE3vgIRluiagM67MbM7UBLfIKZapHo4fE46aDQicLYUgEKF9XcHcAUOhsKpLMke6hlUvxQ/300', 'send': 134, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 213, 'EndTime': 1, 'ttfb': 106, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 48, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/0eRfNIZZIk56fiaiaIArskDoJfGYSHrQVtrcp719YonWHRIlpCSWtHD1TPs0doyNkdGbeYLIKq2PlmmMHacjibt7w/640', 'send': 146, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 211, 'EndTime': 1, 'ttfb': 94, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 44, 'url': 'https://support.weixin.qq.com/cgi-bin/mmsupport-bin/reportforweb?rid=67698&rkey=49&rvalue=1', 'send': 189, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 171, 'EndTime': 1, 'ttfb': 95, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 53, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/rKBCaRcVshNWfuXrpx0Xia86BhnXV4XvKxibBELicfL4k8jmdDsVj06uw4eXq0A8VWZErAMxFvCoV4qOu0sZKWCYg/300', 'send': 156, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 234, 'EndTime': 1, 'ttfb': 56, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 48, 'url': 'https://mmbiz.qpic.cn/mmbiz_jpg/IRbXVDPrJaLcPTMByrG47BjjibzVPNLWS6YBt0bs0UvxSP0pEfHOvztF9h2Kliagex3wSeESiaxG7tYicCichYprjwA/0?wx_fmt=jpeg', 'send': 134, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 210, 'EndTime': 1, 'ttfb': 107, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 58, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/vk6mMDahIia5Gibwgia1F1ib4U8iazq0ZfVxJqm6lXBLZ0XkfNJL2xgNgE5R58ybFBdrbSZRzqkS0J6ibvmIoMasibabg/640', 'send': 129, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 249, 'EndTime': 1, 'ttfb': 63, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 49, 'url': 'http://shp.qpic.cn/emoji/0/76d4a9f342c3710ce7d74d6cc50e488c/0', 'send': 199, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 175, 'EndTime': 1, 'ttfb': 76, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 53, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/Suiax0pKRIfZX0ddxXSyAN5NmmiaicPBSQ2ImoNiaKfb1kY5gFA22NOHf91UZbSZ2tibgu26MnBfhib7rec7lkwtnf9w/300', 'send': 138, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 225, 'EndTime': 1, 'ttfb': 83, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 50, 'url': 'http://shp.qpic.cn/emoji/0/e08a94f8bbe2741ae25642787f1d1062/0', 'send': 193, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 194, 'EndTime': 1, 'ttfb': 62, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 49, 'url': 'http://shp.qpic.cn/emoji/0/5b0ed1b4943acc2b823553de657b2e8d/0', 'send': 195, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 183, 'EndTime': 1, 'ttfb': 72, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 50, 'url': 'http://shp.qpic.cn/emoji/0/d86ffc31ee0db0513d41633d6a60e3cb/0', 'send': 187, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 196, 'EndTime': 1, 'ttfb': 66, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 58, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/b8Zq2vNrwXZ6IhGIZ7hwedrxP7VcFCIqotQllI1q8NmJw18rWgYnqjnYPCP6S1sImSL5ENiaibswfXVwEEosBbMQ/640', 'send': 132, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 244, 'EndTime': 1, 'ttfb': 65, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 57, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/OibqGqormibtDBm0YTwUjgMKvzCs19rceIyIQ9LRnibic7fxMPDEZkDj1ricf5wxr5fo072OnRFFP0QMseNNPapbM1A/640', 'send': 140, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 231, 'EndTime': 1, 'ttfb': 71, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 57, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/WHv8MI66xut0V36E6GTNaz7ooqcmKjAIL41SU3TibibE1QcZy5vpskCS12VtrJnju3WRN0s0Yv586IIBQvJqdkfQ/640', 'send': 143, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 232, 'EndTime': 1, 'ttfb': 67, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 61, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/kiaOxjjm2uOpSyqAq4ibMwC5KeZ0QqiaLNgMKzzL5lHmh20icyzmeF69cNJHVqRbqQFDd887M5Ydoe4r6mt9oJTU2Q/300', 'send': 120, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 248, 'EndTime': 1, 'ttfb': 70, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 51, 'url': 'http://mmbiz.qpic.cn/mmbiz_jpg/MjxjVcrFf9SYzPIBaINJ68kIcTD92icgWgEI3kNFbUuRXSJHyK14tyYXlNFwEk2u2yR3dZuOeiaXWnTJemOVECyQ/300', 'send': 131, 'ssl': 0, 'connect': 0, 'dns': 0, 'push': 196, 'EndTime': 1, 'ttfb': 121, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 39, 'url': 'http://img04.sogoucdn.com/v2/thumb/crop/xy/ai/x/0/y/0/w/160/h/160/iw/80/ih/80/t/0/ir/3/retype_exclude_gif/ext/auto/q/75?t=2&appid=200807&url=http%3A%2F%2Fimg04.sogoucdn.com%2Fapp%2Fa%2F200863%2Fimg_337401_1587798472463&referer=https%3A%2F%2Fsa.sogou.com%2Fsgsearch%2Fsgs_tc_news.php%3Freq%3DgNWjMh9kjpEtYgjReTdUXXT_vcDM5HJgGPoQonvG8VxwOmTMYDwBqBPfuMdsrTQH%26user_type%3D1', 'send': 109, 'ssl': 0, 'connect': 93, 'dns': 93, 'push': 140, 'EndTime': 1, 'ttfb': 25, 'check': 500}, {'receiveHeadersEnd': 0, 'startTime': 40, 'url': 'http://img01.sogoucdn.com/v2/thumb/crop/xy/ai/x/0/y/0/w/160/h/160/iw/80/ih/80/t/0/ir/3/retype_exclude_gif/ext/auto/q/75?t=2&appid=200807&url=http%3A%2F%2Fcms-bucket.ws.126.net%2F2020%2F0430%2Ffc51617fp00q9ktvj00iic000mh00fpc.png%3FimageView%26thumbnail%3D550x0&referer=https%3A%2F%2F3g.163.com%2Fent%2Farticle%2FFBEUHE0900038FO9.html', 'send': 109, 'ssl': 0, 'connect': 99, 'dns': 76, 'push': 147, 'EndTime': 1, 'ttfb': 28, 'check': 500}]
;
            this.water_data.rows = data_time;

            let resourse_data = [
                {'resourse_type': 'css', 'counts': 2, 'sizes': 7198},
                {'resourse_type': 'html', 'counts': 16, 'sizes': 28725},
                {'resourse_type': 'img', 'counts': 30, 'sizes': 1482872},
                {'resourse_type': 'js', 'counts': 10, 'sizes': 117448},
                {'resourse_type': 'flash', 'counts': 0, 'sizes': 0}
            ];
            this.chartData1.rows = resourse_data;
            this.chartData2.rows = resourse_data;
            this.taskList = resourse_data;
        }
    },
    mounted () {
        this.loadppt();
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
