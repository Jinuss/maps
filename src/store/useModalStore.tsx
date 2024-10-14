import { defineStore } from "pinia";
import { MODAL_NULL } from "../const/const.modals";

export const useModalStore = defineStore("modalStore", {
  state: () => {
    return { type: MODAL_NULL };
  },
  actions: {
    setModalType(type: string) {
      this.type = type;
    },
  },
});
