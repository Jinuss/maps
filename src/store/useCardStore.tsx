import { defineStore } from "pinia";

export const defaultState = {
  type: "",
  uuid: "",
  formData: {},
};
export const useCardStore = defineStore("cardStore", {
  state: () => {
    return { list: [], showUuid: "" };
  },
  getters: {
    getItem(): Object {
      return this.list.filter((i) => i.uuid == this.showUuid)[0];
    },
  },
  actions: {
    addData(data: Object) {
      this.list.push({ ...defaultState, ...data });
      this.showUuid = data.uuid;
    },
    setShowUuid(uuid: string) {
      this.showUuid = uuid;
    },
    setItem(item) {
      this.list.forEach((i, index) => {
        if (i.uuid == this.showUuid) {
          this.list[index] = { ...i, ...item };
        }
      });
    },
  },
});
