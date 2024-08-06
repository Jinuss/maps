import { defineStore } from "pinia";
import { TYPES, INIT_LINE_STATE, INIT_PLOYGON_STATE } from "../const/const.map";

export const defaultState = {
  type: "",
  uuid: "",
  formData: {},
};
export const useCardStore = defineStore("cardStore", {
  state: () => {
    return { list: [], showUuid: "" };
  },
  actions: {
    addData(data: Object) {
      const { type } = data;
      let p = { ...defaultState, ...data };
      switch (type) {
        case TYPES.LINESTRING:
          p.formData = INIT_LINE_STATE;
          break;
        case TYPES.POLYGON:
        case TYPES.RECT:
          p.formData = INIT_PLOYGON_STATE;
          break;
        default:
      }
      this.list.push({ ...p });
      this.showUuid = data.uuid;
      return p;
    },
    setShowUuid(uuid: string) {
      this.showUuid = uuid;
    },
    setItem(item: Object) {
      this.list.forEach((i: { uuid: string }, index: number) => {
        if (i.uuid == this.showUuid) {
          this.list[index] = { ...i, ...item };
        }
      });
    },
    getItem(): Object {
      return this.list.filter(
        (i: { uuid: string }) => i.uuid == this.showUuid
      )[0];
    },
    removeItem(item: Object) {
      this.list = this.list.filter((i) => i.uuid != item.uuid);
    },
  },
});
