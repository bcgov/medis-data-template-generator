import { createApp } from "vue";
import "vuetify/styles";
import "./style.scss";
import "nprogress/nprogress.css";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import Header from "./components/bcgov/Header.vue";

createApp(App)
  .component("Header", Header)
  .use(VueQueryPlugin)
  .use(vuetify)
  .use(router)
  .mount("#app");
