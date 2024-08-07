<script setup>
import { reactive, watch, onMounted, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Style, Icon, Stroke, Fill } from "ol/style";
import Overlay from 'ol/Overlay';
import { useCardStore, useMapStore } from '../../../store/index.tsx';
import locImgSrc from "../../../assets/loc.png";
import polygon3 from "../../../assets/polygon3.png";
import polygon4 from "../../../assets/polygon4.png";
import polygon5 from "../../../assets/polygon5.png";
import polygonsvg from '../../../assets/polygon3.svg'
import { getSVGForSrcById, convertToRGBA, getImagePattern } from "../../../util/index";
import Slider from '../../../baseComponent/Slider.vue';

const imgsObject = {
    polygon_3: polygon3,
    polygon_4: polygon4,
    polygon_5: polygon5,
}

const cardstore = useCardStore()
const { setItem, getItem: getMarkerData } = cardstore
const { showUuid } = storeToRefs(cardstore)

const mapStore = useMapStore()
const { mapTool } = storeToRefs(mapStore)

const props = defineProps({
    formData: Object
})

const form = ref({
    uuid: showUuid.value,
    polygonType: "polygon_1",
    ...props.formData
})

const resetform = (p) => {
    form.value = { ...form.value, ...p }
}

const changeColor = (color) => {
    let currentStyle = form.value.feature.getStyle();
    const { polygonType } = form.value;
    if (['polygon_1', 'polygon_2'].includes(polygonType)) {
        form.value.feature.setStyle(new Style({
            stroke: new Stroke({
                color: color,
                width: currentStyle.getStroke().getWidth()
            }),
            fill: new Fill({
                color: convertToRGBA(form.value.opacity / 100, color)
            })
        }));
    } else {
        form.value.feature.setStyle(new Style({
            stroke: new Stroke({
                color: color,
                width: currentStyle.getStroke().getWidth()
            }),
            fill: currentStyle.getFill()
        }));
    }

    resetform({ color })
}

const changeWidth = (width) => {
    let currentStyle = form.value.feature.getStyle();
    form.value.feature.setStyle(new Style({
        stroke: new Stroke({
            color: currentStyle.getStroke().getColor(),
            width: width,
            lineDash: currentStyle.getStroke().getLineDash()
        }),
        fill: currentStyle.getFill()
    }));

    resetform({ width })
}

const changeOpacity = async (opacity) => {
    let currentStyle = form.value.feature.getStyle();
    const { polygonType } = form.value;
    if (['polygon_1', 'polygon_2'].includes(polygonType)) {
        form.value.feature.setStyle(new Style({
            stroke: currentStyle.getStroke(),
            fill: new Fill({
                color: convertToRGBA(opacity / 100, currentStyle.getFill().getColor())
            })
        }));
    } else {
        const pattern = await getImagePattern(imgsObject[polygonType], opacity / 100)
        form.value.feature.setStyle(new Style({
            stroke: currentStyle.getStroke(),
            fill: new Fill({
                color: pattern
            })
        }))
    }

    resetform({ opacity })
}

const changeStyle = async (type) => {
    let currentStyle = form.value.feature.getStyle();
    let newStyle;
    const colors = {
        polygon_1: {
            strokeColor: "#f00",
            fillColor: "#f003",
            opacity: 20,
            width: 2,
        },
        polygon_2: {
            strokeColor: "#6cf",
            fillColor: "#6cf3",
            opacity: 20,
            width: 2,
        }
    }
    const img = imgsObject[type]
    if (img) {
        let colors = {
            polygon_3: {
                strokeColor: "#767676",
                opacity: 75,
                width: 1,
            },
            polygon_4: {
                strokeColor: "#6cf",
                opacity: 75,
                width: 1,
            },
            polygon_5: {
                strokeColor: "#767676",
                opacity: 75,
                width: 1,
            }
        }

        const { strokeColor: color, opacity, width } = colors[type]
        const pattern = await getImagePattern(img, opacity / 100)
        newStyle = new Style({
            stroke: new Stroke({
                color: color,
                width: width
            }),
            fill: new Fill({
                color: pattern
            })
        })
        resetform({ color, opacity, width, polygonType: type })
    } else {
        const { strokeColor, width, opacity, fillColor } = colors[type]
        newStyle = new Style({
            stroke: new Stroke({
                color: strokeColor,
                width: width
            }),
            fill: new Fill({
                color: fillColor
            })
        })

        resetform({ color: fillColor, width, opacity, polygonType: type })
    }

    form.value.feature.setStyle(newStyle)
}

onMounted(() => {
    const polygonLi = document.querySelectorAll('li')
    polygonLi.forEach(element => {
        element.addEventListener('click', () => {
            let type = element.getAttribute('type')
            changeStyle(type)
        })
    });
})

</script>

<template>
    <el-form :model="form" label-width="auto" style="max-width: 600px" :class="'card_' + form.uuid">
        <el-form-item label="填充:">
            <ul class="polygon_content">
                <li type="polygon_1"></li>
                <li type="polygon_2"></li>
                <li type="polygon_3"></li>
                <li type="polygon_4"></li>
                <li type="polygon_5"></li>
            </ul>
        </el-form-item>
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