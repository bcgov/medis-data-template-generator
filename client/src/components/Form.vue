<template>
  <div>
    <v-container fluid>
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
          class="mr-2"
          :color="isValid ? 'secondary' : 'grey-lighten-1'"
          :variant="isValid ? 'flat' : 'plain'"
          :readonly="isPending || !isValid"
          :text="
            isPending || reportingPeriodsIsPending
              ? 'Loading...'
              : 'Create Mappings (DEV only)'
          "
          @click="mappingMutation.mutate"
        ></v-btn>
        <v-btn
          :color="isValid ? 'primary' : 'grey-lighten-1'"
          :variant="isValid ? 'flat' : 'plain'"
          :readonly="isPending || !isValid"
          :text="
            isPending || reportingPeriodsIsPending ? 'Loading...' : 'Download Template'
          "
          @click="mutation.mutate"
        ></v-btn>
      </div>
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
import { InitiativeTypes, ReportingPeriods } from "../utils/types";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();

// Reactive selections
const healthAuthorities = ref<string[]>([]);
const pcnCommunities = ref<string[]>([]);
const initiativeNames = ref<string[]>([]);
const fiscalYears = ref<string[]>([]);

// Reactive selected values
const selectedRLSEntries = ref<RLS[]>([]);
const selectedHealthAuthority = ref();
const selectedPCNCommunity = ref();
const selectedInitiativeName = ref();
const selectedFiscalYear = ref(
  new Date().getFullYear().toString() +
    "/" +
    (new Date().getFullYear() + 1).toString().substring(2, 4)
);
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
const { isPending: reportingPeriodsIsPending, data: reportingPeriodsData } = useQuery({
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
        FileSaver.saveAs(data.data, "output.xlsm");
        toast.success("Template downloaded successfully", {
          duration: 5000,
        });
        toast.dismiss();
      }),
  onError: (error) => {
    toast.error(`Mapping failed: ${error.message} - ${error.response.data}`, {
      duration: 5000,
    });
    console.log(error);
    toast.dismiss();
  },
  onMutate: async (variables) => {
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
    toast.error(`Mapping failed: ${error.message} - ${error.response.data}`, {
      duration: 5000,
    });
    console.log(error);
    toast.dismiss();
  },
  onMutate: async (variables) => {
    toast.info("Generating mappings...");
  },
});

// Effects
// when the queried data changes, update the Health Authorities
watch(
  () => initiative.value,
  (newInitiative) => {
    if (!newInitiative) return;
    selectedHealthAuthority.value = null;
    selectedPCNCommunity.value = [];
    selectedInitiativeName.value = [];
  }
);

// when the periods are available, populate the Fiscal Year
watch(
  () => reportingPeriodsData.value,
  (newData) => {
    if (!newData || newData.data.length === 0) return;

    const today = new Date();

    newData.data
      .find(
        (fiscal: { fiscalYear: string; periodReportingDates: ReportingPeriods[] }) =>
          fiscal.fiscalYear === selectedFiscalYear.value
      )
      .periodReportingDates.forEach((period: ReportingPeriods) => {
        if (
          today >= new Date(period.startDate) &&
          today <= new Date(period.submissionDueDate) &&
          period.period !== 14
        ) {
          selectedPeriod.value = `P${period.period}`;
          return;
        }
      });

    fiscalYears.value = [
      ...new Set(
        newData && newData.data
          ? (newData.data as { fiscalYear: string }[]).map((fiscal) =>
              String(fiscal.fiscalYear)
            )
          : []
      ),
    ].sort((a, b) => Number(a) - Number(b));
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
      ...new Set(selectedRLSEntries.value.map((ha) => String(ha.communityName))),
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
