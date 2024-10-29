<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useMutation } from "@tanstack/vue-query";
import apiService from "../services/apiService";
import { toast } from "vue-sonner";
const store = useAuthStore();

const file = ref<File | null>(null);

const mutation = useMutation({
  mutationFn: async () => {
    const formData = new FormData();
    if (file.value) {
      formData.append("file", file.value);
    }
    const response = await apiService
      .uploadFinancialDataTemplate(formData)
      .then((response) => {
        toast.success("Template replaced successfully", {
          duration: 5000,
        });
        toast.dismiss();
        return response;
      });
    return response;
  },
  onError: (error) => {
    toast.error(`Upload Failed: ${error.message}`, {
      duration: 5000,
    });
    console.log(error);
    toast.dismiss();
  },
  onMutate: () => {
    toast.info("Uploading new template...");
  },
});
</script>

<template>
  <v-container fluid v-if="store.authenticated">
    <h4>Financial Template:</h4>
    <v-file-input v-model="file" label="Select a file" accept=".xlsm" />
    <v-btn @click="mutation.mutate()">Upload</v-btn>
  </v-container>
</template>

<style scoped></style>
