<script setup>
import { reactive } from 'vue';
const form = reactive({
    color: "#409EFF",
    size: 10,
    showName: true,
    name: "point"
})
</script>
<template>
    <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="符号集合:">
            <div class="icon_container">
                <span><i class="cy"></i><span>餐饮</span></span>
                <span><i class="zs"></i><span>住宿</span></span>
                <span><i class="gw"></i><span>购物</span></span>
                <span><i class="sd"></i><span>4s店</span></span>
                <span><i class="jr"></i><span>金融</span></span>
                <span><i class="jy"></i><span>教育</span></span>
                <span><i class="ws"></i><span>卫生</span></span>
                <span><i class="xs"></i><span>休闲</span></span>
                <span><i class="jg"></i><span>机关</span></span>
                <span><i class="sy"></i><span>商业</span></span>
                <span><i class="fw"></i><span>服务</span></span>
                <span><i class="gs"></i><span>公司</span></span>
                <span><i class="jt"></i><span>交通</span></span>
                <span><i class="ky"></i><span>科研</span></span>
                <span><i class="ny"></i><span>农业</span></span>
                <span><i class="dm"></i><span>地名</span></span>
                <span><i class="ss"></i><span>设施</span></span>
            </div>
        </el-form-item>
        <el-form-item label="符号颜色:">
            <el-color-picker v-model="form.color" />
        </el-form-item>
        <el-form-item label="符号大小:">
            <el-input-number v-model="form.size" :step="1" :precision="0" :max="50" :min="10" />
        </el-form-item>
        <el-form-item label="显示名称:">
            <el-switch v-model="form.showName" />
        </el-form-item>
    </el-form>
</template>
<style scoped>
.icon_container {
    border: 1px solid #d9d9d9;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 6px 6px 6px 10px;
    width: 240px;
    align-items: center;
    display: flex
}

.icon_container>span {
    /* border: 1px solid #0000; */
    cursor: pointer;
    flex-direction: column;
    height: 70px;
    transition: all .3s;
    width: 44px;
    align-items: center;
    display: flex;
    justify-content: center;
}

.icon_container>span:hover {
    color: #149bf0;
}

.icon_container i {
    background: url(../../../assets/marker.png) no-repeat;
    display: inline-block;
    height: 26px;
    width: 26px;
}

.icon_container span span {
    font-size: 12px;
    margin-top: 5px
}

i.cy {
    background-position: -56px -28px;
}

i.zs {
    background-position: -1px -1px;
}

i.gw {
    background-position: -222px -1px;
}

i.sd {
    background-position: -194px -28px;
}

i.jr {
    background-position: -166px -1px;
}

i.jy {
    background-position: -111px -1px;
}

i.ws {
    background-position: -29px -1px;
}

i.xs {
    background-position: -56px -1px;
}

i.jg {
    background-position: -194px -1px;
}

i.sy {
    background-position: -84px -28px;
}

i.fw {
    background-position: -84px -1px;
}

i.gs {
    background-position: -1px -28px;
}

i.jt {
    background-position: -139px -1px;
}

i.ky {
    background-position: -29px -28px;
}

i.ny {
    background-position: -111px -28px;
}

i.dm {
    background-position: -166px -28px;
}

i.ss {
    background-position: -139px -28px;
}
</style>