import { createMemoryHistory, createRouter } from "vue-router";
import GenerateTemplate from "./views/GenerateTemplate.vue";
import ReplaceTemplate from "./views/ReplaceTemplate.vue";
import NProgress from "nprogress";
import Home from "./views/Home.vue";

let isFirstTransition = true;

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/financial",
    component: GenerateTemplate,
  },
  {
    path: "/replace",
    component: ReplaceTemplate,
  },
];

const router = createRouter({
  history: createMemoryHistory("/"),
  routes,
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  //   const authStore = useAuthStore();
  //   const idpStore = useIdpStore();

  const basePath = import.meta.env.VITE_BASE_PATH || "/app";

  if (isFirstTransition) {
    // if (authStore?.ready && authStore?.authenticated) {
    //     const formStore = useFormStore();
    //     formStore.getFormsForCurrentUser();
    //   }
    // Handle proper redirections on first page load
    if (to.query.r) {
      router.replace({
        path: String(to.query.r).replace(basePath, ""),
        query: (({ r, ...q }) => q)(to.query), // eslint-disable-line no-unused-vars
      });
    }
  }

  // Force login redirect if not authenticated
  // Note some pages (Submit and Success) only require auth if the form being loaded is secured
  // in those cases, see the beforeEnter navigation guards for auth loop determination
  // if (
  //   to.matched.some((route) => route.meta.requiresAuth) &&
  //   authStore.ready &&
  //   !authStore.authenticated
  // ) {
  //   const redirectUri =
  //     location.origin + basePath + to.path + location.search;
  //   authStore.redirectUri = redirectUri;

  //   // Determine what kind of redirect behavior is needed
  //   let idpHint = undefined;
  //   if (
  //     typeof to.meta.requiresAuth === 'string' &&
  //     to.meta.requiresAuth === 'primary'
  //   ) {
  //     idpHint = idpStore.primaryIdp ? idpStore.primaryIdp.code : null;
  //   }
  //   authStore.login(idpHint);
  // }

  // Update document title if applicable
  document.title = to.meta.title
    ? to.meta.title
    : import.meta.env.VITE_TITLE || "MEDIS Data Template Generator";
  next();
});

router.afterEach(() => {
  isFirstTransition = false;
  NProgress.done();
});

export default router;
