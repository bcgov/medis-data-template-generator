import { createWebHistory, createRouter } from "vue-router";
import GenerateTemplate from "./views/GenerateTemplate.vue";
import ReplaceTemplate from "./views/ReplaceTemplate.vue";
import NProgress from "nprogress";
import Home from "./views/Home.vue";
import { useAuthStore } from "./stores/authStore";
import NotAuthorized from "./views/NotAuthorized.vue";
import apiService from "./services/apiService";
import NotInitialized from "./views/NotInitialized.vue";

let isFirstTransition = true;

const routes = [
  {
    path: "/financial",
    name: "Financial",
    component: GenerateTemplate,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/replace",
    name: "Replace",
    component: ReplaceTemplate,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: NotAuthorized,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/no-init",
    name: "NotInitialized",
    component: NotInitialized,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH || ""),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  NProgress.start();

  let destination = "";

  const authStore = useAuthStore();

  const basePath = import.meta.env.VITE_BASE_PATH || "";

  if (isFirstTransition) {
    if (to.query.r) {
      router.replace({
        path: String(to.query.r).replace(basePath, ""),
        query: (({ r, ...q }) => q)(to.query), // eslint-disable-line no-unused-vars
      });
    }
  }

  if (to.meta.requiresAuth && !authStore.authenticated && authStore.ready) {
    authStore.login();
    destination = "Login";
  }

  if (
    to.meta.requiresAuth &&
    authStore.authenticated &&
    authStore.ready &&
    !authStore.user.role
  ) {
    try {
      const role = await apiService.getRole().then((res) => res.data);
      console.log(role);
      if (role.length === 0) {
        throw new Error("User does not have a role or has multiple roles");
      }
      authStore.updateRole(role[0].role);
    } catch (error) {
      console.error("Error fetching RLS Role", error);
      authStore.updateRole("No Role");
      destination = "NotInitialized";
    }
  }

  // Update document title if applicable
  document.title = to.meta.title
    ? to.meta.title
    : import.meta.env.VITE_TITLE || "MEDIS Data Template Generator";

  if (destination === "") {
    next();
  } else {
    next({
      name: destination,
    });
  }
});

router.afterEach(() => {
  isFirstTransition = false;
  NProgress.done();
});

export default router;
