<script setup>
import gridControl from "./gridControl.vue";
import waterMarkerControl from "./waterMarkerControl.vue";
</script>
<template>
  <div class="drag-panel">
    <gridControl />
    <waterMarkerControl />
  </div>
</template>
<style scoped>
.drag-panel {
  position: absolute;
  background: #ffffff;
  top: 8px;
  left: 280px;
  color: #000000;
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 12px;
  line-height: 20px;
  z-index: 5;
  display: flex;
  > div {
    margin-right: 20px;
  }
}
</style>
