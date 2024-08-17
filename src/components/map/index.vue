<script setup>
import { ref, onMounted } from "vue";
import Map from "ol/Map";
import View from "ol/View";
import * as olProj from "ol/proj";
import { Graticule } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorSource from "ol/source/Vector";
import MVT from 'ol/format/MVT'
import { FullScreen, defaults as defaultControls, ScaleLine } from "ol/control";
import { AMAP_URL, GOOGLE_URL } from "../map/layer.js";
import tlp from "./compass.vue";
import trp from "./trp.vue";
import card from "./card.vue";
import clear from "./clear.vue";
import brp from "./brp.vue";
import topicLayerCard from './component/topicLayerCard.vue'
import "ol/ol.css";
import "./style.css";
import { MapTools } from "./MapTools/index.tsx";
import { useMapStore, useCardStore } from "../../store";

const cardStore = useCardStore();
const MapStore = useMapStore();
function getTileLayer(url, visible) {
  return new TileLayer({
    source: new XYZ({
      url: url,
    }),
  });
}
const AMAP_LAYER = getTileLayer(AMAP_URL, true);

const GOOGLE_LAYER = getTileLayer(GOOGLE_URL, true);

var vectorLayer = new VectorLayer({
  source: new VectorSource(),
});

const emit = defineEmits(["setMap"]);

let MapTool = null;

onMounted(() => {
  // 创建一个矢量图层显示网格线
  const gridLayer = new Graticule({ showLabels: true });
  const layers = { AMAP_LAYER, GOOGLE_LAYER, vectorLayer, gridLayer };
  const extent = olProj.get('EPSG:3857').getExtent();
  const map = new Map({
    layers: [AMAP_LAYER, GOOGLE_LAYER, vectorLayer, gridLayer],
    target: "map",
    view: new View({
      center: olProj.fromLonLat([114.3005, 30.5928]),
      zoom: 5,
      minZoom: 0,
      maxZoom: 22,
      // extent: extent
    }),
  });

  map.addControl(new FullScreen());
  map.addControl(new ScaleLine());
  const callback = ({ operate, type, uuid, ...rest }) => {
    if (operate == "add") {
      cardStore.addData({ type, uuid, ...rest });
    } else {
      cardStore.setShowUuid(uuid);
    }
  };
  MapTool = new MapTools(map, layers, callback);
  MapStore.setMap(MapTool);
  emit("setMap", map, layers);
  GOOGLE_LAYER.setVisible(false);
});
</script>
<template>
  <div id="map">
    <tlp />
    <trp />
    <clear />
    <card />
    <brp />
    <topicLayerCard />
  </div>
</template>
<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
