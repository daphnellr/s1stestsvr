<template>
    <div class="LogTestResult"  style="padding: 10px">
        <a-tabs class="card-container" type="card">
            <a-tab-pane key="tab_1" tab="KV上报">
                <a-collapse v-model="activeKey">
                    <a-collapse-panel header="筛选条件" key="collapse_1">
                        <a-row  type="flex" align="bottom">
                            <a-col span="7">
                                <div align="left">协议号：</div>
                                <a-select showSearch v-model="logid_select" optionFilterProp="children" mode="multiple"
                                          style="width: 100%" placeholder="选择协议号" option-label-prop="label">
                                    <a-select-option value="log10991" label="10991">10991</a-select-option>
                                    <a-select-option value="log17510" label="17510">17510</a-select-option>
                                </a-select>
                            </a-col>
                            <a-col span="4">
                                <a-button type="primary" @click="updateByLogid">选择</a-button>
                            </a-col>
                            <a-col span="8">
                                <div align="left">日期</div>
                                <a-range-picker @change="onDateChange"  :defaultValue="[moment(getLastWeek(), date_format), moment(getToday(), date_format)]" :format="date_format"></a-range-picker>
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
                                <div align="center">用例错误次数</div>
                            </a-col>
                          </a-row>
                    </a-collapse-panel>
                </a-collapse>
                <a-divider>测试结果</a-divider>
                <a-table bordered :dataSource="taskList" :columns="taskColumns">
                </a-table>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
// eslint-disable-next-line
import moment from 'moment';
import axios from 'axios'
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
        }
        return {
            activeKey: ['collapse_1', 'collapse_2'],
            date_format: "YYYY-MM-DD",
            start_time: "",
            end_time: "",
            logid_select: [],
            taskList: [],
            chartData1: {
                columns: ['date', 'success_rates', 'failed_rates', 'OrderRate'],
                rows: [
                    { 'date': '2020-04-28', 'success_rates': 1393, 'failed_rates': 1093, 'OrderRate': 0.32 },
                    { 'date': '2020-04-29', 'success_rates': 3530, 'failed_rates': 3230, 'OrderRate': 0.26 },
                    { 'date': '2020-04-30', 'success_rates': 2923, 'failed_rates': 2623, 'OrderRate': 0.76 },
                    { 'date': '2020-05-01', 'success_rates': 1723, 'failed_rates': 1423, 'OrderRate': 0.49 },
                    { 'date': '2020-05-02', 'success_rates': 3792, 'failed_rates': 3492, 'OrderRate': 0.323 },
                    { 'date': '2020-05-03', 'success_rates': 4593, 'failed_rates': 4293, 'OrderRate': 0.78 }
                ]
            },
            chartData2: {
                columns: ['case_name', 'failed_counts'],
                rows: [
                    { 'case_name': 'case_name/1', 'failed_counts': 1393 },
                    { 'case_name': 'case_name/2', 'failed_counts': 3530 },
                    { 'case_name': 'case_name/3', 'failed_counts': 2923 },
                    { 'case_name': 'case_name/4', 'failed_counts': 1723 },
                    { 'case_name': 'case_name/5', 'failed_counts': 3792 },
                    { 'case_name': 'case_name/6', 'failed_counts': 4593 }
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
        getLastWeek () {
            let last_week = new Date();
            let targetday_milliseconds = last_week.getTime() + 1000 * 60 * 60 * 24 * (-7);
            last_week.setTime(targetday_milliseconds);
            last_week = this.$tools.getDefaultFormatDate(last_week);
            return last_week;
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

            // todo 在这里载入数据
            // if (this.filter_list.length > 0) {
            //     this.loadFilterColumn(this.filter_list[0].value, true);
            // }
            // this.loadCharts();
        },
        updateByLogid () {
            var logid = this.logid_select
            if (logid.length !== 0) {
                console.info("logid=" + logid)
                // todo 在这里载入数据
                // if (this.filter_list.length > 0) {
                //     this.loadFilterColumn(this.filter_list[0].value, true);
                // }
                // this.loadCharts();
            }
        },
        loadTaskList () {
            let _this = this;
            axios.get('/logcheck')
                .then(function (resp) {
                    if (resp.data.Ret === 0) {
                        _this.taskList = resp.data.Data;
                        // _this.$message.success("拉取任务列表成功！");
                        console.info(_this.taskList)
                    } else {
                        _this.$message.error("拉取任务列表失败！Ret：" + resp.data.Ret);
                    }
            }).catch(function (error) {
                console.log(error);
                _this.$message.error("拉取测试结果失败！");
            })
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

</style>
