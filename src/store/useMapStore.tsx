import { defineStore } from "pinia";

export const useMapStore = defineStore("mapStore", {
  state: () => {
    return { mapTool: {}, mode: "2D" };
  },
  actions: {
    setMap(mapTool: Object) {
      this.mapTool = mapTool;
    },
    setMapMode(mode: string) {
      this.mode = mode;
    },
  },
});
