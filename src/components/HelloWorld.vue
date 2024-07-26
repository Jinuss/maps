<script setup lang="ts">
import { ref, onMounted } from "vue";

onMounted(() => {
  const viewer = new Cesium.Viewer("cesium");
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
