import { FinancialSubmission } from "../../interfaces/FinancialSubmission";

export default function ChefsService() {
  const SERVICE = "CHEFS";
  const apiUrl = process.env.CHEFS_API_URL;
  const credentials = {
    fiscalYearReportingDatesFormId:
      process.env.CHEFS_FISCAL_YEAR_REPORTING_DATES_FORM_ID,
    fiscalYearReportingDatesApiKey:
      process.env.CHEFS_FISCAL_YEAR_REPORTING_DATES_API_KEY,
    pcnBudgetFormId: process.env.CHEFS_PCN_BUDGET_FORM_ID,
    pcnBudgetApiKey: process.env.CHEFS_PCN_BUDGET_API_KEY,
    pcnFinancialFormId: process.env.CHEFS_PCN_FINANCIAL_FORM_ID,
    pcnFinancialApiKey: process.env.CHEFS_PCN_FINANCIAL_API_KEY,
  };

  const getReportingPeriod = async () => {
    try {
      const fields = "fiscalYear,periodReportingDates";
      const url = `${apiUrl}/forms/${credentials.fiscalYearReportingDatesFormId}/submissions?deleted=false&draft=false&fields=${fields}`;
      const response = await fetch(url, {
        headers: {
          Authorization:
            "Basic " +
            btoa(
              credentials.fiscalYearReportingDatesFormId +
                ":" +
                credentials.fiscalYearReportingDatesApiKey
            ),
        },
      }).then((res) => res.json());

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
        const fields = "fiscalYear,pcnBudget,communityName";
        const url = `${apiUrl}/forms/${credentials.pcnBudgetFormId}/submissions?deleted=false&draft=false&fields=${fields}`;
        const response = await fetch(url, {
          headers: {
            Authorization:
              "Basic " +
              btoa(
                credentials.pcnBudgetFormId + ":" + credentials.pcnBudgetApiKey
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
            response.find(
              (budget: any) =>
                budget.communityName === community &&
                budget.fiscalYear === data.fiscalYear
            )
          )
          .filter((budget: any) => budget);
        return budgets;
      case "upcc":
        return {};
      case "nppcc":
        return {};
      case "chc":
        return {};
      default:
        throw new Error("Invalid type of initiative");
    }
  };

  const getReportingSubmissionsForFiscalYearAndPeriod = async (
    data: FinancialSubmission
  ) => {
    switch (data.typeOfInitiative) {
      case "pcn":
        const fields =
          "healthAuthority,communityName,fiscalYear,periodReported,financialData";
        const url = `${apiUrl}/forms/${credentials.pcnFinancialFormId}/submissions?deleted=false&draft=false&fields=${fields}`;
        const response = await fetch(url, {
          headers: {
            Authorization:
              "Basic " +
              btoa(
                credentials.pcnFinancialFormId +
                  ":" +
                  credentials.pcnFinancialApiKey
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

        console.log("response", response);
        const reportings = data.communitiesNames
          .map((community) => {
            return response.find((submission: any) => {
              return (
                submission.communityName === community &&
                submission.fiscalYear === data.fiscalYear &&
                submission.periodReported ===
                  Number(data.reportingPeriod.split("P")[1])
              );
            });
          })
          .filter((submission: any) => submission);
        return reportings;
      case "upcc":
        return {};
      case "nppcc":
        return {};
      case "chc":
        return {};
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
