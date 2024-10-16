import { defineStore } from "pinia";

export const useMapStore = defineStore("mapStore", {
  state: () => {
    return { mapTool: {}, mode: "2D", showGrid: false, showWaterMarker: false };
  },
  actions: {
    setMap(mapTool: Object) {
      this.mapTool = mapTool;
    },
    setMapMode(mode: string) {
      this.mode = mode;
    },
    setShowGrid(visible: boolean) {
      this.showGrid = visible;
    },
  },
});
