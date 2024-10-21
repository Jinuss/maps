<script setup>
import { storeToRefs } from "pinia";
import { usePanelStore } from "../../../store";
import { PANEL_MAP_TYPE } from "../../../const";
import vectorLayerHight from "./vectorLayerHight.vue";

const panelStore = usePanelStore();

const { bigPanelType } = storeToRefs(panelStore);

const hideCard = () => {
  panelStore.setBigPanelType(PANEL_MAP_TYPE.NULL);
};
</script>

<template>
  <div
    class="topic_card_panel"
    v-if="bigPanelType == PANEL_MAP_TYPE.VECTOR_LAYER"
  >
    <div class="card_header">
      <span>地图操作</span>
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
        <vectorLayerHight />
      </div>
    </div>
  </div>
</template>

<style scoped>
.topic_card_panel {
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 2px 4px #0000004d;
  min-height: 600px;
  position: absolute;
  left: 70px;
  top: 100px;
  width: 800px;
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
  height: 545px;
}

.card_body_footer {
  display: flex;
  justify-content: center;
  padding: 0 10px 20px;
}

.container {
  position: relative;
  height: 100%;
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
