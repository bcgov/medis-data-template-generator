<script setup lang="ts">
import { useAuthStore } from "../stores/authStore";
const store = useAuthStore();
</script>

<template>
  <v-container fluid v-if="store.authenticated">
    <h2>PLACEHOLDER TO REPLACE TEMPLATE!</h2>
  </v-container>
</template>

<style scoped></style>
