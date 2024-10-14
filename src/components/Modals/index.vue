<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { MODAL_SETTING } from "../../const/const.modals";
import setting from "./setting.vue";
import { useModalStore } from "../../store";

const store = useModalStore();

const { type } = storeToRefs(store);

const currentComponent = computed(() => {
  switch (type.value) {
    //设置
    case MODAL_SETTING:
      return setting;
    default:
      return null;
  }
});
</script>

<template>
  <component :is="currentComponent" />
</template>
