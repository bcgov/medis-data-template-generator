<script setup lang="ts">
import { useAuthStore } from "../stores/authStore";
const authStore = useAuthStore();
</script>

<template>
  <v-container fluid v-if="authStore.authenticated">
    <h2>PLACEHOLDER INSTRUCTIONS</h2>
  </v-container>
</template>

<style scoped></style>
