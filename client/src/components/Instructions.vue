<script setup lang="ts">
import { useAuthStore } from "../stores/authStore";
import { useMutation, useQuery } from "@tanstack/vue-query";
import apiService from "../services/apiService";
const store = useAuthStore();
// tanstack - Queries
const { isPending, data } = useQuery({
  queryKey: ["instructions"],
  queryFn: async () => {
    const response = await apiService.getInstructions().then((data) => {
      return data;
    });
    return response;
  },
});
</script>

<template>
  <v-container fluid v-if="store.authenticated">
    <v-skeleton-loader
      v-if="isPending"
      max-width="300"
      type="text,text"
    ></v-skeleton-loader>
    <div v-html="data?.data[0].instructions"></div>
  </v-container>
</template>

<style scoped></style>
