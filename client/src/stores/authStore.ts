import { defineStore } from "pinia";
import keycloakService from "../services/keycloak";

export const useAuthStore = defineStore({
  id: "storeAuth",
  state: () => {
    return {
      authenticated: false,
      ready: false,
      user: {
        username: "",
        token: "",
        refToken: "",
        role: "",
      },
    };
  },
  getters: {},
  actions: {
    // Initialize Keycloak OAuth
    async initOauth(keycloak: any, clearData = true) {
      if (clearData) {
        await this.clearUserData();
      }

      this.ready = true;
      this.authenticated = keycloak.authenticated;
      if (this.authenticated) {
        this.user.username = keycloak.idTokenParsed.display_name;
        this.user.token = keycloak.token;
        this.user.refToken = keycloak.refreshToken;
      }
    },
    // Update role
    updateRole(role: string) {
      this.user.role = role;
    },
    // Login user
    async login() {
      try {
        const keycloak = await keycloakService.CallLogin();
        this.initOauth(keycloak);
      } catch (error) {
        console.error(error);
      }
    },
    // Logout user
    async logout() {
      try {
        await keycloakService.CallLogout();
        await this.clearUserData();
      } catch (error) {
        console.error(error);
      }
    },
    // Refresh user's token
    async refreshUserToken() {
      try {
        const keycloak = await keycloakService.CallTokenRefresh();
        this.initOauth(keycloak, false);
      } catch (error) {
        console.error(error);
      }
    },
    // Clear user's store data
    clearUserData() {
      this.authenticated = false;
      this.user = {
        username: "",
        token: "",
        refToken: "",
        role: "",
      };
    },
  },
});
