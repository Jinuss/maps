<script setup lang="ts">
import { ref, onMounted } from "vue";

const Viewer = ref();

onMounted(async () => {
  const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ODZkMDQzOS03ZGJjLTQzZWUtYjlmYy04ZmM5Y2UwNzNhMmYiLCJpZCI6MjU5LCJpYXQiOjE2MzgyMDYwMDB9.cK1hsaFBgz0l2dG9Ry5vBFHWp-HF2lwjLC0tcK8Z8tY"
  Cesium.Ion.defaultAccessToken = token;

  const viewer = new Cesium.Viewer("cesium", {
    timeline: false, // 不显示时间线
    animation: false, // 不显示动画控制
    geocoder: false, // 不显示搜索按钮编码器
    homeButton: true, // 显示初视角按钮
    sceneModePicker: false, // 显示投影方式选择器
    baseLayerPicker: false, // 显示基础图层选择器
    navigationHelpButton: false, // 不显示帮助按钮
    fullscreenButton: true, // 显示全屏按钮,
    terrain: Cesium.Terrain.fromWorldTerrain(),
  });
  // 隐藏Cesium Ion图标
  viewer.cesiumWidget.creditContainer.style.display = "none";

  Viewer.value = viewer;
  try {
    const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(40866);
    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset);
  } catch (error) {
    console.log(`Error loading tileset: ${error}`);
  }
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
