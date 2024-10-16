<script setup>
import { storeToRefs } from "pinia";
import { Graticule } from "ol/layer";
import { useMapStore } from "../../../store";

const mapStore = useMapStore();

const gridLayerClassName = "gridLayer";

const gridLayer = new Graticule({
  className: gridLayerClassName,
  showLabels: true,
  visible: false,
});

const { showGrid, mapTool } = storeToRefs(mapStore);

const changeHandle = (visible) => {
  const map = mapTool.value.map;
  let layer = map
    .getLayers()
    .getArray()
    .find((i) => i.getClassName() == gridLayerClassName);
  if (!layer) {
    map.addLayer(gridLayer);
    layer = gridLayer;
  }

  layer.setVisible(visible);
};
</script>

<template>
  <div>
    <el-checkbox label="经纬网格" v-model="showGrid" @change="changeHandle" />
  </div>
</template>

<style scoped></style>
