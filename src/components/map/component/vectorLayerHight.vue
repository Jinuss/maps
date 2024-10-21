<script setup>
import { ref, onMounted } from "vue";
import { Map, View } from "ol";
import { Style, Fill, Stroke, Text } from "ol/style";
import LayerVector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import lands from "../../../assets/lands.json";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";

const highlightStyle = new Style({
  stroke: new Stroke({
    color: "#f00",
    width: 1,
  }),
  fill: new Fill({
    color: "rgba(255, 0, 0, 0.1)",
  }),
  text: new Text({
    font: "12px Calibri, sans-serif",
    fill: new Fill({
      color: "#000",
    }),
    stroke: new Stroke({
      color: "#f00",
      width: 3,
    }),
  }),
});

const infoRef = ref(null);

const map = ref(null);

const highlight = ref(null);

let featureOverlay = null;

const displayFeatureInfo = (pixel) => {
  // 创建高亮图层
  if (!featureOverlay) {
    featureOverlay = new LayerVector({
      source: new SourceVector(),
      map: map.value,
      style: (feature) => {
        highlightStyle.getText().setText(feature.get("name"));
        return highlightStyle;
      },
    });
  }
  // 获取点击的要素
  let feature = map.value.forEachFeatureAtPixel(pixel, (feature) => feature);
  let info = infoRef.value;
  // 获取要素信息
  if (feature) {
    info.innerHTML = feature.getId() + ": " + feature.get("name");
  } else {
    info.innerHTML = "&nbsp;";
  }
  // 设置高亮要素
  if (feature !== highlight.value) {
    if (highlight.value) {
      featureOverlay.getSource().removeFeature(highlight.value);
    }

    if (feature) {
      featureOverlay.getSource().addFeature(feature);
    }
    highlight.value = feature;
  }
};

const initMap = () => {
  let style = new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.6)",
    }),
    stroke: new Stroke({
      color: "#319FD3",
      width: 1,
    }),
    text: new Text({
      font: "12px Calibri,sans-serif",
      fill: new Fill({
        color: "#000",
      }),
      stroke: new Stroke({
        color: "#fff",
        width: 3,
      }),
    }),
  });

  let vectorLayer = new LayerVector({
    source: new SourceVector({
      features: new GeoJSON({
        featureProjection: "EPSG:3857",
      }).readFeatures(lands),
      format: new GeoJSON(),
      wrapX: true,
    }),
    style: (feature) => {
      style.getText().setText(feature.get("name"));
      return style;
    },
  });

  map.value = new Map({
    target: "modal_map",
    layers: [vectorLayer],
    view: new View({
      center: fromLonLat([0, 0]),
      zoom: 1,
    }),
  });

  map.value.on("pointermove", (evt) => {
    if (evt.dragging) {
      return;
    }
    let pixel = map.value.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
  });

  map.value.on("click", (evt) => {
    displayFeatureInfo(evt.pixel);
  });
};

onMounted(() => {
  initMap();
});
</script>
<template>
  <div class="vm">
    <div class="info" ref="infoRef"></div>
    <div id="modal_map" class="map-x"></div>
  </div>
</template>
<style scoped>
.vm {
  height: 100%;
  width: 100%;
}
#modal_map {
  height: 100%;
  width: 100%;
}

.info {
  position: absolute;
  text-align: center;
  top: 10px;
  font-weight: 700;
  text-align: center;
  color: red;
  width: 100%;
  z-index: 5;
}
</style>
