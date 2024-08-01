<script setup>
import { reactive, watch, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Style, Icon } from "ol/style";
import Overlay from 'ol/Overlay'
import { useCardStore, useMapStore } from '../../../store';
import locImgSrc from "../../../assets/loc.png";
import { getSVGForSrcById } from "../../../util/index.js";

const cardstore = useCardStore()
const { setItem, getItem: markerData } = cardstore
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
    changeMarkerIcon({ color })
}

const changeSize = (size) => {
    console.log("🚀 ~ changeSize ~ size:", size)
    let { marker: targetMarker, overlay: targetOverlay } = markerData
    let rate = size / 25
    if (targetMarker) {
        var markerStyle = targetMarker.getStyle();
        var img = markerStyle.getImage()
        img.setScale(rate)
        targetMarker.setStyle(markerStyle);
    }

    if (targetOverlay) {
        mapTool.value.map.removeOverlay(targetOverlay);
        let overlay = new Overlay({
            element: targetOverlay.getElement(),
            position: targetOverlay.getPosition(),
            offset: [15 * rate, -30 * rate]
        });

        mapTool.value.map.addOverlay(overlay);

        setItem({overlay})
    }
}

const changeMarkerIcon = ({ symbolId, color }) => {
    symbolId = symbolId || form.symbolId;
    color = color || form.color
    let { marker: targetMarker } = markerData
    if (targetMarker) {
        const originStyle = targetMarker.getStyle()
        var markerStyle = new Style({
            image: new Icon({
                anchor: [0.5, 1],
                src: getSVGForSrcById({ symbolId, color }),
                scale: originStyle.getImage().getScale(),
            }),
        });
        targetMarker.setStyle(markerStyle);
    }
}

const removeClass = () => {
    let aLi = document.querySelectorAll("span")
    aLi.forEach((i) => { i.classList.remove("active") })
}

onMounted(() => {
    const aI = document.querySelectorAll('.icon_container i');
    aI.forEach(oI => {
        oI.addEventListener('click', () => {
            removeClass()
            oI.parentNode.classList.add("active")
            const symbolId = oI.className
            form.symbolId = symbolId
            changeMarkerIcon({ symbolId })
        })
    })
})

const handleClickDefault = (e) => {
    removeClass()
    document.querySelector("#defaultIcon").classList.add("active")
    const symbolId = "icon-symbol-one"
    form.symbolId = symbolId
    changeMarkerIcon({ symbolId })
}

const changeShowName = (visible) => {
    let { overlay: targetOverlay } = markerData
    if (targetOverlay) {
        if (visible) {
            mapTool.value.map.addOverlay(targetOverlay);
        } else {
            mapTool.value.map.removeOverlay(targetOverlay);
        }
    }
}

</script>

<template>
    <el-form :model="form" label-width="auto" style="max-width: 600px" :class="'card_' + form.uuid">
        <el-form-item label="符号集合:">
            <div class="icon_container">
                <span @click="handleClickDefault" id="defaultIcon" class="active">
                    <svg width="26px" height="26px" fill="red" aria-hidden="true" focusable="false" class="">
                        <use xlink:href="#icon-symbol-one"></use>
                    </svg>
                    <span>默认</span>
                </span>
                <span><i class="icon-restaurant"></i><span>餐饮</span></span>
                <span><i class="icon-accommodation"></i><span>住宿</span></span>
                <span><i class="icon-shopping"></i><span>购物</span></span>
                <span><i class="icon-automobile"></i><span>4s店</span></span>
                <span><i class="icon-finance"></i><span>金融</span></span>
                <span><i class="icon-culture"></i><span>教育</span></span>
                <span><i class="icon-hygiene"></i><span>卫生</span></span>
                <span><i class="icon-sports"></i><span>休闲</span></span>
                <span><i class="icon-office"></i><span>机关</span></span>
                <span><i class="icon-storage"></i><span>商业</span></span>
                <span><i class="icon-life"></i><span>服务</span></span>
                <span><i class="icon-company"></i><span>公司</span></span>
                <span><i class="icon-traffic"></i><span>交通</span></span>
                <span><i class="icon-scientific-research"></i><span>科研</span></span>
                <span><i class="icon-agriculture"></i><span>农业</span></span>
                <span><i class="icon-place-name"></i><span>地名</span></span>
                <span><i class="icon-facilities"></i><span>设施</span></span>
            </div>
        </el-form-item>
        <el-form-item label="符号颜色:">
            <el-color-picker v-model="form.color" @change="changeColor" show-alpha />
        </el-form-item>
        <el-form-item label="符号大小:">
            <el-input-number v-model="form.size" :step="1" :precision="0" :max="50" :min="16" @change="changeSize" />
        </el-form-item>
        <el-form-item label="显示名称:">
            <el-switch v-model="form.showName" @change="changeShowName" />
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

.icon_container>span.active {
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

i.icon-restaurant {
    background-position: -56px -28px;
}

i.icon-accommodation {
    background-position: -1px -1px;
}

i.icon-shopping {
    background-position: -222px -1px;
}

i.icon-automobile {
    background-position: -194px -28px;
}

i.icon-finance {
    background-position: -166px -1px;
}

i.icon-culture {
    background-position: -111px -1px;
}

i.icon-hygiene {
    background-position: -29px -1px;
}

i.icon-sports {
    background-position: -56px -1px;
}

i.icon-office {
    background-position: -194px -1px;
}

i.icon-storage {
    background-position: -84px -28px;
}

i.icon-life {
    background-position: -84px -1px;
}

i.icon-company {
    background-position: -1px -28px;
}

i.icon-traffic {
    background-position: -139px -1px;
}

i.icon-scientific-research {
    background-position: -29px -28px;
}

i.icon-agriculture {
    background-position: -111px -28px;
}

i.icon-place-name {
    background-position: -166px -28px;
}

i.icon-facilities {
    background-position: -139px -28px;
}
</style>