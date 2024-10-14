<script setup>
import { onBeforeUnmount, ref, reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import { SCALEPLATE_LIST } from "../../const/const.map";
import { MODAL_NULL } from "../../const/const.modals";
import { ScaleLine } from "ol/control";
import Tile from "ol/layer/Tile";
import XYZ from "ol/source/XYZ.js";
import { fromLonLat, transformExtent } from "ol/proj";
import { useModalStore, useMapStore } from "../../store";

const mapStore = useMapStore();

const { mapTool } = storeToRefs(mapStore);
const modalStore = useModalStore();

const scaleValue = ref(SCALEPLATE_LIST[0].t);

const selectScaleUnit = (unit) => {
  const v = SCALEPLATE_LIST.filter(({ t, v }) => unit == t)[0].v;
  const map = mapTool.value.map;

  const scaleControl = map
    .getControls()
    .getArray()
    .find((control) => control instanceof ScaleLine);

  if (scaleControl.getUnits() != v) {
    scaleControl.setUnits(v);
  }
};
const hideModal = () => {
  modalStore.setModalType(MODAL_NULL);
};

const loading = ref(false);

const confirmModal = async () => {
  modalStore.setModalType(MODAL_NULL);
};
// 创建canvas
const createCanvasContext2D = (opt_width, opt_height) => {
  const canvas = document.createElement("canvas");
  if (opt_width) {
    canvas.width = opt_width;
  }
  if (opt_height) {
    canvas.height = opt_height;
  }
  return canvas.getContext("2d");
};

const getSource = () => {
  return new XYZ({
    tileUrlFunction: (t) => {
      var tileSize = [512, 512];
      const half = tileSize[0] / 2;
      var tileSize = [512, 512];

      const context = createCanvasContext2D(tileSize[0], tileSize[0]);

      context.fillStyle = "rgba(184, 184, 184, 0.8)";

      context.textAlign = "center";
      context.textBaseline = "middle";

      context.font = "32px microsoft yahei";

      context.rotate((Math.PI / 180) * 30);

      context.fillText(waterMarkText.value, half, half);

      return context.canvas.toDataURL();
    },
    extent: transformExtent([-180, -85, 180, 85], "EPSG:4326", "EPSG:3857"),
  });
};
//水印瓦片图层
const getWaterMarkLayer = () => {
  let tiles = new Tile({
    source: getSource(),
    className: "water_marker",
  });
  return tiles;
};

const handleWaterMark = (text) => {
  waterMarkText.value = text;
  const map = mapTool.value.map;
  let layer = map
    .getLayers()
    .getArray()
    .find((i) => i.getClassName() == "water_marker");
  if (layer) {
    map.removeLayer(layer);
  }

  layer = getWaterMarkLayer();
  map.addLayer(layer);
};
const waterMarkText = ref("");

onMounted(() => {
  handleWaterMark("openlayers");
});
</script>
<template>
  <el-dialog
    :model-value="true"
    title="设置"
    width="30%"
    :close-on-press-escape="false"
    @close="hideModal(formRef)"
  >
    <div v-loading="loading">
      <div class="content">
        <div class="item">
          <span>比例尺</span>
          <el-select
            v-model="scaleValue"
            placeholder="请选择比例尺单位"
            style="width: 80%"
            @change="selectScaleUnit"
          >
            <template v-for="(item, index) in SCALEPLATE_LIST">
              <el-option :label="item.t" :value="item.t">
                <span style="float: left">{{ item.t }}</span>
                <span style="float: right; color: #aaa">{{ item.v }}</span>
              </el-option>
            </template>
          </el-select>
        </div>
      </div>
      <div class="item">
        <span>添加水印</span>
        <el-input
          v-model="waterMarkText"
          placeholder="请输入水印文字"
          @change="handleWaterMark"
          style="width: 80%"
        ></el-input>
      </div>
    </div>
  </el-dialog>
</template>
<style scoped>
.item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.item span {
  margin-right: 10px;
}
</style>
