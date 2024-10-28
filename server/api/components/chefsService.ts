import { FinancialSubmission } from "../../interfaces/FinancialSubmission";
import env from "../utils/env";

export default function ChefsService() {
  const getReportingPeriod = async () => {
    try {
      const fields = "fiscalYear,periodReportingDates";
      const url = `${env.CHEFS_API_URL}/forms/${env.CHEFS_FISCAL_YEAR_REPORTING_DATES_FORM_ID}/submissions?deleted=false&draft=false&fields=${fields}`;

      const response = await fetch(url, {
        headers: {
          Authorization:
            "Basic " +
            btoa(
              env.CHEFS_FISCAL_YEAR_REPORTING_DATES_FORM_ID +
                ":" +
                env.CHEFS_FISCAL_YEAR_REPORTING_DATES_API_KEY
            ),
        },
      })
        .then((res) => res.json())
        .catch((error) => {
          console.error("Error fetching budget submission", error);
          throw new Error("Error fetching budget submission");
        });

      return response;
    } catch (error) {
      console.error("Error fetching reporting period", error);
      throw new Error("Error fetching reporting period");
    }
  };

  const getBudgetSubmissionForFiscalYear = async (
    data: FinancialSubmission
  ) => {
    switch (data.typeOfInitiative) {
      case "pcn":
        const pcnFields = "fiscalYear,pcnBudget,communityName";
        const pcnUrl = `${env.CHEFS_API_URL}/forms/${env.CHEFS_PCN_BUDGET_FORM_ID}/submissions?deleted=false&draft=false&fields=${pcnFields}`;
        const pcnResponse = await fetch(pcnUrl, {
          headers: {
            Authorization:
              "Basic " +
              btoa(
                env.CHEFS_PCN_BUDGET_FORM_ID +
                  ":" +
                  env.CHEFS_PCN_BUDGET_API_KEY
              ),
          },
        })
          .then((res) => res.json())
          .catch((error) => {
            console.error("Error fetching budget submission", error);
            throw new Error("Error fetching budget submission");
          });

        const budgets = data.communitiesNames
          .map((community) =>
            pcnResponse.find(
              (budget: any) =>
                budget.communityName === community &&
                budget.fiscalYear === data.fiscalYear
            )
          )
          .filter((budget: any) => budget);
        return budgets;
      case "upcc":
        const upccFields =
          "healthAuthority,communityName,upccName,fiscalYear,upccBudget";
        const upccUrl = `${env.CHEFS_API_URL}/forms/${env.CHEFS_UPCC_BUDGET_FORM_ID}/submissions?deleted=false&draft=false&fields=${upccFields}`;
        const upccResponse = await fetch(upccUrl, {
          headers: {
            Authorization:
              "Basic " +
              btoa(
                env.CHEFS_UPCC_BUDGET_FORM_ID +
                  ":" +
                  env.CHEFS_UPCC_BUDGET_API_KEY
              ),
          },
        })
          .then((res) => res.json())
          .catch((error) => {
            console.error("Error fetching budget submission", error);
            throw new Error("Error fetching budget submission");
          });
        const upccBudgets = data.initiativeNames
          .map((initiativeName) =>
            upccResponse.find(
              (budget: any) =>
                budget.upccName === initiativeName &&
                data.communitiesNames.includes(budget.communityName) &&
                budget.fiscalYear === data.fiscalYear
            )
          )
          .filter((budget: any) => budget);
        return upccBudgets;
      case "nppcc":
        const nppccFields =
          "healthAuthority,communityName,nppccName,fiscalYear,nppccBudget";
        const nppccUrl = `${env.CHEFS_API_URL}/forms/${env.CHEFS_NPPCC_BUDGET_FORM_ID}/submissions?deleted=false&draft=false&fields=${nppccFields}`;
        const nppccResponse = await fetch(nppccUrl, {
          headers: {
            Authorization:
              "Basic " +
              btoa(
                env.CHEFS_NPPCC_BUDGET_FORM_ID +
                  ":" +
                  env.CHEFS_NPPCC_BUDGET_API_KEY
              ),
          },
        })
          .then((res) => res.json())
          .catch((error) => {
            console.error("Error fetching budget submission", error);
            throw new Error("Error fetching budget submission");
          });
        const nppccBudgets = data.initiativeNames
          .map((initiativeName) =>
            nppccResponse.find(
              (budget: any) =>
                budget.nppccName === initiativeName &&
                data.communitiesNames.includes(budget.communityName) &&
                budget.fiscalYear === data.fiscalYear
            )
          )
          .filter((budget: any) => budget);
        return nppccBudgets;
      case "chc":
        const chcFields =
          "healthAuthority,communityName,chcName,fiscalYear,chcBudget";
        const chcUrl = `${env.CHEFS_API_URL}/forms/${env.CHEFS_CHC_BUDGET_FORM_ID}/submissions?deleted=false&draft=false&fields=${chcFields}`;
        const chcResponse = await fetch(chcUrl, {
          headers: {
            Authorization:
              "Basic " +
              btoa(
                env.CHEFS_CHC_BUDGET_FORM_ID +
                  ":" +
                  env.CHEFS_CHC_BUDGET_API_KEY
              ),
          },
        })
          .then((res) => res.json())
          .catch((error) => {
            console.error("Error fetching budget submission", error);
            throw new Error("Error fetching budget submission");
          });
        const chcBudgets = data.initiativeNames
          .map((initiativeName) =>
            chcResponse.find(
              (budget: any) =>
                budget.chcName === initiativeName &&
                data.communitiesNames.includes(budget.communityName) &&
                budget.fiscalYear === data.fiscalYear
            )
          )
          .filter((budget: any) => budget);
        return chcBudgets;
      default:
        throw new Error("Invalid type of initiative");
    }
  };

  const getReportingSubmissionsForFiscalYearAndPeriod = async (
    data: FinancialSubmission
  ) => {
    switch (data.typeOfInitiative) {
      case "pcn":
        const pcnFields =
          "healthAuthority,communityName,fiscalYear,periodReported,financialData";
        const pcnUrl = `${env.CHEFS_API_URL}/forms/${env.CHEFS_PCN_FINANCIAL_FORM_ID}/submissions?deleted=false&draft=false&fields=${pcnFields}`;
        const pcnResponse = await fetch(pcnUrl, {
          headers: {
            Authorization:
              "Basic " +
              btoa(
                env.CHEFS_PCN_FINANCIAL_FORM_ID +
                  ":" +
                  env.CHEFS_PCN_FINANCIAL_API_KEY
              ),
          },
        })
          .then((res) => res.json())
          .catch((error) => {
            console.error(
              "Error fetching financial reporting submission",
              error
            );
            throw new Error("Error fetching financial reporting submission");
          });
        const pcnReports = data.communitiesNames
          .map((community) => {
            for (
              let i = Number(data.reportingPeriod.split("P")[1]);
              i > 0;
              i--
            ) {
              const reportingSubmission = pcnResponse.find(
                (submission: any) => {
                  return (
                    submission.communityName === community &&
                    submission.fiscalYear === data.fiscalYear &&
                    submission.periodReported === i
                  );
                }
              );
              if (reportingSubmission) {
                return reportingSubmission;
              }
            }
            return null;
          })
          .filter((submission: any) => submission);
        return pcnReports;
      case "upcc":
        const upccFields =
          "healthAuthority,communityName,upccName,fiscalYear,periodReported,financialData";
        const upccUrl = `${env.CHEFS_API_URL}/forms/${env.CHEFS_UPCC_FINANCIAL_FORM_ID}/submissions?deleted=false&draft=false&fields=${upccFields}`;
        const upccResponse = await fetch(upccUrl, {
          headers: {
            Authorization:
              "Basic " +
              btoa(
                env.CHEFS_UPCC_FINANCIAL_FORM_ID +
                  ":" +
                  env.CHEFS_UPCC_FINANCIAL_API_KEY
              ),
          },
        })
          .then((res) => res.json())
          .catch((error) => {
            console.error(
              "Error fetching financial reporting submission",
              error
            );
            throw new Error("Error fetching financial reporting submission");
          });
        const upccReports = data.initiativeNames
          .map((initiativeName) => {
            for (
              let i = Number(data.reportingPeriod.split("P")[1]);
              i > 0;
              i--
            ) {
              const reportingSubmission = upccResponse.find(
                (submission: any) => {
                  return (
                    submission.upccName === initiativeName &&
                    data.communitiesNames.includes(submission.communityName) &&
                    submission.fiscalYear === data.fiscalYear &&
                    submission.periodReported === i
                  );
                }
              );
              if (reportingSubmission) {
                return reportingSubmission;
              }
            }
            return null;
          })
          .filter((submission: any) => submission);
        return upccReports;
      case "nppcc":
        const nppccFields =
          "healthAuthority,communityName,nppccName,fiscalYear,periodReported,financialData";
        const nppccUrl = `${env.CHEFS_API_URL}/forms/${env.CHEFS_NPPCC_FINANCIAL_FORM_ID}/submissions?deleted=false&draft=false&fields=${nppccFields}`;
        const nppccResponse = await fetch(nppccUrl, {
          headers: {
            Authorization:
              "Basic " +
              btoa(
                env.CHEFS_NPPCC_FINANCIAL_FORM_ID +
                  ":" +
                  env.CHEFS_NPPCC_FINANCIAL_API_KEY
              ),
          },
        })
          .then((res) => res.json())
          .catch((error) => {
            console.error(
              "Error fetching financial reporting submission",
              error
            );
            throw new Error("Error fetching financial reporting submission");
          });
        const nppccReports = data.initiativeNames
          .map((initiativeName) => {
            for (
              let i = Number(data.reportingPeriod.split("P")[1]);
              i > 0;
              i--
            ) {
              const reportingSubmission = nppccResponse.find(
                (submission: any) => {
                  return (
                    submission.nppccName === initiativeName &&
                    data.communitiesNames.includes(submission.communityName) &&
                    submission.fiscalYear === data.fiscalYear &&
                    submission.periodReported === i
                  );
                }
              );
              if (reportingSubmission) {
                return reportingSubmission;
              }
            }
            return null;
          })
          .filter((submission: any) => submission);
        return nppccReports;
      case "chc":
        const chcFields =
          "healthAuthority,communityName,chcName,fiscalYear,periodReported,financialData";
        const chcUrl = `${env.CHEFS_API_URL}/forms/${env.CHEFS_CHC_FINANCIAL_FORM_ID}/submissions?deleted=false&draft=false&fields=${chcFields}`;
        const chcResponse = await fetch(chcUrl, {
          headers: {
            Authorization:
              "Basic " +
              btoa(
                env.CHEFS_CHC_FINANCIAL_FORM_ID +
                  ":" +
                  env.CHEFS_CHC_FINANCIAL_API_KEY
              ),
          },
        })
          .then((res) => res.json())
          .catch((error) => {
            console.error(
              "Error fetching financial reporting submission",
              error
            );
            throw new Error("Error fetching financial reporting submission");
          });
        const chcReports = data.initiativeNames
          .map((initiativeName) => {
            for (
              let i = Number(data.reportingPeriod.split("P")[1]);
              i > 0;
              i--
            ) {
              const reportingSubmission = chcResponse.find(
                (submission: any) => {
                  return (
                    submission.chcName === initiativeName &&
                    data.communitiesNames.includes(submission.communityName) &&
                    submission.fiscalYear === data.fiscalYear &&
                    submission.periodReported === i
                  );
                }
              );
              if (reportingSubmission) {
                return reportingSubmission;
              }
            }
            return null;
          })
          .filter((submission: any) => submission);
        return chcReports;
      default:
        throw new Error("Invalid type of initiative");
    }
  };

  return {
    getReportingPeriod,
    getBudgetSubmissionForFiscalYear,
    getReportingSubmissionsForFiscalYearAndPeriod,
  };
}
