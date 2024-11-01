<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useMutation } from "@tanstack/vue-query";
import apiService from "../services/apiService";
import FileSaver from "file-saver";
import { toast } from "vue-sonner";
const store = useAuthStore();

const file = ref<File | null>(null);

const getTemplateMutation = useMutation({
  mutationFn: () =>
    apiService.getCurrentFinancialDataTemplate().then((data) => {
      FileSaver.saveAs(data.data, `CurrentFinancialTemplate.xlsm`);
      toast.success("Template retrieved successfully", {
        duration: 5000,
      });
      toast.dismiss();
    }),
  onError: (error: { message: any }) => {
    toast.error(`Failed to retrieve template: ${error.message}`, {
      duration: 5000,
    });
    console.log(error);
    toast.dismiss();
  },
  onMutate: () => {
    toast.info("Retrieving template...");
  },
});

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
  <v-container fluid v-if="store.authenticated" class="p-4">
    <h4>Financial Template:</h4>
    <v-file-input v-model="file" label="Select a new financial template" accept=".xlsm" />
    <v-row gap>
      <v-btn @click="mutation.mutate()" color="primary" class="mr-2"
        >Replace Current Template</v-btn
      >
      <v-btn @click="getTemplateMutation.mutate()" variant="elevated"
        >Get Current Template</v-btn
      >
    </v-row>
  </v-container>
</template>

<style scoped></style>
