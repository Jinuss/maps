<script setup lang="ts">
import { ref, onMounted } from "vue";

const Viewer = ref();

onMounted(() => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MmY4OWI5NS1jYmRjLTRmNDEtOTc3Mi1hZDA0MmEwNzhiZjMiLCJpZCI6MTg5MTAxLCJpYXQiOjE3MDQ5NTI1NzB9.FCrykPmsDWRhmCWe_-P3yy0KD00Lg2mkbr0fg3ZFlpo";

  Cesium.Ion.defaultAccessToken = token;

  const viewer = new Cesium.Viewer("cesium", {
    timeline: false, // 不显示时间线
    animation: false, // 不显示动画控制
    geocoder: false, // 不显示搜索按钮编码器
    homeButton: true, // 显示初视角按钮
    sceneModePicker: false, // 显示投影方式选择器
    baseLayerPicker: false, // 显示基础图层选择器
    navigationHelpButton: false, // 不显示帮助按钮
    fullscreenButton: true, // 显示全屏按钮
  });
  // 隐藏Cesium Ion图标
  viewer.cesiumWidget.creditContainer.style.display = "none";

  Viewer.value = viewer;
});
</script>

<template>
  <div id="cesium"></div>
</template>

<style scoped>
#cesium {
  height: 100%;
  width: 100%;
}
</style>
