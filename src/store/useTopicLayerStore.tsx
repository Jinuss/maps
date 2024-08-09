import { defineStore } from "pinia";

export const useTopicLayerStore = defineStore("topicLayerStore", {
  state: () => {
    return { visible: false };
  },
  actions: {
    setVisible(visible: boolean) {
      this.visible = visible;
    },
  },
});
