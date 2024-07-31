<script setup>
import { reactive, watch, onMounted } from 'vue';
import { Style, Icon } from "ol/style";
import Overlay from 'ol/Overlay'
import locImgSrc from "../../../assets/loc.png";
import { getSVGElementById } from "../../../util/index.js";

const props = defineProps({
    uid: String
})

const form = reactive({
    uid: props.uid,
    color: "#409EFF",
    size: 25,
    showName: true,
    name: "point"
})

watch(() => props.uid, (newVal) => {
    form.uid = newVal
})

const changeColor = (color) => {
    document.querySelector(`#marker_${form.uid}`).style.borderColor = color
    changeMarkerIcon(color)
}

const changeSize = (size) => {
    console.log("🚀 ~ changeSize ~ size:", size)
    let { marker: targetMarker, overlay: targetOverlay } = markers[form.uid]
    let rate = size / 25
    if (targetMarker) {
        var markerStyle = targetMarker.getStyle();
        var img = markerStyle.getImage()
        img.setScale(rate)
        targetMarker.setStyle(markerStyle);
    }

    if (targetOverlay) {
        map.removeOverlay(targetOverlay);
        let overlay = new Overlay({
            element: targetOverlay.getElement(),
            position: targetOverlay.getPosition(),
            offset: [15 * rate, -30 * rate]
        });

        map.addOverlay(overlay);
        markers[form.uid].overlay = overlay
    }
}
const changeMarkerIcon = (color) => {
    let { marker: targetMarker, } = markers[form.uid]
    if (targetMarker) {
        const originStyle = targetMarker.getStyle()
        var markerStyle = new Style({
            image: new Icon({
                anchor: [0.5, 1],
                src: getSVGElementById(true, color),
                scale: originStyle.getImage().getScale(),
            }),
        });
        targetMarker.setStyle(markerStyle);
    }
}


onMounted(() => {
    const aSpan = document.querySelectorAll('.icon_container i');
    aSpan.forEach(iSpan => {
        iSpan.addEventListener('click', () => {
            var backgroundImage = iSpan.getAttribute('data-image');
            console.log('Clicked on:', backgroundImage);
            changeMarkerIcon()
        })
    })
})
</script>
<template>
    <el-form :model="form" label-width="auto" style="max-width: 600px" :class="form.uid">
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
            <el-color-picker v-model="form.color" @change="changeColor" show-alpha />
        </el-form-item>
        <el-form-item label="符号大小:">
            <el-input-number v-model="form.size" :step="1" :precision="0" :max="50" :min="16" @change="changeSize" />
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