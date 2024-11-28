import { createApp } from "vue";
import "vuetify/styles";
import "./style.scss";
import "nprogress/nprogress.css";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import AuthStorePlugin from "./plugins/auth";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import KeycloakService from "./services/keycloak";

// Create Pinia instance
const pinia = createPinia();

// Use persisted state with Pinia so our store data will persist even after page refresh
pinia.use(piniaPluginPersistedstate);

const renderApp = async () => {
  await KeycloakService.CallInit();
  createApp(App)
    .use(AuthStorePlugin, { pinia })
    .use(pinia)
    .use(router)
    .use(VueQueryPlugin)
    .use(vuetify)
    .mount("#app");
};

renderApp();

// keycloakService.CallInit(renderApp);
