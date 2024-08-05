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

const value = ref('')
const lines = [
    {
        value: 'line_1',
    },
    {
        value: 'line_2',
    },
    {
        value: 'line_3',
    },
    {
        value: 'line_4',
    },
    {
        value: 'line_5',
    },
    {
        value: 'line_6',
    },
    {
        value: 'line_7',
    },
    {
        value: 'line_8',
    },
]
</script>

<template>
    <el-form :model="form" label-width="auto" style="max-width: 600px" :class="'card_' + form.uuid">
        <el-form-item label="线条:">
            <el-select v-model="value" placeholder="请选择线条样式" style="width: 100%">
                <template #label="{ value }">
                    <span class="custom-label">
                        <i :class="'i_option ' + value"></i>
                    </span>
                </template>
                <el-option v-for="item in lines" :key="item.value" :label="item.value" :value="item.value">
                    <i :class="'i_option ' + item.value"></i>
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="颜色:">
            <el-color-picker v-model="form.color" @change="changeColor" show-alpha />
        </el-form-item>
        <el-form-item label="线宽:">
            <el-slider v-model="form.size" />
        </el-form-item>
    </el-form>
</template>

<style scoped>
.custom-label {
    display: flex;
    align-items: center;
    justify-content: center;
}

.i_option {
    display: inline-block;
    background: url(../../../assets/lineOption.png) no-repeat;
    height: 8px;
    width: 180px;
}

i.line_1 {
    background-position: -0px -3px;
    height: 4px;
}

i.line_2 {
    background-position: -0px -15px;
    height: 4px;
}

i.line_3 {
    background-position: -0px -24px;
}

i.line_4 {
    background-position: -0px -36px;
}

i.line_5 {
    background-position: -0px -48px;
}

i.line_6 {
    background-position: -0px -60px;
}

i.line_7 {
    background-position: -0px -72px;
}

i.line_8 {
    background-position: -0px -84px;
}
</style>