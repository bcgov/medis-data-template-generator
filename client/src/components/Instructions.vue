<script setup lang="ts">
import { useAuthStore } from "../stores/authStore";
const authStore = useAuthStore();
</script>

<template>
  <v-container fluid v-if="authStore.authenticated">
    <h2>PLACEHOLDER INSTRUCTIONS</h2>
  </v-container>
  <v-container
      v-if="!authStore.authenticated || authStore.user.role === 'No Role'"
    >
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="headline">User Timed Out</v-card-title>
            <v-btn
              color="primary"
              variant="flat"
              text="
            Login Again
          "
              @click="authStore.login"
            ></v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<style scoped></style>
