<script setup>
import { ref, onMounted, nextTick, toRaw } from "vue";
import Map from "ol/Map";
import View from "ol/View";
import * as olProj from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorSource from "ol/source/Vector";
import {
  ZoomSlider,
  FullScreen,
  defaults as defaultControls,
  ScaleLine,
  ZoomToExtent,
  OverviewMap,
} from "ol/control";
import {
  VECTOR_LAYER,
  AMAP_URL,
  LAYER_NAMES,
  AMAP_LAYER,
  GOOGLE_LAYER,
} from "./layers.tsx";
import { EXTENT, ZOOM, CENTER } from "./const.map.tsx";

const emit = defineEmits(["setMap"]);

const initMap = () => {
  const overviewMapControl = new OverviewMap({
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
  });

  const map = new Map({
    layers: [AMAP_LAYER, VECTOR_LAYER],
    target: "map",
    view: new View({
      center: olProj.fromLonLat(CENTER),
      zoom: ZOOM.INIT,
      minZoom: ZOOM.MIN,
      maxZoom: ZOOM.MAX,
    }),
  });

  map.addControl(overviewMapControl);

  map.addControl(new ZoomSlider());

  map.addControl(new FullScreen());

  map.addControl(new ScaleLine());

  map.addControl(new ZoomToExtent({ extent: EXTENT }));

  emit("setMap", map);
};

onMounted(() => {
  nextTick(() => {
    initMap();
  });
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
