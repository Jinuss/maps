<script setup lang="ts">
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
