<template>
  <div>
    <v-container
      fluid
      v-if="authStore.authenticated && authStore.user.role !== 'No Role'"
    >
      <div v-if="!isPending && !reportingPeriodsIsPending">
        <div class="d-flex">
          <h6>Select the type of Initiative</h6>
          <span class="text-danger ml-1 mb-2 font-weight-bold">*</span>
          <v-icon
            color="dark-grey"
            v-tooltip="'Type of Initiative'"
            size="sm"
            class="ml-1 mt-1"
          >
            mdi-information
          </v-icon>
        </div>
        <v-radio-group v-model="initiative" inline :disabled="isPending">
          <v-radio label="PCN" value="pcn"></v-radio>
          <v-radio label="UPCC" value="upcc"></v-radio>
          <v-radio label="CHC" value="chc"></v-radio>
          <v-radio label="NPPCC" value="nppcc"></v-radio>
        </v-radio-group>
      </div>

      <v-row gap>
        <v-col v-if="initiative !== null" cols="4">
          <div class="d-flex">
            <h6>Health Authority</h6>
            <span class="text-danger ml-1 mb-2 font-weight-bold">*</span>
            <v-icon
              color="dark-grey"
              v-tooltip="'Regional Health Authority'"
              size="sm"
              class="ml-1 mt-1"
            >
              mdi-information
            </v-icon>
          </div>
          <v-autocomplete
            class="cursor-pointer"
            v-model="selectedHealthAuthority"
            :items="healthAuthorities"
            placeholder="Select Item"
            density="compact"
            variant="outlined"
            clearable
          ></v-autocomplete>
        </v-col>
        <v-col v-if="initiative !== null" cols="4">
          <div class="d-flex">
            <h6>PCN Community</h6>
            <span class="text-danger ml-1 mb-2 font-weight-bold">*</span>
            <v-icon
              color="dark-grey"
              v-tooltip="'Regional Health Authority'"
              size="sm"
              class="ml-1 mt-1"
            >
              mdi-information
            </v-icon>
          </div>
          <v-autocomplete
            class="cursor-pointer"
            chips
            clearable
            v-model="selectedPCNCommunity"
            :items="pcnCommunities"
            placeholder="Select Item"
            density="compact"
            variant="outlined"
            multiple
            ><template v-slot:prepend-item>
              <v-list-item ripple @click="togglePCNCommunity">
                <v-list-item-action>
                  <v-icon
                    class="mx-2"
                    :icon="
                      selectedPCNCommunity.length === pcnCommunities.length
                        ? 'mdi-checkbox-marked'
                        : 'mdi-checkbox-blank-outline'
                    "
                  ></v-icon
                  >Select All
                </v-list-item-action>
              </v-list-item>
              <v-divider class="mt-2"></v-divider> </template
          ></v-autocomplete>
        </v-col>
        <!-- Select PCN/UPCC/CHC Name -->
        <v-col v-if="initiative !== null && initiative !== 'pcn'">
          <div class="d-flex">
            <h6>{{ String(initiative).toUpperCase() }} Name</h6>
            <span class="text-danger ml-1 mb-2 font-weight-bold">*</span>
            <v-icon
              color="dark-grey"
              v-tooltip="'Regional Health Authority'"
              size="sm"
              class="ml-1 mt-1"
            >
              mdi-information
            </v-icon>
          </div>
          <v-autocomplete
            class="cursor-pointer"
            chips
            clearable
            v-model="selectedInitiativeName"
            :items="initiativeNames"
            placeholder="Select Item"
            density="compact"
            variant="outlined"
            multiple
            ><template v-slot:prepend-item>
              <v-list-item ripple @click="toggle">
                <v-list-item-action>
                  <v-icon
                    class="mx-2"
                    :icon="
                      selectedInitiativeName.length === initiativeNames.length
                        ? 'mdi-checkbox-marked'
                        : 'mdi-checkbox-blank-outline'
                    "
                  ></v-icon
                  >Select All
                </v-list-item-action>
              </v-list-item>
              <v-divider class="mt-2"></v-divider> </template
          ></v-autocomplete>
        </v-col>
      </v-row>
      <!-- Fiscal year and Period -->
      <v-row gap>
        <!-- Fiscal Year -->
        <v-col v-if="initiative !== null" cols="4">
          <div class="d-flex w-33">
            <h6>Fiscal Year</h6>
            <span class="text-danger ml-1 mb-2 font-weight-bold">*</span>
            <v-icon
              color="dark-grey"
              v-tooltip="'Regional Health Authority'"
              size="sm"
              class="ml-1 mt-1"
            >
              mdi-information
            </v-icon>
          </div>
          <v-select
            class="cursor-pointer"
            :clearable="authStore.user.role === 'admin'"
            v-model="selectedFiscalYear"
            :items="fiscalYears"
            :disabled="authStore.user.role !== 'admin'"
            placeholder="Select Item"
            density="compact"
            variant="outlined"
          ></v-select>
        </v-col>
        <!-- Reporting Period -->
        <v-col v-if="initiative !== null" cols="4">
          <div class="d-flex">
            <h6>Reporting Period</h6>
            <span class="text-danger ml-1 mb-2 font-weight-bold">*</span>
            <v-icon
              color="dark-grey"
              v-tooltip="'Regional Health Authority'"
              size="sm"
              class="ml-1 mt-1"
            >
              mdi-information
            </v-icon>
          </div>
          <v-select
            class="cursor-pointer"
            v-model="selectedPeriod"
            :clearable="authStore.user.role === 'admin'"
            :items="periods"
            :disabled="authStore.user.role !== 'admin'"
            placeholder="Select Item"
            density="compact"
            variant="outlined"
          ></v-select>
        </v-col>
      </v-row>
      <div class="d-flex flex-row w-25">
        <v-btn
          :color="isValid ? 'primary' : 'grey-lighten-1'"
          :variant="isValid ? 'flat' : 'plain'"
          :readonly="isPending || !isValid"
          :text="
            isPending || reportingPeriodsIsPending
              ? 'Loading...'
              : 'Download Template'
          "
          @click="mutation.mutate"
        ></v-btn>
        <v-btn
          v-if="environment === 'dev'"
          class="mr-2"
          color="secondary"
          variant="flat"
          :disabled="isPending || !isValid"
          :text="
            isPending || reportingPeriodsIsPending
              ? 'Loading...'
              : 'Create Mappings (DEV only)'
          "
          @click="mappingMutation.mutate"
        ></v-btn>
      </div>
    </v-container>
    <v-container v-if="!authStore.authenticated">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="headline"
              >User session invalidated, this is most likely due to CHEFS or RLS
              user login.</v-card-title
            >
            <v-btn
              color="primary"
              variant="flat"
              class="mr-2"
              text="Refresh Login"
              @click="authStore.login"
            ></v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { toast } from "vue-sonner";
import FileSaver from "file-saver";
import apiService from "../services/apiService";
import { periods } from "../utils/enums/application";
import { RLS } from "../utils/types/rls";
import { HA, haMapping, InitiativeTypes } from "../utils/types";
import { useAuthStore } from "../stores/authStore";
import { getCurrentFiscalAndPeriod } from "../utils/helper";

const environment = import.meta.env.VITE_ENVIRONMENT || "local";

const authStore = useAuthStore();

// Reactive selections
const healthAuthorities = ref<string[]>([]);
const pcnCommunities = ref<string[]>([]);
const initiativeNames = ref<string[]>([]);
const fiscalYears = ref<string[]>([]);

// Reactive selected values
const selectedRLSEntries = ref<RLS[]>([]);
const selectedHealthAuthority = ref<HA | undefined>();
const selectedPCNCommunity = ref();
const selectedInitiativeName = ref();
const selectedFiscalYear = ref();
const selectedPeriod = ref();
const initiative = ref<InitiativeTypes>(null);

// Computed values
const isValid = computed(() => {
  return (
    selectedHealthAuthority.value &&
    selectedPCNCommunity.value.length > 0 &&
    (initiative.value === "pcn" || selectedInitiativeName.value.length > 0) &&
    selectedFiscalYear.value &&
    selectedPeriod.value
  );
});

// tanstack - Queries
const { isPending, data } = useQuery({
  queryKey: ["health-authority"],
  queryFn: async () => {
    const response = await apiService.getHealthAuthority().then((data) => {
      return data;
    });
    return response;
  },
});
const { isPending: reportingPeriodsIsPending, data: reportingPeriodsData } =
  useQuery({
    queryKey: ["reporting-periods"],
    queryFn: () => apiService.getReportingPeriods(),
  });
const mutation = useMutation({
  // data sent back is a blob to be saved as a file
  mutationFn: () =>
    apiService
      .getDataTemplate({
        typeOfInitiative: String(initiative.value),
        healthAuthority: String(selectedHealthAuthority.value),
        communitiesNames: selectedPCNCommunity.value,
        initiativeNames: selectedInitiativeName.value,
        fiscalYear: String(selectedFiscalYear.value),
        reportingPeriod: String(selectedPeriod.value),
      })
      .then((data) => {
        const today = new Date();
        const fileName = `HLTH.FinRpt.${
          haMapping[selectedHealthAuthority.value || "NotAvailable"]
        }.${initiative.value?.toUpperCase()}.FY${String(
          selectedFiscalYear.value
        )
          .substring(2)
          .replace("/", "")}.${selectedPeriod.value}.${today.getFullYear()}${(
          today.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}${today
          .getDate()
          .toString()
          .padStart(2, "0")}.${today
          .getHours()
          .toString()
          .padStart(2, "0")}${today.getMinutes().toString().padStart(2, "0")}`;
        FileSaver.saveAs(data.data, `${fileName}.xlsm`);
        toast.success("Template downloaded successfully", {
          duration: 5000,
        });
        toast.dismiss();
      }),
  onError: (error) => {
    // @ts-expect-error - error is not defined
    toast.error(`Mapping failed: ${error.message} - ${error.response.data}`, {
      duration: 5000,
    });
    console.log(error);
    toast.dismiss();
  },
  onMutate: () => {
    toast.info("Generating template...");
  },
});
const mappingMutation = useMutation({
  // data sent back is a blob to be saved as a file
  mutationFn: () =>
    apiService
      .getMappings({
        typeOfInitiative: String(initiative.value),
        healthAuthority: String(selectedHealthAuthority.value),
        communitiesNames: selectedPCNCommunity.value,
        initiativeNames: selectedInitiativeName.value,
        fiscalYear: String(selectedFiscalYear.value),
        reportingPeriod: String(selectedPeriod.value),
      })
      .then((data) => {
        toast.success("Mappings generated successfully", {
          duration: 5000,
        });
        console.log(data);
        toast.dismiss();
      }),
  onError: (error) => {
    // @ts-expect-error - error is not defined
    toast.error(`Mapping failed: ${error.message} - ${error.response.data}`, {
      duration: 5000,
    });
    console.log(error);
    toast.dismiss();
  },
  onMutate: () => {
    toast.info("Generating mappings...");
  },
});

// Effects
// when the queried data changes, update the Health Authorities
watch(
  () => initiative.value,
  (newInitiative) => {
    if (!newInitiative) return;
    selectedHealthAuthority.value = undefined;
    selectedPCNCommunity.value = [];
    selectedInitiativeName.value = [];
  }
);

// when the periods are available, populate the Fiscal Year
watch(
  () => reportingPeriodsData.value,
  (newData) => {
    if (!newData || newData.data.length === 0) return;
    fiscalYears.value = [
      ...new Set(
        newData && newData.data
          ? (newData.data as { fiscalYear: string }[]).map((fiscal) =>
              String(fiscal.fiscalYear)
            )
          : []
      ),
    ]
      .filter((item) => item !== "2022/23")
      .sort((a, b) => Number(b.substring(5)) - Number(a.substring(5)));

    const currentPeriodAndFiscal = getCurrentFiscalAndPeriod(newData.data);

    selectedPeriod.value = `P${currentPeriodAndFiscal.period}`;
    selectedFiscalYear.value = currentPeriodAndFiscal.fiscalYear;
  }
);

// when the queried data changes, update the Health Authorities
watch(
  () => data.value,
  (newData) => {
    healthAuthorities.value = [
      ...new Set(
        newData && newData.data.data
          ? (newData.data.data as RLS[]).map((ha) => String(ha.healthAuthority))
          : []
      ),
    ];
  }
);

// when the selected Health Authority changes, update the PCN Communities
watch(
  () => selectedHealthAuthority.value,
  (selectedHealthAuthorityValue) => {
    if (!selectedHealthAuthorityValue) return;
    selectedPCNCommunity.value = [];
    selectedRLSEntries.value =
      data.value && data.value.data.data
        ? (data.value.data.data as RLS[])
            .filter((ha) => ha.healthAuthority === selectedHealthAuthorityValue)
            .map((entry) => entry)
        : [];
    pcnCommunities.value = [
      ...new Set(
        selectedRLSEntries.value.map((ha) => String(ha.communityName))
      ),
    ];
  }
);

// when the selected PCN Community changes, update the PCN Names
watch(
  () => selectedPCNCommunity.value,
  (selectedPCNCommunityValue) => {
    if (!selectedPCNCommunityValue || !initiative.value) return;
    selectedInitiativeName.value = [];
    initiativeNames.value = [
      ...new Set(
        selectedRLSEntries.value
          .filter((ha) => selectedPCNCommunityValue.includes(ha.communityName))
          .map((ha) => {
            const key = `${initiative.value}Name` as keyof typeof ha;
            return String(ha[key]);
          })
          .filter((name) => name !== "null")
      ),
    ];
  }
);

// Functions
function togglePCNCommunity() {
  if (selectedPCNCommunity.value.length === pcnCommunities.value.length) {
    selectedPCNCommunity.value = [];
  } else {
    selectedPCNCommunity.value = pcnCommunities.value;
  }
}

function toggle() {
  if (selectedInitiativeName.value.length === initiativeNames.value.length) {
    selectedInitiativeName.value = [];
  } else {
    selectedInitiativeName.value = initiativeNames.value;
  }
}
</script>

<style scoped></style>
