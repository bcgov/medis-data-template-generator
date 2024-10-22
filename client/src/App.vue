<script setup lang="ts">
import Header from "./components/bcgov/Header.vue";
import Nav from "./components/bcgov/Navbar.vue";
import { Toaster } from "vue-sonner";
import { computed, provide, ref } from "vue";

const isWideLayout = ref(false);

const appTitle = computed(() => {
  return import.meta.env.VITE_TITLE;
});

const isWidePage = computed(() => {
  return isWideLayout.value ? "main-wide" : "main";
});

provide("setWideLayout", setWideLayout);

function setWideLayout(isWide: boolean) {
  isWideLayout.value = isWide;
}

defineExpose({
  appTitle,
  isWidePage,
  setWideLayout,
  isWideLayout,
});
</script>

<template>
  <v-layout ref="app" class="app">
    <v-main class="app">
      <Toaster richColors position="top-center" />
      <Header :app-title="appTitle" />
      <Nav />
      <!-- center the content in v-row -->
      <!-- <div class="container mx-auto my-4"> -->
      <div>
        <RouterView />
      </div>
      <!-- </div> -->
    </v-main>
  </v-layout>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  -webkit-box-flex: 1;
}

.main {
  flex: 1 0 auto;
}

.main-wide {
  flex: 1 0 auto;
  max-width: 100%;
}

@media (min-width: 1024px) {
  .main-wide {
    padding-left: 65px;
    padding-right: 65px;
  }
}
</style>
