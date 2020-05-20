<template>
    <div class="LogTestResult"  style="padding: 10px">
        <a-tabs class="card-container" type="card">
            <a-tab-pane key="tab_1" tab="用例结果">
                <a-collapse v-model="activeKey">
                    <a-collapse-panel header="筛选条件" key="collapse_1">
                        <a-row  type="flex" align="bottom" :gutter="16">
                            <a-col span="8" style="max-width: 220px">
                                <div align="left">日期</div>
                                <a-range-picker @change="onDateChange"  :defaultValue="[moment(getLastMonth(), date_format), moment(getToday(), date_format)]" :format="date_format"></a-range-picker>
                            </a-col>
                            <a-col span="8">
                                <div align="left">状态</div>
                                <a-select @change="onStatusChange"  v-model="status_select" style="width: 150px">
                                    <a-select-option value="all">全部</a-select-option>
                                    <a-select-option value="empty">无</a-select-option>
                                    <a-select-option value="ignore">忽略</a-select-option>
                                    <a-select-option value="done">已缓存</a-select-option>
                                </a-select>
                            </a-col>
                        </a-row>
                    </a-collapse-panel>
                </a-collapse>
                <a-divider></a-divider>
                <p>ps：仅保存最仅一个月的截图数据</p>
                <a-table id="table_result" bordered :dataSource="taskList" :columns="taskColumns" style="margin: 0 0; padding:0 0">
                    <template slot="ret" slot-scope="text, record">
                        <a-tag v-if="record.ret && record.ret === '失败'" color="red">{{record.ret}}</a-tag>
                        <a-tag v-else-if="record.ret && record.ret.indexOf('成功') !== -1" color="green">{{record.ret}}</a-tag>
                        <a-tag v-else color="red">{{record.ret}}</a-tag>
                    </template>
                    <template slot="report" slot-scope="text, record">
                        <a :href="record.report" target="_blank">report</a>
                    </template>
                    <template slot="link" slot-scope="text, record">
                        <a :href="record.link" target="_blank">link</a>
                    </template>
                    <template slot="status" slot-scope="text, record">
                        <a-select v-model="record.status" option-label-prop="label" @change="()=>changeStatus(record.taskid,record.status)" style="min-width: 100px; text-align: center">
                            <a-select-option value="empty" label="无">无</a-select-option>
                            <a-select-option value="ignore" label="忽略">忽略</a-select-option>
                            <a-select-option value="done" label="已缓存">已缓存</a-select-option>
                        </a-select>
                    </template>
                </a-table>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
// eslint-disable-next-line
import moment from 'moment';
import axios from 'axios';
const taskColumns = [{
        title: '任务ID',
        dataIndex: 'taskid',
        sorter: (a, b) => a.taskid - b.taskid
    }, {
        title: '设备号',
        dataIndex: 'deviceid',
        sorter: (a, b) => a.deviceid - b.deviceid
    }, {
        title: '用例名',
        dataIndex: 'case_name'
    }, {
        title: '开始时间',
        dataIndex: 'start_time',
        width: 109,
        sorter: (a, b) => a.start_time - b.start_time
    }, {
        title: '结束时间',
        width: 106,
        dataIndex: 'end_time'
    }, {
        title: '状态',
        dataIndex: 'ret',
        scopedSlots: {customRender: 'ret'}
    }, {
        title: '执行报告',
        dataIndex: 'report',
        scopedSlots: {customRender: 'report'}
    }, {
        title: '下载链接',
        dataIndex: 'link',
        scopedSlots: {customRender: 'link'}
    }, {
        title: '备注',
        dataIndex: 'status',
        scopedSlots: {customRender: 'status'}
    }];
export default {
    name: 'WeiboCapture',
    data () {
        return {
            activeKey: ['collapse_1'],
            date_format: "YYYY-MM-DD",
            start_time: "",
            end_time: "",
            taskColumns,
            status_select: "empty",
            taskList: []
        }
    },
    watch: {
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
            // console.log('From: ', dates[0], ', to: ', dates[1]);
            // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
            this.start_time = dateStrings[0];
            this.start_time = this.start_time.replace(/-/g, '/');

            let date = new Date(this.start_time);
            date.setDate(date.getDate() - 1);
            this.start_time = this.$tools.getDefaultFormatDate(date);
            this.end_time = dateStrings[1];

            // 载入数据
            this.loadResultList();
        },
        changeStatus (taskid, status) {
            let _this = this;
            let url = '/mmsearchtest/logcheck/data/UpdateWeiboCaptureStatusByTaskid?taskid=' + taskid + '&status=' + status;
            axios.get(url).then(function (resp) {
                if (resp.data.ret) {
                    _this.$message.error("修改状态失败");
                } else {
                    console.info("status=" + status);
                }
            }).catch(function (error) {
                console.log(error);
                _this.$message.error("拉取测试结果失败！");
            });
        },
        onStatusChange (value) {
            // 载入数据 todo
            this.loadResultList();
        },
        loadResultList () {
            let _this = this;
            if (_this.start_time.length === 0) {
                _this.start_time = _this.getLastMonth();
            }
            if (_this.end_time.length === 0) {
              _this.end_time = _this.getToday();
            }
            let start_time = _this.start_time.split('-');
            let s_str = start_time[1] + '/' + start_time[2] + '/' + start_time[0];
            let end_time = _this.end_time.split('-');
            let e_str = end_time[1] + '/' + end_time[2] + '/' + end_time[0];
            let status = _this.status_select;

            // 载入表格数据
            let url = '/mmsearchtest/logcheck/data/GetWeiboCaptureResultList?date_range=' + s_str + '%20-%20' + e_str + '&status=' + status;
            axios.get(url).then(function (resp) {
                let data = [];
                let ret_data = resp.data.data;
                for (let i = 0; i < ret_data.length; i++) {
                    if (ret_data[i].ret == null || ret_data[i].ret) {
                        if (ret_data[i].ret === 1)
                            if (ret_data[i].not_run_num === 0)
                                ret_data[i].ret = '失败';
                            else
                                ret_data[i].ret = '超时';
                        else
                            ret_data[i].ret = ret_data[i].msg;
                    } else {
                        ret_data[i].ret = '成功';
                    }
                    if (!ret_data[i].status) {
                        ret_data[i].status = "empty";
                    }
                    data.push({
                        key: i,
                        taskid: ret_data[i].taskid,
                        deviceid: ret_data[i].deviceid,
                        case_name: ret_data[i].case_name,
                        start_time: ret_data[i].start_time,
                        end_time: ret_data[i].end_time,
                        logid: ret_data[i].logid,
                        ret: ret_data[i].ret,
                        report: ret_data[i].url,
                        link: ret_data[i].link,
                        status: ret_data[i].status
                    })
                }
                _this.taskList = data;
            }).catch(function (error) {
                console.log(error);
                _this.$message.error("拉取测试结果失败！");
            });
        }
    },
    mounted () {
        let _this = this;
        _this.loadResultList();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#table_result td{
    padding: 5px 5px;
    text-align: center;
}
#table_result th{
    padding: 5px 5px;
    text-align: center;
}
</style>

