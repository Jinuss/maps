<script setup>
import { MODAL_SETTING } from "../../const/const.modals";
import { useMapStore, useModalStore } from "../../store";

const mapStore = useMapStore();

const modalStore = useModalStore();

const handleClear = () => {
  mapStore.mapTool.addListener("clear");
  mapStore.mapTool.mapEl?.classList.remove("draw");
};

const openSettingModal = () => {
  modalStore.setModalType(MODAL_SETTING);
};
</script>
<template>
  <ul class="Clear_clear__Zy0p7">
    <li @click="openSettingModal">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="设置"
        placement="left"
        :offset="20"
      >
        <span role="img" class="anticon">
          <svg
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
            class=""
          >
            <use xlink:href="#icon-set-up"></use>
          </svg>
        </span>
      </el-tooltip>
    </li>
    <li @click="handleClear">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="清除"
        placement="left"
        :offset="20"
      >
        <span role="img" class="anticon">
          <svg
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
            class=""
          >
            <use xlink:href="#icon-delete"></use>
          </svg>
        </span>
      </el-tooltip>
    </li>
  </ul>
</template>
<style scoped>
ul {
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 0 4px 2px #b1b1b180;
  position: absolute;
  right: 10px;
  top: 450px;
  z-index: 5;
}

li {
  font-size: 22px;
  height: 35px;
  transition: background-color 0.3s;
  width: 35px;
  align-items: center;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

li:hover {
  background-color: #f2f2f2;
}

ul > li:not(:last-child) {
  border-bottom: 1px solid #eaeaea;
}
</style>
