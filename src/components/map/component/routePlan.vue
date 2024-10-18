<script setup>
import { ref, toRaw, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Draw } from "ol/interaction";
import Feature from "ol/Feature";
import { LineString, Point } from "ol/geom";
import Overlay from "ol/Overlay";
import { Style, Icon, Stroke, Fill, Circle } from "ol/style";
import selectPointImg from "../assets/pointIng.png";
import { useMapStore } from "../../../store";

const vectorLayer = new VectorLayer({
  source: new VectorSource(),
  className: "vector-layer",
});

const mapStore = useMapStore();

const PointFeature = ref({
  start_point: null,
  route_points: [],
  end_point: null,
});

const btnState = computed(() => {
  return (
    PointFeature.value.start_point &&
    PointFeature.value.end_point &&
    PointFeature.value.route_points.length
  );
});

const { mapTool } = storeToRefs(mapStore);

const mapInstance = toRaw(mapTool.value.map);

const activeIndex = ref("");

const listChildren = [
  { name: "起点", value: "start_point" },
  { name: "途径点", value: "route_points" },
  { name: "终点", value: "end_point" },
];

const changeActiveIndex = (index) => {
  activeIndex.value = index;
  drawStart();
};

const styles = {
  selectPointStyle: new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: selectPointImg,
      scale: 0.6,
    }),
  }),
};

const colors = {
  start_point: "#60DA78",
  end_point: "#F0533E",
  route_points: "#fff",
};

const getPointsStyle = () => {
  return new Style({
    image: new Circle({
      radius: activeIndex.value != listChildren[1].value ? 12 : 10,
      fill: new Fill({ color: colors[activeIndex.value] }),
      stroke: new Stroke({
        color: "black",
        width: 2,
      }),
    }),
  });
};

let draw = null;

const drawStart = () => {
  if (draw) {
    mapInstance.removeInteraction(draw);
    draw = null;
  }
  draw = new Draw({
    source: vectorLayer.getSource(),
    type: "Point",
    style: styles.selectPointStyle,
  });

  mapInstance.addInteraction(draw);

  draw.on("drawend", function (event) {
    const feature = event.feature;
    // feature.setGeometry(new Point(event.coordinate))
    console.log(feature.getGeometry().getCoordinates(), event);
    if (activeIndex.value == listChildren[0].value) {
      //起点
      if (PointFeature.value.start_point) {
        vectorLayer.getSource().removeFeature(PointFeature.value.start_point);
      }

      PointFeature.value.start_point = feature;
    } else if (activeIndex.value == listChildren[1].value) {
      //途径点
      PointFeature.value.route_points.push(feature);
      const coordinates = feature.getGeometry().getCoordinates();
      addOverlay(coordinates, PointFeature.value.route_points.length);
    } else {
      //终点
      if (PointFeature.value.end_point) {
        vectorLayer.getSource().removeFeature(PointFeature.value.end_point);
      }

      PointFeature.value.end_point = feature;
    }
    feature.setStyle(getPointsStyle());
  });
};

const createElement = (index) => {
  var element = document.createElement("div");
  element.className = `popMarker_path_route_points`;
  element.id = `popMarker_path_route_points_${index}`;
  element.innerHTML = index;
  return element;
};

const addOverlay = (coordinates, index) => {
  const overlay = new Overlay({
    element: createElement(index),
    positioning: "bottom-center",
    offset: [0, 70],
    position: coordinates,
  });

  mapInstance.addOverlay(overlay);
};
onMounted(() => {
  mapInstance.addLayer(vectorLayer);
});

const confirmHandle = () => {
  let path = [];

  //起点
  path.push(PointFeature.value.start_point.getGeometry().getCoordinates());

  //途径点
  PointFeature.value.route_points.forEach((feature) => {
    path.push(feature.getGeometry().getCoordinates());
  });

  //终点
  path.push(PointFeature.value.end_point.getGeometry().getCoordinates());

  console.log("🚀 ~ confirmHandle ~ path:", path);

  const lineFeature = new Feature({
    geometry: new LineString(path),
  });

  // 创建线样式
  const lineStyle = new Style({
    stroke: new Stroke({
      color: "blue", // 线的颜色
      width: 4, // 线的宽度
    }),
  });

  // 设置线样式
  lineFeature.setStyle(lineStyle);

  vectorLayer.getSource().addFeature(lineFeature);
};
</script>
<template>
  <div class="path_container">
    <div
      v-for="{ name, value } in listChildren"
      key="value"
      :class="{ item: true, active: activeIndex == value }"
      @click="() => changeActiveIndex(value)"
    >
      {{ name }}
    </div>
  </div>
  <div class="path_footer" v-show="activeIndex">
    <div>取消</div>
    <div :class="{ active: btnState }" @click="confirmHandle">完成</div>
  </div>
</template>
<style scoped>
.path_container {
  position: absolute;
  top: 60px;
  height: 120px;
  width: 104px;
  left: 30px;
  background: rgb(242, 242, 242);
  border-radius: 5px;
  box-shadow: 0 0 2 rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: rgb(51, 51, 51);
  z-index: 5;
  top: 65px;
}

.item {
  width: 100%;
  text-align: center;
  line-height: 40px;
  height: 40px;
  cursor: pointer;
}

.item.active,
.item:hover {
  background-color: rgb(72, 105, 99);
}

.item:nth-child(1).active,
.item:nth-child(1):hover {
  border-radius: 5px 5px 0 0;
}

.item:nth-child(2) {
  margin: 2px 0;
}

.item:nth-child(3).active,
.item:nth-child(3):hover {
  border-radius: 0px 0px 5px 5px;
}

.path_footer {
  position: absolute;
  width: 300px;
  height: 60px;
  bottom: 36px;
  left: calc(50% - 150px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 5;
}

.path_footer > div {
  width: 120px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 21px;
  font-weight: 700;
  color: rgb(51, 51, 51);
}
.path_footer > div:nth-child(1) {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.95),
    rgba(230, 230, 230, 0.95)
  );
}
.path_footer > div:nth-child(2) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgb(84, 84, 84);
  cursor: not-allowed;
  color: #fff;
}

.path_footer div.active {
  background-color: rgb(76, 112, 105);
  cursor: pointer;
}
</style>
