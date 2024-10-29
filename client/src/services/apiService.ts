import { FinancialSubmission } from "../utils/types";
import { apiAxios } from "./interceptors";

export default {
  getHealthAuthority() {
    return apiAxios().get("/health-authority");
  },
  getReportingPeriods() {
    return apiAxios().get("/reporting-periods");
  },
  getHealthCheck() {
    return apiAxios().get("/health-check");
  },
  getDataTemplate(data: FinancialSubmission) {
    return apiAxios().post("/generate-template", data, {
      responseType: "blob",
    });
  },
  getMappings(data: FinancialSubmission) {
    return apiAxios().post("/generate-template/create-mappings", data);
  },
  getRole() {
    return apiAxios().get("/role");
  },
  uploadFinancialDataTemplate(data: FormData) {
    return apiAxios().post("/replace-template/financial", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
