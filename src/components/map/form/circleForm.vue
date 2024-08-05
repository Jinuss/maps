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
</style>