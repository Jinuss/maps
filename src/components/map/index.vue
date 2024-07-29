<script setup>
import { ref, onMounted } from "vue";
import { AMAP_URL, GOOGLE_URL } from "../map/layer.js";
import { getTileLayer } from "../map/utils.js";

const AMAP_LAYER = getTileLayer(AMAP_URL, true);

const GOOGLE_LAYER = getTileLayer(GOOGLE_URL, true);

var vectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
});

onMounted(() => {
  const map = new ol.Map({
    layers: [AMAP_LAYER, GOOGLE_LAYER, vectorLayer],
    target: "map",
    view: new ol.View({
      center: ol.proj.fromLonLat([114.3005, 30.5928]),
      zoom: 10,
      minZoom: 4,
      maxZoom: 18,
    }),
  });

  GOOGLE_LAYER.setVisible(false);
});
</script>
<template>
  <div id="map"></div>
</template>
<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
