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
  actions: {
    addData(data: Object) {
      this.list.push({ ...defaultState, ...data });
      this.showUuid = data.uuid;
    },
    setShowUuid(uuid: string) {
      this.showUuid = uuid;
    },
  },
});
