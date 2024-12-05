<script setup lang="ts">
import Header from "./components/bcgov/Header.vue";
import Nav from "./components/bcgov/Navbar.vue";
import { Toaster } from "vue-sonner";
import { computed, provide, ref } from "vue";
import { useDialogStore } from "./stores/appStore";
import { useAuthStore } from "./stores/authStore";

const isWideLayout = ref(false);

const dialogStore = useDialogStore();
const authStore = useAuthStore();

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
      <!-- Timed out dialog to log user back in -->
      <v-dialog v-model="dialogStore.$state.isOpen" max-width="400" persistent>
        <v-card
          :text="dialogStore.$state.message"
          :title="dialogStore.$state.title"
        >
          <template v-slot:actions>
            <v-spacer></v-spacer>
            <v-btn @click="authStore.logout()"> Logout </v-btn>
            <v-btn
              @click="
                authStore.login();
                dialogStore.closeDialog();
              "
            >
              Confirm
            </v-btn>
          </template>
        </v-card>
      </v-dialog>
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
