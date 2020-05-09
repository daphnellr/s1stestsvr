<template>
    <div class="LogTestResult"  style="padding: 10px">
        <a-tabs class="card-container" type="card">
            <a-tab-pane key="tab_1" tab="KV上报">
                <a-collapse v-model="activeKey">
                    <a-collapse-panel header="筛选条件" key="collapse_1">
                        <a-row  type="flex" align="bottom" :gutter="16">
                            <a-col span="8" style="max-width: 220px">
                                <div align="left">日期</div>
                                <a-range-picker @change="onDateChange"  :defaultValue="[moment(getLastMonth(), date_format), moment(getToday(), date_format)]" :format="date_format"></a-range-picker>
                            </a-col>
                            <a-col span="7" style="max-width: 260px">
                                <div align="left">协议号：</div>
                                <a-select showSearch v-model="logid_select" optionFilterProp="children" mode="multiple"
                                          style="width: 100%" placeholder="选择协议号" option-label-prop="label">
                                    <a-select-option value="10991" label="log10991">log10991</a-select-option>
                                    <a-select-option value="17510" label="log17510">log17510</a-select-option>
                                </a-select>
                            </a-col>
                            <a-col span="4">
                                <a-button type="primary" @click="updateByLogid">选择</a-button>
                            </a-col>
                        </a-row>
                    </a-collapse-panel>
                    <a-collapse-panel header="结果总览"  key="collapse_2">
                        <a-row  type="flex" justify="space-around">
                            <a-col>
                                <ve-line :data="chartData1" :settings="chartSettings1" width=400px></ve-line>
                                <div align="center">校验成功率</div>
                            </a-col>
                            <a-col>
                                <ve-pie :data="chartData2" :settings="chartSettings2" width=400px></ve-pie>
                                <div align="center">用例错误次数(不含超时用例)</div>
                            </a-col>
                          </a-row>
                    </a-collapse-panel>
                </a-collapse>
                <a-divider>测试结果</a-divider>
                <a-table id="table_result" bordered :dataSource="taskList" :columns="taskColumns" style="margin: 0 0; padding:0 0">
                    <template slot="ret" slot-scope="text, record">
                        <a-tag v-if="record.ret && record.ret === '失败'" color="red">{{record.ret}}</a-tag>
                        <a-tag v-else-if="record.ret && record.ret.indexOf('成功') !== -1" color="green">{{record.ret}}</a-tag>
                        <a-tag v-else color="red">{{record.ret}}</a-tag>
                    </template>
                    <template slot="report" slot-scope="text, record">
                        <a :href="record.report" target="_blank">link</a>
                    </template>
                </a-table>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
// eslint-disable-next-line
import moment from 'moment';
import axios from 'axios'
const taskColumns = [{
        title: '任务ID',
        dataIndex: 'taskid',
        sorter: (a, b) => a.taskid - b.taskid
    },
    {
        title: '开始时间',
        dataIndex: 'start_time',
        width: 109,
        sorter: (a, b) => a.start_time - b.start_time
    },
    {
        title: '结束时间',
        width: 106,
        dataIndex: 'end_time'
    },
    {
        title: '上报协议号',
        dataIndex: 'logid'
    },
    {
        title: '状态',
        dataIndex: 'ret',
        scopedSlots: {customRender: 'ret'}
    },
    {
        title: '用例总数',
        dataIndex: 'case_num'
    },
    {
        title: '失败用例数',
        dataIndex: 'failed_num'
    },
    {
        title: '超时用例数',
        dataIndex: 'not_run_num'
    },
    {
        title: 'crash次数',
        dataIndex: 'crash_num'
    },
    {
        title: '报告',
        dataIndex: 'report',
        scopedSlots: {customRender: 'report'}
    }];

export default {
    name: 'PerTestResult',
    data () {
        this.chartSettings1 = {
            labelMap: {
                'success_rates': '成功率',
                'failed_rates': '失败率'
            }
        };
        this.chartSettings2 = {
            limitShowNum: 5
        };
        return {
            activeKey: ['collapse_1', 'collapse_2'],
            date_format: "YYYY-MM-DD",
            start_time: "",
            end_time: "",
            taskColumns,
            logid_select: [],
            taskList: [],
            chartData1: {
                columns: [],
                rows: []
            },
            chartData2: {
                columns: ['case_name', 'failed_counts'],
                rows: [
                    { 'case_name': '无', 'failed_counts': 0 }
                ]
            }
        }
    },
    watch: {
        logid_select (val) {
            console.log(`selected:`, val);
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
            // console.log('From: ', dates[0], ', to: ', dates[1]);
            // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
            this.start_time = dateStrings[0];
            this.start_time = this.start_time.replace(/-/g, '/');

            let date = new Date(this.start_time);
            date.setDate(date.getDate() - 1);
            this.start_time = this.$tools.getDefaultFormatDate(date);
            this.end_time = dateStrings[1];

            // 载入数据
            this.loadTaskList();
        },
        updateByLogid () {
            let logid = this.logid_select;
            if (logid.length !== 0) {
                console.info("logid=" + logid);
            }
            // 载入数据
            this.loadTaskList();
        },
        loadTaskList () {
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
            let url = '/mmsearchtest/logcheck/data/GetHistoryStatByType?date_range=' + s_str + '%20-%20' + e_str + '&log_range=' + _this.logid_select;
            axios.get(url)
                .then(function (resp) {
                    if (resp.data.pie.length > 0) {
                        // _this.$message.success("拉取任务列表成功！");

                        // 载入饼状图
                        _this.chartData2.rows = [];
                        if (resp.data.pie[0][1] === 0) {
                            _this.chartData2.rows.push({ 'case_name': '无', 'failed_counts': 0 })
                        } else {
                            for (let i = 0; i < resp.data.pie.length; i++) {
                                _this.chartData2.rows.push(
                                  {'case_name': resp.data.pie[i][0], 'failed_counts': resp.data.pie[i][1]}
                                )
                            }
                        }

                        // 载入折线图
                        if (resp.data.quxian_data.length !== 0 && resp.data.quxian_days.length !== 0) {
                            _this.chartData1.columns = ['时间'];
                            _this.chartData1.rows = [];
                            for (let j = 0; j < resp.data.quxian_days.length; j++) {
                                _this.chartData1.rows.push({'时间': resp.data.quxian_days[j]});
                            }
                            for (let i = 0; i < resp.data.quxian_data.length; i++) {
                                _this.chartData1.columns.push(resp.data.quxian_data[i].name);
                                let name = resp.data.quxian_data[i].name;
                                for (let j = 0; j < resp.data.quxian_days.length; j++) {
                                    _this.chartData1.rows[j][name] = resp.data.quxian_data[i].data[j];
                                }
                            }
                        }
                    } else {
                        _this.$message.error("拉取任务列表失败！Ret：" + resp.data);
                    }
            }).catch(function (error) {
                console.log(error);
                _this.$message.error("拉取测试结果失败！");
            });

            // 载入表格数据
            url = '/mmsearchtest/logcheck/data/GetCheckResultList?date_range=' + s_str + '%20-%20' + e_str + '&log_range=' + _this.logid_select;
            axios.get(url).then(function (resp) {
                let data = [];
                let ret_data = resp.data.data;
                for (let i = 0; i < ret_data.length; i++) {
                    ret_data[i].not_run_num = ret_data[i].case_num - ret_data[i].pass_num - ret_data[i].failed_num;
                    if (ret_data[i].ret == null || ret_data[i].ret) {
                        if (ret_data[i].ret === 1)
                            if (ret_data[i].not_run_num === 0)
                                ret_data[i].ret = '失败';
                            else
                                ret_data[i].ret = '超时';
                        else if (ret_data[i].ret === 4 || ret_data[i].pass_num === ret_data[i].case_num)
                            ret_data[i].ret = '成功但有crash';
                        else
                            ret_data[i].ret = ret_data[i].msg;
                    } else {
                        ret_data[i].ret = '成功';
                    }
                    data.push({
                        key: i,
                        taskid: ret_data[i].taskid,
                        start_time: ret_data[i].start_time,
                        end_time: ret_data[i].end_time,
                        logid: ret_data[i].logid,
                        ret: ret_data[i].ret,
                        case_num: ret_data[i].case_num,
                        failed_num: ret_data[i].failed_num,
                        not_run_num: ret_data[i].not_run_num,
                        crash_num: ret_data[i].crash_num,
                        report: ret_data[i].url
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
        _this.loadTaskList();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#table_result td{
    padding: 5px 5px;
    text-align: center;
}
</style>
