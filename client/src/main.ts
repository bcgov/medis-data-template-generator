import { createApp } from "vue";
import "vuetify/styles";
import "./style.scss";
import "nprogress/nprogress.css";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";

createApp(App).use(router).use(VueQueryPlugin).use(vuetify).mount("#app");
