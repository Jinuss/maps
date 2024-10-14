<script setup>
import { onBeforeUnmount, ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import { SCALEPLATE_LIST } from "../../const/const.map";
import { MODAL_NULL } from "../../const/const.modals";
import { ScaleLine } from "ol/control";
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
        <div>比例尺</div>
        <el-select
          v-model="scaleValue"
          placeholder="请选择比例尺单位"
          style="width: 100%"
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
      <footer class="el-dialog__footer">
        <span class="dialog-footer">
          <el-button @click="hideModal(formRef)">取消</el-button>
          <el-button type="primary" @click="confirmModal(formRef)">
            确定
          </el-button>
        </span>
      </footer>
    </div>
  </el-dialog>
</template>
