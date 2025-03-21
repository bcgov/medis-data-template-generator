export default {
  // Maps 2 submissions with each other, they are withing the parameters provided in the request.
  mapBudgetAndFinancialSubmissions(
    budgets: any[],
    financials: any[],
    initiative: string
  ) {
    const budgetToReporting = budgets.map((budget: any) => {
      return {
        budget: budget,
        reporting: financials.filter((financial: any) => {
          if (
            initiative === "pcn" &&
            financial.communityName === budget.communityName
          ) {
            return true;
          } else if (
            (initiative === "upcc" ||
              initiative === "chc" ||
              initiative === "nppcc") &&
            financial.communityName === budget.communityName &&
            financial[`${initiative}Name`] === budget[`${initiative}Name`]
          ) {
            return true;
          }
          return false;
        }),
      };
    });

    return budgetToReporting;
  },
  // Withing a mapped Submission, map the budget items to the financial items.
  mapFinancialItems(
    budgetSubmission: any,
    reportingSubmission: any,
    healthAuthority: string,
    initiative: string,
    periodReported: string
  ) {
    if (
      !budgetSubmission[`${initiative}Budget`] ||
      budgetSubmission[`${initiative}Budget`].length === 0
    ) {
      console.log("No budget items found");
      return [];
    }

    // In the case there are no associated Financial Reporting submission, return the budget items.
    if (!reportingSubmission || !reportingSubmission.financialData) {
      return budgetSubmission[`${initiative}Budget`].map((budget: any) => {
        return {
          submissionInformation: {
            healthAuthority: healthAuthority,
            communityName: budgetSubmission.communityName,
            initiativeName:
              initiative !== "pcn" ? budgetSubmission[`${initiative}Name`] : "",
            fiscalYear: budgetSubmission.fiscalYear,
            periodReported: Number(periodReported.split("P")[1]),
          },
          budget: budget,
          reporting: [],
        };
      });
    }
    const budgetData = budgetSubmission[`${initiative}Budget`];
    const reportingData = reportingSubmission.financialData;

    let financials: any[] = [];

    // Recursively iterate through the object and find the financials arrays.
    const iterate = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (key === "financials") {
          financials.push(...obj[key]);
        }

        if (typeof obj[key] === "object" && obj[key] !== null) {
          iterate(obj[key]);
        }
      });
    };

    iterate(reportingData);

    console.log("budget data",budgetData);
    console.log("financials",reportingSubmission.financialData);

    // If there is a submission but there are no financials associated with the budget, return the period so signify there is a submission.
    const budgetToFinancials = budgetData.map((budget: any) => {
      let budgetLevel = {};

      if (
        budget.expenseCategory === "Division Of Family Practice" &&
        budget.expenseItem !== "Change Management" &&
        budget.expenseSubCategory === "Overhead"
      ) {
        budgetLevel = reportingSubmission?.financialData?.dofp?.overhead?.budget ?? {};
      } else if (
        budget.expenseCategory === "Division Of Family Practice" &&
        budget.expenseItem === "Change Management"
      ) {
        budgetLevel = reportingSubmission?.financialData?.changeManagement?.budget ?? {};
      } else if (
        budget.expenseCategory === "Health Authority" &&
        budget.expenseItem !== "Change Management" &&
        budget.expenseSubCategory === "Overhead"
      ) {
        if (initiative === "pcn") {
          budgetLevel =
            reportingSubmission?.financialData?.healthAuthority?.overhead?.budget ?? {};
        } else {
          budgetLevel = reportingSubmission?.financialData?.overhead?.budget ?? {};
        }
      }

      return {
        submissionInformation: {
          healthAuthority: reportingSubmission.healthAuthority,
          communityName: reportingSubmission.communityName,
          fiscalYear: reportingSubmission.fiscalYear,
          periodReported: Number(periodReported.split("P")[1]),
          initiativeName:
            initiative !== "pcn"
              ? reportingSubmission[`${initiative}Name`]
              : "",
          notes:
            reportingSubmission.financialData.notes ||
            reportingSubmission.financialData.additionalNotes,
          reasonForExceptionInPeriodReported:
            reportingSubmission.reasonForExceptionInPeriodReported,
          budgetLevel: budgetLevel,
        },
        budget: budget,
        reporting: financials
          .filter((report: any) => {
            if (
              budget.expenseCategory === report.expenseCategory &&
              budget.expenseSubCategory === report.expenseSubCategory
            ) {
              if (
                !budget.expenseItem &&
                !budget.expenseItemSubType &&
                (initiative === "upcc"
                  ? budget.typeOfCare === report.typeOfCare
                  : true)
              ) {
                return true;
              } else if (
                budget.expenseItem === report.expenseItem &&
                !budget.expenseItemSubType &&
                (initiative === "upcc"
                  ? budget.typeOfCare === report.typeOfCare
                  : true)
              ) {
                return true;
              } else if (
                budget.expenseItem === report.expenseItem &&
                budget.expenseItemSubType === report.expenseItemSubType &&
                (initiative === "upcc"
                  ? budget.typeOfCare === report.typeOfCare
                  : true)
              ) {
                return true;
              } else {
                return false;
              }
            }
            return false;
          })
          .map((report: any) => {
            return {
              ...report,
              notes:
                reportingSubmission.financialData.notes ||
                reportingSubmission.financialData.additionalNotes,
            };
          }),
      };
    });
    return budgetToFinancials;
  },
};
