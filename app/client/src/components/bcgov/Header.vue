<script setup lang="ts">
import BCLogo from "../../assets/images/bc_logo.svg";

const props = defineProps({
  appTitle: {
    type: String,
    default: "MEDIS Data Template Generator",
  },
});
</script>

<template>
  <header
    :class="{
      'elevation-20': true,
      'gov-header': true,
    }"
    class="v-locale--is-ltr"
  >
    <v-toolbar
      color="#003366"
      flat
      class="px-md-12 d-print-none"
      :class="{ 'v-locale--is-ltr': true }"
    >
      <!-- Navbar content -->
      <a href="https://www2.gov.bc.ca" data-test="btn-header-logo">
        <v-img
          alt="B.C. Government Logo"
          class="d-flex"
          height="3.5rem"
          :src="BCLogo"
          width="10rem"
        />
      </a>
      <h2
        data-test="btn-header-title"
        class="font-weight-bold text-h6 d-none d-md-flex ml-4"
      >
        {{ props.appTitle }}
      </h2>
      <v-spacer />
      <v-btn id="loginButton" color="white" density="default" variant="outlined">
        <span>Logout</span>
      </v-btn>
    </v-toolbar>
  </header>
</template>

<style lang="scss" scoped>
@import "vuetify/settings";

@media print {
  .elevation-20 {
    box-shadow: 0 0 0 0 !important;
  }
}

.gov-header {
  .printHeader {
    align-items: center;
    img {
      width: 10rem;
      height: 3.5rem;
    }
    .text-h6 {
      color: inherit;
    }
  }
  @media not print {
    border-bottom: 2px solid #fcba19;
  }
  .text-h6 {
    font-family: inherit !important;
    color: #ffffff;
    overflow: hidden;
    margin-bottom: 0;
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      font-size: 1rem !important;
    }
  }
}
</style>
