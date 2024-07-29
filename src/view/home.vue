<script setup>
import { ref, reactive } from "vue";
import { Search } from "@element-plus/icons-vue";
import { fromLonLat } from "ol/proj";
import * as olStyle from "ol/style";
import Feature from "ol/Feature";
import { Point } from "ol/geom";
import Map from "../components/map/index.vue";
import locImgSrc from "../assets/loc.png";

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
</script>
<template>
  <div class="home">
    <div class="header">
      <el-form-item label="POI:">
        <el-input
          placeholder="请输入搜索位置"
          v-model="address"
          @change="getAddress"
        >
          <template #append>
            <el-button :icon="Search" type="primary" />
          </template>
        </el-input>
      </el-form-item>
    </div>
    <div class="map-container">
      <Map @setMap="setMap" />
    </div>
  </div>
</template>
<style scoped>
.home {
  height: 100%;
  width: 100%;
  background: #fff;
}
.header {
  height: 80px;
  display: flex;
  align-items: center;
  align-content: center;
  padding: 0 20px;
}
.map-container {
  height: calc(100% - 80px);
  width: 100%;
}
</style>
