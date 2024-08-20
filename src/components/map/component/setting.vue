<script setup>
import { storeToRefs } from "pinia";
import { Draw } from "ol/interaction";
import { useMapStore } from "../../../store";

const mapStore = useMapStore();

const { mapTool: MapTool } = storeToRefs(mapStore);

const draw = () => {
  const draw = new Draw({
    source: MapTool.value.layers.vectorLayer.getSource(),
    type: "Polygon",
    // style: this.style2,
  });
  MapTool.value.map.addInteraction(draw);
};
</script>
<template>
  <div>设置</div>
  <el-button type="primary" @click="draw">画图</el-button>
  <el-button type="primary">挖空</el-button>
</template>
<style scoped></style>
