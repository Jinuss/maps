import { defineStore } from "pinia";
import { PANEL_TYPES } from "../const";

export const usePanelStore = defineStore("PanelStore", {
  state: () => {
    return { type: PANEL_TYPES.NULL };
  },
  actions: {
    setPanelType(type: string) {
      this.type = type;
    },
  },
});
