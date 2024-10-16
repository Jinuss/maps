<script setup>
import { storeToRefs } from "pinia";
import Tile from "ol/layer/Tile";
import XYZ from "ol/source/XYZ.js";
import { useMapStore } from "../../../store";
import { transformExtent } from "ol/proj";

const mapStore = useMapStore();

const layerClassName = "water_marker";

const waterMarkText = "Openlayers";

// 创建canvas
const createCanvasContext2D = (opt_width, opt_height) => {
  const canvas = document.createElement("canvas");
  if (opt_width) {
    canvas.width = opt_width;
  }
  if (opt_height) {
    canvas.height = opt_height;
  }
  return canvas.getContext("2d");
};

const getSource = () => {
  return new XYZ({
    tileUrlFunction: (t) => {
      var tileSize = [512, 512];
      const half = tileSize[0] / 2;
      var tileSize = [512, 512];

      const context = createCanvasContext2D(tileSize[0], tileSize[0]);

      context.fillStyle = "rgba(184, 184, 184, 0.8)";

      context.textAlign = "center";
      context.textBaseline = "middle";

      context.font = "32px microsoft yahei";

      context.rotate((Math.PI / 180) * 30);

      context.fillText(waterMarkText, half, half);

      return context.canvas.toDataURL();
    },
    extent: transformExtent([-180, -85, 180, 85], "EPSG:4326", "EPSG:3857"),
  });
};
//水印瓦片图层
const getWaterMarkLayer = new Tile({
  source: getSource(),
  className: layerClassName,
  visible: false,
});

const { showWaterMarker, mapTool } = storeToRefs(mapStore);

const changeHandle = (visible) => {
  const map = mapTool.value.map;
  let layer = map
    .getLayers()
    .getArray()
    .find((i) => i.getClassName() == layerClassName);
  if (!layer) {
    map.addLayer(getWaterMarkLayer);
    layer = getWaterMarkLayer;
  }

  layer.setVisible(visible);
};
</script>

<template>
  <div>
    <el-checkbox
      label="地图水印"
      v-model="showWaterMarker"
      @change="changeHandle"
    />
  </div>
</template>

<style scoped></style>
