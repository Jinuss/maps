<script setup>
import { ref, onMounted } from "vue";
import Map from "ol/Map";
import View from "ol/View";
import * as olProj from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorSource from "ol/source/Vector";
import { FullScreen, defaults as defaultControls, ScaleLine } from "ol/control";
import { AMAP_URL, GOOGLE_URL } from "../map/layer.js";
import trp from "./trp.vue";
import card from "./card.vue";
import "ol/ol.css";
import "./style.css";
import { MapTools } from './utools.tsx'
function getTileLayer(url, visible) {
  return new TileLayer({
    source: new XYZ({
      url: url,
      wrapX: false,
    }),
  });
}
const AMAP_LAYER = getTileLayer(AMAP_URL, true);

const GOOGLE_LAYER = getTileLayer(GOOGLE_URL, true);

var vectorLayer = new VectorLayer({
  source: new VectorSource(),
});

const emit = defineEmits(["setMap"]);

let MapTool = null

onMounted(() => {
  const layers = { AMAP_LAYER, GOOGLE_LAYER, vectorLayer };
  const map = new Map({
    layers: [AMAP_LAYER, GOOGLE_LAYER, vectorLayer],
    target: "map",
    view: new View({
      center: olProj.fromLonLat([114.3005, 30.5928]),
      zoom: 5,
      minZoom: 1,
      maxZoom: 22,
    }),
  });

  map.addControl(new FullScreen());
  map.addControl(new ScaleLine());
  MapTool = new MapTools(map, layers, 'draw')
  emit("setMap", map, layers);
  GOOGLE_LAYER.setVisible(false);
});

const showCard = ref(false)

const changeCardVisible = (visible) => {
  showCard.value = visible
}
const operateMap = (type) => {
  console.log("🚀 ~ operateMap ~ type:", type)
  document.querySelectorAll('.ol-viewport').forEach(i => {
    i.classList.add('draw')
  })
  MapTool.removeListener()
  MapTool.addListener(type)
  changeCardVisible(true)
}

const getEventByCard = () => {
  changeCardVisible(false)
}

</script>
<template>
  <div id="map">
    <trp @operateMap="operateMap" />
    <card v-if="showCard" @getEventByCard="getEventByCard" />
  </div>
</template>
<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
