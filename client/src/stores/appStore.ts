import { defineStore } from "pinia";

interface DialogState {
  isOpen: boolean;
  title: string;
  message: string;
}

export const useDialogStore = defineStore("dialog", {
  state: (): DialogState => ({
    isOpen: false,
    title: "",
    message: "",
  }),
  actions: {
    openDialog(title: string, message: string) {
      this.isOpen = true;
      this.title = title;
      this.message = message;
    },
    closeDialog() {
      this.isOpen = false;
      this.title = "";
      this.message = "";
    },
  },
});
