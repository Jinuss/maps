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
