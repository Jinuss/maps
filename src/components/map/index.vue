<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { AMAP_URL, GOOGLE_URL } from "../map/layer.js";
import tlp from "./compass.vue";
import trp from "./trp.vue";
import card from "./card.vue";
import clear from "./clear.vue";
import brp from "./brp.vue";
import topicLayerCard from "./component/topicLayerCard.vue";
import dragPanel from "./dragPanel/index.vue";
import routePlan from "./component/routePlan.vue";
import "./style.css";
import { MapTools } from "./MapTools/index.tsx";
import { useMapStore, useCardStore, usePanelStore } from "../../store";
import { PANEL_TYPES } from "../../const/const.panel.tsx";
import bigPanel from "./component/bigPanel.vue";
import OpenlayersMap from "../../baseComponent/OpenlayersMap/map.vue";

const cardStore = useCardStore();
const MapStore = useMapStore();
const PanelStore = usePanelStore();

const { type } = storeToRefs(PanelStore);

let MapTool = null;

const initMap = () => {
  const map = null;
  MapTool = new MapTools(map, layers, callback);
  MapStore.setMap(MapTool);
  GOOGLE_LAYER.setVisible(false);
};

onMounted(() => {
  // initMap();
  console.log(456);
});

const getMap = (map) => {
  console.log("🚀 ~ getMap ~ map:", map);
  
};
</script>
<template>
  <!-- <div id="map">
    <tlp />
    <trp />
    <clear />
    <card />
    <brp />
    <topicLayerCard />
    <dragPanel />
    <routePlan v-if="type == PANEL_TYPES.ROUTE_PLAN" />
    <bigPanel />
  </div> -->

  <!-- 地图及其控件-->
  <OpenlayersMap @setMap="getMap" />
</template>
<style scoped></style>
