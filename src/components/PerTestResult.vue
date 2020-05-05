<template>
    <div class="PerTestResult" style="padding: 10px">
        <a-collapse v-model="activeKey">
            <a-collapse-panel header="筛选条件" key="1">
                <a-row>
                    <a-col>

                    </a-col>
                </a-row>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
export default {
    name: 'PerTestResult',
    data () {
        return {
            activeKey: ['1']
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
