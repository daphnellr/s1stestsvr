/**
 * Created by daphneli on 2020/05/06.
 */
/* eslint-disable */
import tools from './tools'
export default {

    getLastMonth () {
        let last_week = new Date();
        let targetday_milliseconds = last_week.getTime() + 1000 * 60 * 60 * 24 * (-31);
        last_week.setTime(targetday_milliseconds);
        last_week = tools.getDefaultFormatDate(last_week);
        return last_week;
    }
}
