import { defineStore } from "pinia";

export const useMapStore = defineStore("mapStore", {
  state: () => {
    return { mapTool: {} };
  },
  actions: {
    setMap(mapTool: Object) {
      this.mapTool = mapTool;
    },
  },
});