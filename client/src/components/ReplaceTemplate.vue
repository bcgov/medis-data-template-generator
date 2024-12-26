<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import apiService from "../services/apiService";
import FileSaver from "file-saver";
import { toast } from "vue-sonner";
const authStore = useAuthStore();
const queryClient = useQueryClient();

const file = ref<File | null>(null);

const { data, isPending } = useQuery({
  queryKey: ["financial-template"],
  queryFn: async () => {
    const response = await apiService
      .getLatestFinancialDataTemplate()
      .then((data) => {
        return data;
      });
    return response;
  },
});

const getTemplateMutation = useMutation({
  mutationFn: () =>
    apiService.getCurrentFinancialDataTemplate().then((fileData) => {
      FileSaver.saveAs(fileData.data, data.value?.data.Key);
      toast.dismiss();
      toast.success("Template retrieved successfully", {
        duration: 5000,
      });
    }),
  onError: (error: { message: any }) => {
    toast.dismiss();
    toast.error(`Failed to retrieve template: ${error.message}`, {
      duration: 5000,
    });
    console.log(error);
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
        queryClient.invalidateQueries({ queryKey: ["financial-template"] });
        file.value = null;
        return response;
      });
    return response;
  },
  onError: (error) => {
    toast.dismiss();
    toast.error(`Upload Failed: ${error.message}`, {
      duration: 5000,
    });
    console.log(error);
  },
  onMutate: () => {
    toast.info("Uploading new template...");
    if (!file.value) {
      throw new Error("No file selected");
    }
  },
});
</script>

<template>
  <v-container fluid v-if="authStore.authenticated" class="p-4">
    <v-col v-if="!isPending">
      <h3>Financial template name: {{ data?.data.Key }}</h3>
      <h4>
        Last Modified:
        {{ new Date(String(data?.data.LastModified)) }}
      </h4>
    </v-col>
    <v-skeleton-loader
      v-if="isPending"
      max-width="300"
      type="text,text"
    ></v-skeleton-loader>
    <v-file-input
      v-model="file"
      label="Select a new financial template"
      accept=".xlsm"
    />
    <v-row gap>
      <v-btn
        @click="mutation.mutate()"
        color="primary"
        class="mr-2"
        :disabled="!file"
        >Replace Current Template</v-btn
      >
      <v-btn @click="getTemplateMutation.mutate()" variant="elevated"
        >Get Current Template</v-btn
      >
    </v-row>
  </v-container>
</template>

<style scoped></style>
