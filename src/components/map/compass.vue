<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { easeOut } from "ol/easing";
import { useMapStore } from "../../store";

const { mapTool: MapTool } = storeToRefs(useMapStore());

const rotate = ref(0);

let currentDir = "";

const handleLeftClick = () => {
    var view = MapTool.value.map.getView();
    var rotation = view.getRotation();
    rotation = rotation - Math.PI / 8;
    rotate.value -= 22.5;
    view.animate({
        center: view.getCenter(), //旋转中心点
        rotation: rotation,
        easing: easeOut, //旋转速度
    });
};

const handleRightClick = () => {
    var view = MapTool.value.map.getView();
    var rotation = view.getRotation();
    rotation = rotation + Math.PI / 8;
    rotate.value += 22.5;
    view.animate({
        center: view.getCenter(), //旋转中心点
        rotation: rotation,
        easing: easeOut, //旋转速度
    });
};

const handleRecovery = () => {
    var view = MapTool.value.map.getView();
    rotate.value = 0;
    view.animate({
        center: view.getCenter(), //旋转中心点
        rotation: 0,
        easing: easeOut, //旋转速度
    });
};
</script>
<template>
    <div class="compass" style="transform: rotate(0deg)">
        <el-tooltip class="box-item" effect="dark" content="逆时针旋转" placement="left" :offset="10">
            <span class="left" @click="handleLeftClick"></span>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="复位" placement="top" :offset="10">
            <span class="center" @click="handleRecovery" :style="{ transform: `rotate(${rotate}deg)` }"></span>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="顺时针旋转" placement="bottom" :offset="10">
            <span class="right" @click="handleRightClick"></span>
        </el-tooltip>
    </div>
</template>
<style scoped>
.compass {
    height: 54px;
    width: 52px;
    position: absolute;
    right: 18px;
    bottom: 48px;
    z-index: 5;
    background: url(../../assets/earth-navi-control-pc4.png) 0% 0% / 266px no-repeat;

    .left,
    .center,
    .right {
        position: absolute;
        outline: none;
        border: none;
        cursor: pointer;
        opacity: 1;
    }

    .left {
        left: 2px;
        top: 5px;
        z-index: 5;
        width: 15px;
        height: 42px;
        background: url(../../assets/earth-navi-control-pc4.png) -75px -5px / 266px no-repeat;
    }

    .left:hover {
        background: url(../../assets/earth-navi-control-pc4.png) -89px -5px / 266px no-repeat;
    }

    .center {
        background: url(../../assets/earth-navi-control-pc4.png) -56px -4px / 266px no-repeat;
        left: 19px;
        top: 4px;
        width: 14px;
        height: 44px;
        transform: rotate(0deg);
        transition: 1s;
    }

    .right {
        right: 2px;
        top: 5px;
        z-index: 5;
        width: 15px;
        height: 42px;
        transform: scaleX(-1);
        background: url(../../assets/earth-navi-control-pc4.png) -75px -5px / 266px no-repeat;
    }

    .right:hover {
        background: url(../../assets/earth-navi-control-pc4.png) -89px -5px / 266px no-repeat;
    }
}
</style>
