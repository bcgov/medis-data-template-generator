<script setup lang="ts">
// import { storeToRefs } from 'pinia';
import { computed } from "vue";
import { useAuthStore } from "../../stores/authStore";
// import { useFormStore } from '~/store/form';
// import { useIdpStore } from '~/store/identityProviders';

defineProps({
  formSubmitMode: {
    type: Boolean,
    default: false,
  },
});

const authStore = useAuthStore();
const hasPrivileges = computed(() => authStore.user.role === "admin");
</script>

<template>
  <nav
    v-if="!formSubmitMode && authStore.authenticated && authStore.user.role !== 'No Role'"
    class="elevation-4 navigation-main d-print-none px-md-16 px-4"
  >
    <div class="nav-holder container">
      <ul>
        <!-- <li>
          <router-link
            data-cy="aboutLinks"
            :to="{ name: 'About' }"
            :lang="lang"
            >{{ $t('trans.bCGovNavBar.about') }}</router-link
          >
        </li> -->
        <li>
          <RouterLink data-cy="GenerateTemplateLinks" to="/financial">
            Generate Financial Template
          </RouterLink>
        </li>
        <li>
          <RouterLink data-cy="GenerateTemplateLinks" to="/"> Instructions </RouterLink>
        </li>
        <li v-if="hasPrivileges">
          <RouterLink data-cy="ReplaceBaseTemplate" to="/replace">
            Replace Templates
          </RouterLink>
        </li>
        <!-- <li v-if="hasPrivileges">
          <a
            data-cy="help"
            href="https://github.com/bcgov/common-hosted-form-service/wiki"
            target="_blank"
            :hreflang="lang"
            >{{ $t('trans.bCGovNavBar.help') }}</a
          >
        </li>
        <li v-if="hasPrivileges">
          <a
            data-cy="feedback"
            href="https://chefs-fider.apps.silver.devops.gov.bc.ca/"
            target="_blank"
            :hreflang="lang"
            >{{ $t('trans.bCGovNavBar.feedback') }}</a
          >
        </li> -->
        <!-- <li>
          <router-link :to="{ name: 'User' }">User (TBD)</router-link>
        </li> -->
        <!-- <li v-if="isAdmin">
          <router-link data-cy="admin" :to="{ name: 'Admin' }" :lang="lang">{{
            $t('trans.bCGovNavBar.admin')
          }}</router-link>
        </li> -->
      </ul>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.navigation-main {
  box-shadow: 0 6px 8px -4px #b3b1b3;
  display: flex;
  color: #fcba19;
  background-color: #38598a;
  width: 100%;
  -webkit-box-shadow: 0 6px 8px -4px #b3b1b3;
  -moz-box-shadow: 0 6px 8px -4px #b3b1b3;

  .nav-holder {
    padding: 0;
    ul {
      display: flex;
      flex-direction: row;
      margin: 0;
      color: #ffffff;
      list-style: none;
      margin-left: -1.7rem;

      li {
        a {
          display: flex;
          font-weight: normal;
          min-height: 2rem;
          color: #ffffff;
          padding: 0.75rem 1rem 0.75rem 1rem;
          text-decoration: none;

          &:focus {
            outline: none;
            outline-offset: 0;
          }
          &:hover {
            text-decoration: underline;
          }
        }

        & ~ li {
          border-left: 1px solid #9b9b9b;
          margin: 0;
        }
      }

      .router-link-exact-active {
        background-color: #7ba2cc80;
        border-bottom: 2px solid #fcba19;
        font-weight: bold;
      }
    }
  }
}
</style>
