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
  getDataTemplate(data: any) {
    return apiAxios().post("/generate-template", data);
  },
};
