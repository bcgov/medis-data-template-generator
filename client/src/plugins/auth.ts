import { useAuthStore } from "../stores/authStore";
import keycloakService from "../services/keycloak";
import type { Plugin } from "vue";

export default {
  install(app, option) {
    const store = useAuthStore(option.pinia);

    // Global store
    app.config.globalProperties.$store = store;

    // Store keycloak user data into store
    keycloakService.CallInitStore(store);
  },
} satisfies Plugin;
