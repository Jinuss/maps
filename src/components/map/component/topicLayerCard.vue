<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { PANEL_MAP_TYPE } from "../../../const";
import { useTopicLayerStore, useMapStore, usePanelStore } from "../../../store";
import { ClusterTools } from "../MapTools/ClusterTools";
import { HeatMapTools } from "../MapTools/HeatMapTools";
import { MaskTools } from "../MapTools/MaskTools";
import { WeatherTools } from "../MapTools/WeatherTools";
import { TimeTools } from "../MapTools/TimeTools";
import clusterImage from "../assets/cluster.png";
import heatMapImage from "../assets/heatMap.jpg";
import maskImage from "../assets/mask.jpg";
import weatherImage from "../assets/weather.jpg";
import vectorImage from "../assets/vector.png";
import timeImage from "../assets/time.jpg";
import setting from "./setting.vue";

const mapStore = useMapStore();
const topicStore = useTopicLayerStore();

const panelStore = usePanelStore();

const { visible } = storeToRefs(topicStore);

let clusterTool = ref();

let heatMapTool = ref();

let maskTool = ref();

let weatherTool = ref();

let timeTool = ref();

const hideCard = () => {
  resetMap();
  topicStore.setVisible(false);
};

const handleCluster = () => {
  if (!clusterTool.value) {
    clusterTool.value = new ClusterTools({ mapTool: mapStore.mapTool });
  }

  clusterTool.value.createMarkers();
};

const handleHeatMap = () => {
  if (!heatMapTool.value) {
    heatMapTool.value = new HeatMapTools({ mapTool: mapStore.mapTool });
  }

  heatMapTool.value.addFeatures();
};

const handleMaskMap = () => {
  if (!maskTool.value) {
    maskTool.value = new MaskTools({ mapTool: mapStore.mapTool });
  }
};

const handleWeatherMap = () => {
  if (!weatherTool.value) {
    weatherTool.value = new WeatherTools({ mapTool: mapStore.mapTool });
  }
};

const handleTimeMap = () => {
  if (!timeTool.value) {
    timeTool.value = new TimeTools({ mapTool: mapStore.mapTool });
  }
};

onMounted(() => {});

const MAP_THEMES = [
  {
    name: "聚合图层",
    type: "cluster",
    callback: handleCluster,
    src: clusterImage,
  },
  {
    name: "热力图",
    type: "heatMap",
    callback: handleHeatMap,
    src: heatMapImage,
  },
  {
    name: "蒙版图层",
    type: "maskMap",
    callback: handleMaskMap,
    src: maskImage,
  },
  {
    name: "气象专题",
    type: "weatherMap",
    callback: handleWeatherMap,
    src: weatherImage,
  },
  {
    name: "时间专题",
    type: "timeMap",
    callback: handleTimeMap,
    src: timeImage,
  },
  {
    name: "矢量图高亮",
    type: "vectorHighlightMap",
    callback: () => {
      panelStore.setBigPanelType(PANEL_MAP_TYPE.VECTOR_LAYER);
    },
    src: vectorImage,
  },
];
const showSetting = ref(false);

const handleClickSet = () => {
  showSetting.value = !showSetting.value;
};

const activeType = ref("");

const handleClick = ({ callback, type }) => {
  activeType.value = type;
  resetMap();
  if (callback) {
    callback();
  }
};

const resetMap = () => {
  if (clusterTool.value) {
    clusterTool.value.remove();
    clusterTool.value = null;
  }

  if (heatMapTool.value) {
    heatMapTool.value.remove();
    heatMapTool.value = null;
  }

  if (weatherTool.value) {
    weatherTool.value.remove();
    weatherTool.value = null;
  }

  if (maskTool.value) {
    maskTool.value.remove();
    maskTool.value = null;
  }

  if (timeTool.value) {
    timeTool.value.remove();
    timeTool.value = null;
  }
};
</script>

<template>
  <div class="topic_card_panel" v-if="visible">
    <div class="card_header">
      <span>专题图</span>
      <span
        role="img"
        tabindex="-1"
        class="anticon Head_close__0vFMi"
        @click="hideCard"
      >
        <svg
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
          class=""
        >
          <use xlink:href="#icon-close"></use>
        </svg>
      </span>
    </div>
    <div class="card_body">
      <div class="container">
        <div class="topic_list" v-if="!showSetting">
          <el-card
            :class="
              activeType == topic.type ? 'topic_card active' : 'topic_card'
            "
            style="width: 200px; margin: 10px 14px"
            shadow="hover"
            v-for="topic in MAP_THEMES"
          >
            <template #header>
              <div class="card-topic-header">
                <span>{{ topic.name }}</span>
                <el-icon :size="18" @click="handleClickSet">
                  <Setting />
                </el-icon>
              </div>
            </template>
            <template #default>
              <div class="card-topic-body">
                <img :src="topic.src" @click="() => handleClick(topic)" />
              </div>
            </template>
          </el-card>
        </div>
        <div>
          <!-- <setting /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.topic_card_panel {
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 2px 4px #0000004d;
  min-height: 200px;
  position: absolute;
  right: 70px;
  top: 100px;
  width: 500px;
  z-index: 5;
}

.card_header {
  background-color: #3385ff;
  color: #fff;
  font-size: 16px;
  justify-content: space-between;
  line-height: 45px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  display: flex;
}

.card_body {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: auto;
  min-height: 200px;
  max-height: calc(-190px + 100vh);
}

.card_body_footer {
  display: flex;
  justify-content: center;
  padding: 0 10px 20px;
}

.container {
  position: relative;
  overflow: scroll;
  margin-right: -17px;
  margin-bottom: -17px;
  min-height: 217px;
  max-height: calc(-173px + 100vh);
}

.topic_list {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
}

.Head_close__0vFMi {
  cursor: pointer;
}
.card-topic-body {
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-topic-header {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

:deep(.el-card__body) {
  padding: 10px;
}
:deep(.el-card__header) {
  padding: 6px;
}

.card-topic-body {
  cursor: pointer;
}
.topic_card img {
  height: 122px;
  width: 180px;
  cursor: pointer;
}
.topic_card.active img {
  cursor: not-allowed;
}
.topic_card {
  width: 200px;
  margin: 10px 14px;
}
.topic_card.active {
  color: #3385ff;
  border-color: #3385ff;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
}
:deep(.topic_card.active .el-card__header) {
  border-color: #3385ff;
}
</style>
