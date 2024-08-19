<script setup>
import { ref, onMounted } from "vue";
import { CESIUM_VIEWER_OPTIONS, ACCESS_TOKEN } from "../../const/const.cesium";

const Viewer = ref();

onMounted(
  () => {
    Cesium.Ion.defaultAccessToken = ACCESS_TOKEN;

    const viewer = new Cesium.Viewer("cesium", {
      ...CESIUM_VIEWER_OPTIONS,
    });

    viewer.cesiumWidget.creditContainer.style.display = "none";
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(104.1954, 35.8617, 40000000) // 中国中心坐标和缩放级别
    });
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
