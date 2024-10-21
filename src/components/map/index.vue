<script setup>
import { ref, onMounted } from "vue";
import Map from "ol/Map";
import View from "ol/View";
import * as olProj from "ol/proj";
import { Graticule } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorSource from "ol/source/Vector";
import MVT from "ol/format/MVT";
import {
  ZoomSlider,
  FullScreen,
  defaults as defaultControls,
  ScaleLine,
  ZoomToExtent,
  OverviewMap,
} from "ol/control";
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

const cardStore = useCardStore();
const MapStore = useMapStore();
const PanelStore = usePanelStore();

const { type } = storeToRefs(PanelStore);

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
  const layers = { AMAP_LAYER, GOOGLE_LAYER, vectorLayer };

  const source = new OSM();
  const overviewMapControl = new OverviewMap({
    layers: [
      new TileLayer({
        source: source,
      }),
    ],
  });

  const map = new Map({
    layers: [AMAP_LAYER, GOOGLE_LAYER, vectorLayer],
    controls: defaultControls().extend([overviewMapControl, new ZoomSlider()]),
    target: "map",
    view: new View({
      center: olProj.fromLonLat([114.3005, 30.5928]),
      zoom: 5,
      minZoom: 0,
      maxZoom: 22,
    }),
  });

  console.log(map.getView().getViewStateAndExtent());

  map.addControl(new FullScreen());
  map.addControl(new ScaleLine());
  map.addControl(
    new ZoomToExtent({
      extent: [
        10062641.88063987, 1498445.467101972, 15385105.034193262,
        5661511.775625812,
      ],
    })
  );

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
    <dragPanel />
    <routePlan v-if="type == PANEL_TYPES.ROUTE_PLAN" />
    <bigPanel />
  </div>
</template>
<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
