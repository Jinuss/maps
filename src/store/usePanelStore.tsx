import { defineStore } from "pinia";
import { PANEL_TYPES, PANEL_MAP_TYPE } from "../const";

export const usePanelStore = defineStore("PanelStore", {
  state: () => {
    return {
      type: PANEL_TYPES.NULL,
      bigPanelType: PANEL_MAP_TYPE.NULL,
    };
  },
  actions: {
    setPanelType(type: string) {
      this.type = type;
    },
    setBigPanelType(type: string) {
      this.bigPanelType = type;
    },
  },
});
