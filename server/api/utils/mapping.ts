export default {
  mapBudgetAndFinancialSubmissions(
    budgets: any[],
    financials: any[],
    initiative: string
  ) {
    console.log("Budgets ", budgets);
    console.log("Financials ", financials);
    const budgetToReporting = budgets.map((budget: any) => {
      return {
        budget: budget,
        reporting: financials.filter((financial: any) => {
          if (
            initiative === "pcn" &&
            financial.communityName === budget.communityName
          ) {
            return true;
          }
          return false;
        }),
      };
    });

    return budgetToReporting;
  },
  mapFinancialItems(budgetSubmission: any, reportingSubmission: any) {
    console.log("Budget Submission ", budgetSubmission);
    console.log("Reporting Submission ", reportingSubmission);

    if (
      !budgetSubmission.pcnBudget ||
      budgetSubmission.pcnBudget.length === 0
    ) {
      return [];
    }

    if (!reportingSubmission.financialData) {
      return [];
    }
    const budgetData = budgetSubmission.pcnBudget;
    const reportingData = reportingSubmission.financialData;

    let financials: any[] = [];

    const iterate = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        console.log(`key: ${key}, value: ${obj[key]}`);
        if (key === "financials") {
          financials.push(...obj[key]);
        }

        if (typeof obj[key] === "object" && obj[key] !== null) {
          iterate(obj[key]);
        }
      });
    };

    iterate(reportingData);

    console.log("Financials ", financials);

    const budgetToFinancials = budgetData.map((budget: any) => {
      return {
        budget: budget,
        reporting: financials.filter((report: any) => {
          if (
            budget.expenseCategory === report.expenseCategory &&
            budget.expenseSubCategory === report.expenseSubCategory
          ) {
            if (budget.expenseItem === "" && budget.expenseItemSubType === "") {
              return true;
            } else if (
              budget.expenseItem === reportingData.expenseItem &&
              budget.expenseItemSubType === ""
            ) {
              return true;
            } else if (
              budget.expenseItem !== "" &&
              budget.expenseItemSubType !== "" &&
              budget.expenseItem === report.expenseItem &&
              budget.expenseItemSubType === report.expenseItemSubType
            ) {
              return true;
            } else {
              return false;
            }
          }
          return false;
        }),
      };
    });

    return budgetToFinancials;
  },
};
