<script setup>
import { reactive, watch, onMounted, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Style, Icon, Stroke, Fill } from "ol/style";
import Overlay from 'ol/Overlay'
import { useCardStore, useMapStore } from '../../../store/index.tsx';
import locImgSrc from "../../../assets/loc.png";
import Slider from '../../../baseComponent/Slider.vue';
import { getSVGForSrcById, convertToRGBA, getImagePattern } from "../../../util/index";

const cardstore = useCardStore()
const { setItem, getItem: getMarkerData } = cardstore
const { showUuid, list } = storeToRefs(cardstore)

const mapStore = useMapStore()
const { mapTool } = storeToRefs(mapStore)

const props = defineProps({
    formData: Object
})

const form = ref({
    uuid: showUuid.value,
    ...props.formData
})

const resetform = (p) => {
    form.value = { ...form.value, ...p }
}
const changeColor = (color) => {
    let { feature, opacity } = form.value
    let currentStyle = feature.getStyle()
    feature.setStyle(new Style({
        stroke: new Stroke({
            color: color,
            width: currentStyle.getStroke().getWidth()
        }),
        fill: new Fill({
            color: convertToRGBA(opacity / 100, color),
        })
    }))

    resetform({ color })
}

const changeOpacity = (opacity) => {
    let { feature } = form.value
    let currentStyle = feature.getStyle()
    feature.setStyle(new Style({
        stroke: currentStyle.getStroke(),
        fill: new Fill({
            color: convertToRGBA(opacity / 100, currentStyle.getFill().getColor()),
        })
    }))

    resetform({ opacity })
}

const changeWidth = (width) => {
    let { feature } = form.value
    let currentStyle = feature.getStyle()
    feature.setStyle(new Style({
        stroke: new Stroke({
            color: currentStyle.getStroke().getColor(),
            width: width
        }),
        fill: currentStyle.getFill()
    }))

    resetform({ width })
}
</script>

<template>
    <el-form :model="form" label-width="auto" style="max-width: 600px" :class="'card_' + form.uuid">
        <el-form-item label="颜色:">
            <el-color-picker v-model="form.color" @change="changeColor" @active-change="changeColor" show-alpha />
        </el-form-item>
        <el-form-item label="透明度:">
            <slider :value="form.opacity" :min="1" :step="1" :max="100" @change="changeOpacity" />
        </el-form-item>
        <el-form-item label="轮廓宽:">
            <slider :value="form.width" :min="1" :max="12" @change="changeWidth" />
        </el-form-item>
    </el-form>
</template>

<style scoped></style>