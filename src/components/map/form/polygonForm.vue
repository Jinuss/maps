<script setup>
import { reactive, watch, onMounted, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Style, Icon, Stroke, Fill } from "ol/style";
import Overlay from 'ol/Overlay'
import { useCardStore, useMapStore } from '../../../store/index.tsx';
import locImgSrc from "../../../assets/loc.png";
import polygon3 from "../../../assets/polygon3.png";
import { getSVGForSrcById, convertToRGBA } from "../../../util/index";
import Slider from '../../../baseComponent/Slider.vue';

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

const changeColor = (color) => {
    form.value.color = color;

    let currentStyle = form.value.feature.getStyle();

    form.value.feature.setStyle(new Style({
        stroke: currentStyle.getStroke(),
        fill: new Fill({
            color: convertToRGBA(form.value.opacity, color)
        })
    }));
}

const changeWidth = (wh) => {
    form.value.width = wh;
    let currentStyle = form.value.feature.getStyle();
    form.value.feature.setStyle(new Style({
        stroke: new Stroke({
            color: currentStyle.getStroke().getColor(),
            width: wh,
            lineDash: currentStyle.getStroke().getLineDash()
        }),
        fill: currentStyle.getFill()
    }));
}

const changeOpacity = (opacity) => {
    form.value.opacity = opacity;

    let currentStyle = form.value.feature.getStyle();

    form.value.feature.setStyle(new Style({
        stroke: currentStyle.getStroke(),
        fill: new Fill({
            color: convertToRGBA(opacity, currentStyle.getFill().getColor())
        })
    }));
}

const changeStyle = () => {
    let currentStyle = form.value.feature.getStyle();
    var cnv = document.createElement('canvas');
    var ctx = cnv.getContext('2d');
    var img = new Image();
    img.src = polygon3;
    img.onload = function () {
        var pattern = ctx.createPattern(img, 'repeat');
        form.value.feature.setStyle(new Style({
            stroke: currentStyle.getStroke(),
            fill: new Fill({
                color: pattern
            })
        }));
    };
}

onMounted(() => {
    const polygonLi = document.querySelectorAll('li')
    polygonLi.forEach(element => {
        element.addEventListener('click', () => {
            changeStyle()
        })
    });
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
            <slider :value="form.opacity" :min="0" :step="0.1" :max="1" @change="changeOpacity" />
        </el-form-item>
        <el-form-item label="轮廓宽:">
            <slider :value="form.width" :min="1" :max="12" @change="changeWidth" />
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