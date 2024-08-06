<script setup>
import { reactive, watch, onMounted, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Style, Icon, Stroke, Fill, Circle, RegularShape } from "ol/style";
import { Point, LineString } from 'ol/geom'
import Overlay from 'ol/Overlay'
import { useCardStore, useMapStore } from '../../../store/index.tsx';
import locImgSrc from "../../../assets/loc.png";
import rightImg from '../../../assets/right.png';
import { getSVGForSrcById } from "../../../util/index.js";
import { LINE_FORM_LINE_STYLES } from '../../../const/const.map'

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
    width: 2,
    ...props.formData,
})

const changLineStyle = (lineStyle) => {
    console.log("🚀 ~ changLineStyle ~ lineStyle:", lineStyle)
    let currentStyle = form.value.feature.getStyle();
    let newStyle = null
    switch (lineStyle) {
        case LINE_FORM_LINE_STYLES[0].value:
            newStyle = new Style({
                stroke: new Stroke({
                    color: "red",
                    width: 2,
                })
            })
            form.value.width = 2;
            form.value.color = "#f00"
            break;
        case LINE_FORM_LINE_STYLES[1].value:
            newStyle = new Style({
                stroke: new Stroke({
                    color: "red",
                    width: 2,
                    lineDash: [6, 4]
                })
            })
            form.value.width = 2;
            form.value.color = "#f00"
            break;
        case LINE_FORM_LINE_STYLES[2].value:
            newStyle = () => {
                let res = mapTool.value.map.getView().getResolution()
                var line = form.value.feature.getGeometry();
                var styles = [
                    new Style({
                        stroke: new Stroke({
                            color: '#25C2F2',
                            width: 8
                        })
                    })
                ];
                //轨迹地理长度
                let length = line.getLength();
                //像素间隔步长
                let stpes = 40;//像素步长间隔
                //将像素步长转实际地理距离步长
                let geo_steps = stpes * res;
                //箭头总数
                let num = parseInt(length / geo_steps);
                for (let i = 1; i <= num; i++) {
                    let fraction = i / (num + 1)
                    let arraw_coor = line.getCoordinateAt(fraction);
                    // 获取当前箭头的前一个点和后一个点
                    let previousCoordinate = line.getCoordinateAt(fraction - 0.001);
                    let nextCoordinate = line.getCoordinateAt(fraction + 0.001);

                    // 计算箭头的旋转角度

                    let rotation = Math.atan2(nextCoordinate[1] - previousCoordinate[1], nextCoordinate[0] - previousCoordinate[0]);
                    styles.push(new Style({
                        geometry: new Point(arraw_coor),
                        image: new Icon({
                            src: rightImg,
                            scale: 0.5,
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            rotation: -rotation
                        })
                    }));
                }
                return styles;
            }
            form.value.width = 8;
            form.value.color = "#25C2F2"
            break;
        case LINE_FORM_LINE_STYLES[3].value:
            newStyle = [new Style({
                stroke: new Stroke({
                    color: "#555",
                    width: 8,
                })
            }), new Style({
                stroke: new Stroke({
                    color: "#fff",
                    width: 4,
                    lineDash: [10, 50],
                    lineCap: "square",
                    lineDashOffset: 8
                })
            })]
            form.value.width = 8;
            form.value.color = "#555"
            break;
        case LINE_FORM_LINE_STYLES[4].value:
            newStyle = [new Style({
                stroke: new Stroke({
                    color: "#fff",
                    width: 8,
                })
            }), new Style({
                stroke: new Stroke({
                    color: "#014FA1",
                    width: 8,
                    lineDash: [50, 15],
                    lineCap: "square",
                })
            })]
            form.value.width = 8;
            form.value.color = "#014FA1"
            break;
        case LINE_FORM_LINE_STYLES[5].value:
            newStyle = () => {
                let res = mapTool.value.map.getView().getResolution()
                var line = form.value.feature.getGeometry();
                var styles = [
                    new Style({
                        stroke: new Stroke({
                            color: '#5BBAD3',
                            width: 8
                        })
                    })
                ];
                //轨迹地理长度
                let length = line.getLength();
                //像素间隔步长
                let stpes = 40;//像素步长间隔
                //将像素步长转实际地理距离步长
                let geo_steps = stpes * res;
                //箭头总数
                let num = parseInt(length / geo_steps);
                for (let i = 1; i <= num; i++) {
                    let fraction = i / (num + 1)
                    let arraw_coor = line.getCoordinateAt(fraction);
                    // 获取当前箭头的前一个点和后一个点
                    let previousCoordinate = line.getCoordinateAt(fraction - 0.001);
                    let nextCoordinate = line.getCoordinateAt(fraction + 0.001);

                    // 计算箭头的旋转角度

                    let rotation = Math.atan2(nextCoordinate[1] - previousCoordinate[1], nextCoordinate[0] - previousCoordinate[0]);

                    styles.push(new Style({
                        geometry: new Point(arraw_coor),
                        image: new Icon({
                            src: getSVGForSrcById({ symbolId: "icon-right-direction", color: "#000" }),
                            scale: 0.25,
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            rotation: - rotation
                        })
                    }));
                }
                return styles;
            }
            form.value.width = 8;
            form.value.color = "#5BBAD3"
            break;
        case LINE_FORM_LINE_STYLES[6].value:
            newStyle = () => {
                let res = mapTool.value.map.getView().getResolution()
                var line = form.value.feature.getGeometry();
                var styles = [
                    new Style({
                        stroke: new Stroke({
                            color: '#B08569',
                            width: 8
                        })
                    })
                ];
                //轨迹地理长度
                let length = line.getLength();
                //像素间隔步长
                let stpes = 40;//像素步长间隔
                //将像素步长转实际地理距离步长
                let geo_steps = stpes * res;
                //箭头总数
                let num = parseInt(length / geo_steps);
                for (let i = 1; i <= num; i++) {
                    let fraction = i / (num + 1)
                    let arraw_coor = line.getCoordinateAt(fraction);
                    // 获取当前箭头的前一个点和后一个点
                    let previousCoordinate = line.getCoordinateAt(fraction - 0.001);
                    let nextCoordinate = line.getCoordinateAt(fraction + 0.001);

                    // 计算箭头的旋转角度

                    let rotation = Math.atan2(nextCoordinate[1] - previousCoordinate[1], nextCoordinate[0] - previousCoordinate[0]);

                    styles.push(new Style({
                        geometry: new Point(arraw_coor),
                        image: new Icon({
                            src: rightImg,
                            scale: 0.25,
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            rotation: - rotation - Math.PI / 2
                        })
                    }));
                }
                return styles;
            }
            form.value.width = 8;
            form.value.color = "#B08569"
            break;
        case LINE_FORM_LINE_STYLES[7].value:
            newStyle = () => {
                let res = mapTool.value.map.getView().getResolution()
                var line = form.value.feature.getGeometry();
                var styles = [
                    new Style({
                        stroke: new Stroke({
                            color: '#999',
                            width: 8
                        })
                    })
                ];
                //轨迹地理长度
                let length = line.getLength();
                //像素间隔步长
                let stpes = 40;//像素步长间隔
                //将像素步长转实际地理距离步长
                let geo_steps = stpes * res;
                //箭头总数
                let num = parseInt(length / geo_steps);
                for (let i = 1; i <= num; i++) {
                    let fraction = i / (num + 1)
                    let arraw_coor = line.getCoordinateAt(fraction);
                    // 获取当前箭头的前一个点和后一个点
                    let previousCoordinate = line.getCoordinateAt(fraction - 0.001);
                    let nextCoordinate = line.getCoordinateAt(fraction + 0.001);

                    // 计算箭头的旋转角度

                    let rotation = Math.atan2(nextCoordinate[1] - previousCoordinate[1], nextCoordinate[0] - previousCoordinate[0]);

                    styles.push(new Style({
                        geometry: new Point(arraw_coor),
                        image: new Icon({
                            src: getSVGForSrcById({ symbolId: "icon-right-direction", color: "#000" }),
                            scale: 0.25,
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            rotation: - rotation
                        })
                    }));
                }
                return styles;
            }
            form.value.width = 8;
            form.value.color = "#999"
            break;
    }


    form.value.feature.setStyle(newStyle)
}
const changeColor = (color) => {
    var currentStyle = form.value.feature.getStyle();
    form.value.feature.setStyle(new Style({
        stroke: new Stroke({
            color: color,
            width: currentStyle.getStroke().getWidth(),
            lineDash: currentStyle.getStroke().getLineDash()
        })
    }));
}

const changeWidth = (width) => {
    var currentStyle = form.value.feature.getStyle();
    form.value.feature.setStyle(new Style({
        stroke: new Stroke({
            color: currentStyle.getStroke().getColor(),
            width: width,
            lineDash: currentStyle.getStroke().getLineDash()
        })
    }));
}

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
            <el-color-picker v-model="form.color" @change="changeColor" show-alpha />
        </el-form-item>
        <el-form-item label="线宽:">
            <el-slider v-model="form.width" :max="10" :min="1" @change="changeWidth" />
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