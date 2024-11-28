import { FinancialSubmission } from "../utils/types";
import { apiAxios } from "./interceptors";

export default {
  async getHealthAuthority() {
    return (await apiAxios()).get("/health-authority");
  },
  async getReportingPeriods() {
    return (await apiAxios()).get("/reporting-periods");
  },
  async getHealthCheck() {
    return (await apiAxios()).get("/health-check");
  },
  async getDataTemplate(data: FinancialSubmission) {
    return (await apiAxios()).post("/generate-template", data, {
      responseType: "blob",
    });
  },
  async getMappings(data: FinancialSubmission) {
    return (await apiAxios()).post("/generate-template/create-mappings", data);
  },
  async getRole() {
    return (await apiAxios()).get("/role");
  },
  async getLatestFinancialDataTemplate() {
    return (await apiAxios()).get("/replace-template/financial/latest");
  },
  async uploadFinancialDataTemplate(data: FormData) {
    return (await apiAxios()).post("/replace-template/financial", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  async getCurrentFinancialDataTemplate() {
    return (await apiAxios()).get("/replace-template/financial", {
      responseType: "blob",
    });
  },
};
