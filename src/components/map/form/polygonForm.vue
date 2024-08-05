<script setup>
import { reactive, watch, onMounted, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Style, Icon } from "ol/style";
import Overlay from 'ol/Overlay'
import { useCardStore, useMapStore } from '../../../store/index.tsx';
import locImgSrc from "../../../assets/loc.png";
import { getSVGForSrcById } from "../../../util/index.js";

const cardstore = useCardStore()
const { setItem, getItem: getMarkerData } = cardstore
const { showUuid, list } = storeToRefs(cardstore)

const mapStore = useMapStore()
const { mapTool } = storeToRefs(mapStore)
const form = reactive({
    uuid: showUuid.value,
    color: "red",
    size: 25,
    symbolId: null,
    showName: true,
    name: "point"
})

const changeColor = (color) => {
    document.querySelector(`#marker_${form.uuid}`).style.borderColor = color
}

const removeClass = () => {
    let aLi = document.querySelectorAll("span")
    aLi.forEach((i) => { i.classList.remove("active") })
}

onMounted(() => {

})

</script>

<template>
    <el-form :model="form" label-width="auto" style="max-width: 600px" :class="'card_' + form.uuid">
        <el-form-item label="填充:">
            <ul class="polygon_content">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </el-form-item>
        <el-form-item label="颜色:">
            <el-color-picker v-model="form.color" @change="changeColor" show-alpha />
        </el-form-item>
        <el-form-item label="透明度:">
            <el-slider v-model="form.size" />
        </el-form-item>
        <el-form-item label="轮廓宽:">
            <el-slider v-model="form.size" />
        </el-form-item>
    </el-form>
</template>

<style scoped>
.polygon_content {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    align-items: center;
}

.polygon_content li {
    display: inline-block;
    height: 32px;
    width: 32px;
    cursor: pointer;
    margin-bottom: 20px;
    margin-right: 20px;
}

.polygon_content li:nth-child(1) {
    background: #f003;
    border: 1px solid red;
}

.polygon_content li:nth-child(2) {
    background: #6cf3;
    border: 1px solid #6cf;
}

.polygon_content li:nth-child(3) {
    background: url(../../../assets/polygon3.png) no-repeat;
}

.polygon_content li:nth-child(4) {
    background: url(../../../assets/polygon4.png) no-repeat;
}

.polygon_content li:nth-child(5) {
    background: url(../../../assets/polygon5.png) no-repeat;
}
</style>