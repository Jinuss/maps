import { defineStore } from "pinia";
import { TYPES } from "../const/const.map";

const initlineState = {
  name: "未命名",
  mark: "",
  lineStyle: "line_1",
  color: "#ff0000",
  width: 2,
};
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
      let p = { ...defaultState };
      if (type == TYPES.LINESTRING) {
        p.formData = initlineState;
        p = { ...p, ...data };
      }
      this.list.push({ ...p, ...data });
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
