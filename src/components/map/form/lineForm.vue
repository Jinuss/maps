<script setup>
import { reactive, watch, onMounted, computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { Style, Icon, Stroke, Fill } from "ol/style";
import { Point } from "ol/geom";
import Overlay from "ol/Overlay";
import { useCardStore, useMapStore } from "../../../store/index.tsx";
import locImgSrc from "../../../assets/loc.png";
import rightImg from "../../../assets/right.png";
import { getSVGForSrcById, getStyleFunction } from "../../../util";
import { LINE_FORM_LINE_STYLES } from "../../../const/const.map";
import Slider from "../../../baseComponent/Slider.vue";

const cardstore = useCardStore();
const { setItem, getItem: getMarkerData } = cardstore;
const { showUuid } = storeToRefs(cardstore);

const mapStore = useMapStore();
const { mapTool } = storeToRefs(mapStore);

const props = defineProps({
    formData: Object,
});
const form = ref({
    uuid: showUuid.value,
    width: 2,
    ...props.formData,
});

const resetFrom = (p) => {
    form.value = { ...form.value, ...p };
};

const changLineStyle = (lineStyle) => {
    console.log("🚀 ~ changLineStyle ~ lineStyle:", lineStyle);
    let currentStyle = form.value.feature.getStyle();
    let newStyle = null,
        width = 2,
        color = "#f00";
    switch (lineStyle) {
        case LINE_FORM_LINE_STYLES[0].value:
            newStyle = new Style({
                stroke: new Stroke({
                    color: "red",
                    width: 2,
                }),
            });

            break;
        case LINE_FORM_LINE_STYLES[1].value:
            newStyle = new Style({
                stroke: new Stroke({
                    color: "red",
                    width: 2,
                    lineDash: [6, 4],
                }),
            });

            break;
        case LINE_FORM_LINE_STYLES[3].value:
            width = 8;
            color = "#555";
            newStyle = [
                new Style({
                    stroke: new Stroke({
                        color: color,
                        width: width,
                    }),
                }),
                new Style({
                    stroke: new Stroke({
                        color: "#fff",
                        width: width / 2,
                        lineDash: [10, 50],
                        lineCap: "square",
                        lineDashOffset: 8,
                    }),
                }),
            ];
            break;
        case LINE_FORM_LINE_STYLES[4].value:
            width = 8;
            color = "#014FA1";
            newStyle = [
                new Style({
                    stroke: new Stroke({
                        color: "#fff",
                        width: width,
                    }),
                }),
                new Style({
                    stroke: new Stroke({
                        color: color,
                        width: width,
                        lineDash: [50, 15],
                        lineCap: "square",
                    }),
                }),
            ];
            break;
        case LINE_FORM_LINE_STYLES[2].value:
            width = 8;
            color = "#25C2F2";
            newStyle = getStyleFunction({
                color,
                width,
                imgsrc: rightImg,
                wrapperRotation: (r) => -r,
            });
            break;
        case LINE_FORM_LINE_STYLES[5].value:
            width = 8;
            color = "#5BBAD3";
            let img = getSVGForSrcById({
                symbolId: "icon-right-direction",
                color: "#000",
            });
            newStyle = getStyleFunction({
                color,
                width,
                imgsrc: img,
                scale: 0.25,
                wrapperRotation: (r) => -r,
            });
            break;
        case LINE_FORM_LINE_STYLES[6].value:
            width = 8;
            color = "#B08569";
            newStyle = getStyleFunction({
                color,
                width,
                imgsrc: rightImg,
                scale: 0.25,
                wrapperRotation: (r) => -r - Math.PI / 2,
            });
            break;
        case LINE_FORM_LINE_STYLES[7].value:
            {
                width = 8;
                color = "#999";
                let img = getSVGForSrcById({
                    symbolId: "icon-right-direction",
                    color: "#000",
                });
                newStyle = getStyleFunction({
                    color,
                    width,
                    imgsrc: img,
                    scale: 0.25,
                    wrapperRotation: (r) => -r,
                });
            }
            break;
    }

    resetFrom({ color, width });
    form.value.feature.setStyle(newStyle);
};
const changeColor = (color) => {
    var currentStyle = form.value.feature.getStyle();
    form.value.feature.setStyle(
        new Style({
            stroke: new Stroke({
                color: color,
                width: currentStyle.getStroke().getWidth(),
                lineDash: currentStyle.getStroke().getLineDash(),
            }),
        })
    );
};

const changeWidth = (width) => {
    var currentStyle = form.value.feature.getStyle();
    form.value.feature.setStyle(
        new Style({
            stroke: new Stroke({
                color: currentStyle.getStroke().getColor(),
                width: width,
                lineDash: currentStyle.getStroke().getLineDash(),
            }),
        })
    );
};
</script>

<template>
    <el-form :model="form" label-width="auto" style="max-width: 600px" :class="'card_' + form.uuid">
        <el-form-item label="线条:">
            <el-select v-model="form.lineStyle" placeholder="请选择线条样式" style="width: 100%" @change="changLineStyle">
                <template #label="{ value }">
                    <span class="custom-label">
                        <i :class="'i_option ' + value"></i>
                    </span>
                </template>
                <el-option v-for="item in LINE_FORM_LINE_STYLES" :key="item.value" :label="item.value"
                    :value="item.value">
                    <i :class="'i_option ' + item.value"></i>
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="颜色:">
            <el-color-picker v-model="form.color" @change="changeColor" @active-change="changeColor" show-alpha />
        </el-form-item>
        <el-form-item label="线宽:">
            <slider :value="form.width" :min="1" :max="12" @change="changeWidth" />
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
