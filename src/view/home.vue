<script setup>
import { ref, reactive } from "vue";
import live from "../components/live2D/Live2D.vue";
import { Search } from "@element-plus/icons-vue";
import { fromLonLat } from "ol/proj";
import * as olStyle from "ol/style";
import Feature from "ol/Feature";
import { Point } from "ol/geom";
import Map from "../components/map/index.vue";
import CesiumMap from "../components/cesium/CesiumMap.vue";
import GithubIcon from "../baseComponent/GithubIcon.vue";
import ModeChange from "../components/common/ModeChange.vue";
import locImgSrc from "../assets/loc.png";
import { useMapStore } from "../store";
import { storeToRefs } from "pinia";

const mapStore = useMapStore();
const { mode } = storeToRefs(mapStore);

const address = ref("");
const tk = "d4c174e239a1201c45a38e3ceff9fe0c";

let MAP = reactive({});
let LAYERS = reactive({});
const getAddress = () => {
  const adr = address.value;
  if (adr) {
    fetch(
      `http://api.tianditu.gov.cn/geocoder?ds={"keyWord":"${adr}"}&tk=${tk}`
    )
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("请求失败");
        }
        return resp.json();
      })
      .then((data) => {
        console.log(data);
        const { status, location } = data;
        if (status == "0") {
          const { lat, lon } = location;
          if (MAP) {
            const view = MAP.getView();
            const position = fromLonLat([lon, lat]);
            view.setCenter(position);

            // 创建一个标记的图标样式
            var markerStyle = new olStyle.Style({
              image: new olStyle.Icon({
                anchor: [0.5, 1], // 图标中心点在底部中心
                src: locImgSrc, // 图标的 URL
              }),
            });

            var markerFeature = new Feature({
              geometry: new Point(position), // 设置标记的几何位置
            });

            // 将图标样式应用于标记特征
            markerFeature.setStyle(markerStyle);
            LAYERS.vectorLayer.getSource().addFeature(markerFeature);
          }
        }
      });
  }
};

const setMap = (map, layers) => {
  MAP = map;
  LAYERS = layers;
};

const kw = ref("");

const options = ref([]);

const remoteMethod = (query) => {
  kw.value = query;
  if (query) {
    fetch(
      `http://api.tianditu.gov.cn/v2/search?postStr={"keyWord":"${query}","level":3,"mapBound":"74,3,136,53","sourceType":0,"yingjiType":1,"queryType":4,"start":0,"count":10,"queryTerminal":10000}&type=query&tk=${tk}`
    )
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("请求失败");
        }
        return resp.json();
      })
      .then((data) => {
        console.log(data);
        const { suggests } = data;
        options.value = suggests;
      });
  }
};
</script>
<template>
  <div class="home">
    <div class="header">
      <GithubIcon />
      <!-- <el-form-item label="POI:">
        <el-input
          placeholder="请输入搜索位置"
          v-model="address"
          @change="getAddress"
        >
          <template #append>
            <el-button :icon="Search" type="primary" />
          </template>
</el-input>
</el-form-item> -->

      <el-select
        v-model="kw"
        filterable
        remote
        reserve-keyword
        placeholder="搜索位置"
        :remote-method="remoteMethod"
        style="width: 240px"
      >
        <template v-for="item in options" :key="item.gbCode">
          <el-option :label="item.address" :value="item.gbCode">
            <span style="">{{ item.name }}</span>
            <span style="margin-left: 10px; color: #909399; font-size: 13px">
              {{ item.address }}
            </span>
          </el-option>
        </template>
      </el-select>
    </div>
    <div class="map-container">
      <ModeChange />
      <Map @setMap="setMap" v-if="mode == '2D'" />
      <CesiumMap v-else />
    </div>
    <live :size="350" :width="350" :height="500"></live>
  </div>
</template>
<style scoped>
.home {
  height: 100%;
  width: 100%;
  background: #fff;
}

.header {
  height: 60px;
  display: flex;
  align-items: center;
  align-content: center;
  padding: 0 20px;
}

.map-container {
  height: calc(100% - 60px);
  width: 100%;
}
</style>
