import constants from "./constants";
import {
  Initiative,
  SubmissionInitiative,
} from "../../interfaces/FinancialSubmission";

const formatValue = (value: any) => {
  return value === undefined || value === null ? null : value;
};

export default {
  fillWorksheet: (
    budgetsToFinancialItems: any[],
    worksheet: any,
    initiative: SubmissionInitiative
  ) => {
    let index = 1;
    budgetsToFinancialItems.forEach((item: any) => {
      if (item.reporting.length === 0) {
        worksheet.cell("A" + String(index)).value(0);
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative].fiscalYear +
              String(index)
          )
          .value(formatValue(item.submissionInformation.fiscalYear));
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative].communityName +
              String(index)
          )
          .value(formatValue(item.submissionInformation.communityName));
        if (initiative === "upcc" || initiative === "chc") {
          worksheet
            .cell(
              (initiative === "upcc"
                ? constants.UPCC.upccName
                : initiative === "chc"
                  ? constants.CHC.chcName
                  : constants.NPPCC.nppccName) + String(index)
            )
            .value(formatValue(item.submissionInformation.initiativeName));
        }
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative].periodReported +
              String(index)
          )
          .value(formatValue(item.submissionInformation.periodReported));
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative].healthAuthority +
              String(index)
          )
          .value(formatValue(item.submissionInformation.healthAuthority));
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative].expenseCategory +
              String(index)
          )
          .value(formatValue(item.budget.expenseCategory));
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative]
              .expenseSubCategory + String(index)
          )
          .value(formatValue(item.budget.expenseSubCategory));
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative].expenseItem +
              String(index)
          )
          .value(formatValue(item.budget.expenseItem));
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative]
              .expenseItemSubType + String(index)
          )
          .value(formatValue(item.budget.expenseItemSubType));
        if (initiative === "pcn") {
          worksheet
            .cell(constants.PCN.approved4YearFtEs + String(index))
            .value(formatValue(item.budget.approved4YearFtEs));
          worksheet
            .cell(constants.PCN.annualBudget + String(index))
            .value(formatValue(item.budget.annualBudget));
        } else {
          worksheet
            .cell(
              constants[initiative.toUpperCase() as "UPCC" | "CHC" | "NPPCC"]
                .approvedFtes + String(index)
            )
            .value(
              formatValue(item.budget.approvedFtes) ||
                formatValue(item.budget.approvedFtesInclRelief)
            );
          worksheet
            .cell(
              constants[initiative.toUpperCase() as "UPCC" | "CHC" | "NPPCC"]
                .approvedBudget + String(index)
            )
            .value(formatValue(item.budget.approvedBudget));
        }
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative]
              .approvedAttachmentTarget + String(index)
          )
          .value(formatValue(item.budget.approvedAttachmentTarget));
        if (initiative === "pcn") {
          worksheet
            .cell(constants.PCN.fiscalYearAllocation + String(index))
            .value(formatValue(item.budget.fiscalYearAllocation));
          worksheet
            .cell(constants.PCN.ftesInclRelief + String(index))
            .value(formatValue(item.budget.ftesInclRelief));
          worksheet
            .cell(constants.PCN.totalBudgetAllocation + String(index))
            .value(formatValue(item.budget.totalBudgetAllocation));
        }
        index = index + 1;
      } else {
        item.reporting.forEach((report: any) => {
          worksheet.cell("A" + String(index)).value(0);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].fiscalYear +
                String(index)
            )
            .value(formatValue(item.submissionInformation.fiscalYear));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].communityName +
                String(index)
            )
            .value(formatValue(item.submissionInformation.communityName));
          if (initiative === "upcc" || initiative === "chc") {
            worksheet
              .cell(
                (initiative === "upcc"
                  ? constants.UPCC.upccName
                  : initiative === "chc"
                    ? constants.CHC.chcName
                    : constants.NPPCC.nppccName) + String(index)
              )
              .value(formatValue(item.submissionInformation.initiativeName));
          }
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].periodReported +
                String(index)
            )
            .value(formatValue(item.submissionInformation.periodReported));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .healthAuthority + String(index)
            )
            .value(formatValue(item.submissionInformation.healthAuthority));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .expenseCategory + String(index)
            )
            .value(formatValue(report.expenseCategory));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .expenseSubCategory + String(index)
            )
            .value(formatValue(report.expenseSubCategory));
          if (initiative === "upcc") {
            worksheet
              .cell(
                constants[initiative.toUpperCase() as "UPCC"].typeOfCare +
                  String(index)
              )
              .value(formatValue(report.typeOfCare));
          }
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].expenseItem +
                String(index)
            )
            .value(formatValue(report.expenseItem));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .expenseItemSubType + String(index)
            )
            .value(formatValue(report.expenseItemSubType));
          if (initiative === "pcn") {
            worksheet
              .cell(constants.PCN.approved4YearFtEs + String(index))
              .value(formatValue(item.budget.approved4YearFtEs));
            worksheet
              .cell(constants.PCN.annualBudget + String(index))
              .value(formatValue(item.budget.annualBudget));
          } else {
            worksheet
              .cell(
                constants[initiative.toUpperCase() as "UPCC" | "CHC" | "NPPCC"]
                  .approvedFtes + String(index)
              )
              .value(
                formatValue(item.budget.approvedFtes) ||
                  formatValue(item.budget.approvedFtesInclRelief)
              );
            worksheet
              .cell(
                constants[initiative.toUpperCase() as "UPCC" | "CHC" | "NPPCC"]
                  .approvedBudget + String(index)
              )
              .value(formatValue(item.budget.approvedBudget));
          }
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .approvedAttachmentTarget + String(index)
            )
            .value(formatValue(item.budget.approvedAttachmentTarget));
          if (initiative === "pcn") {
            worksheet
              .cell(constants.PCN.fiscalYearAllocation + String(index))
              .value(formatValue(item.budget.fiscalYearAllocation));
            worksheet
              .cell(constants.PCN.ftesInclRelief + String(index))
              .value(formatValue(item.budget.ftesInclRelief));
            worksheet
              .cell(constants.PCN.totalBudgetAllocation + String(index))
              .value(formatValue(item.budget.totalBudgetAllocation));

            // Needs clarification on the following fields
            worksheet
              .cell(constants.PCN.otherItems + String(index))
              .value(formatValue(report.otherItems));
            worksheet
              .cell(constants.PCN.listOfRolesTitles + String(index))
              .value(formatValue(report.listOfRolesTitles));
            worksheet
              .cell(constants.PCN.typesOfTraining + String(index))
              .value(formatValue(report.typesOfTraining));
          }

          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p1 +
                String(index)
            )
            .value(formatValue(report.p1));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p2 +
                String(index)
            )
            .value(formatValue(report.p2));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p3 +
                String(index)
            )
            .value(formatValue(report.p3));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p4 +
                String(index)
            )
            .value(formatValue(report.p4));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p5 +
                String(index)
            )
            .value(formatValue(report.p5));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p6 +
                String(index)
            )
            .value(formatValue(report.p6));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p7 +
                String(index)
            )
            .value(formatValue(report.p7));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p8 +
                String(index)
            )
            .value(formatValue(report.p8));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p9 +
                String(index)
            )
            .value(formatValue(report.p9));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p10 +
                String(index)
            )
            .value(formatValue(report.p10));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p11 +
                String(index)
            )
            .value(formatValue(report.p11));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p12 +
                String(index)
            )
            .value(formatValue(report.p12));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p13 +
                String(index)
            )
            .value(formatValue(report.p13));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .ftesHiredToDate + String(index)
            )
            .value(formatValue(report.ftesHiredToDate));
          if (report.expenseItem !== "Change Management") {
            worksheet
              .cell(
                constants[initiative.toUpperCase() as Initiative]
                  .fyExpenseForecast + String(index)
              )
              .value(formatValue(report.fyExpenseForecast));
          }
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .ytdExpenseVarianceNote + String(index)
            )
            .value(formatValue(report.ytdExpenseVarianceNote));
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .fyExpenseVarianceNote + String(index)
            )
            .value(formatValue(report.fyExpenseVarianceNote));
          if (initiative === "pcn") {
            // Needs clarification on the following fields
            worksheet
              .cell(constants.PCN.notes + String(index))
              .value(formatValue(report.notes));
          } else {
            // Needs clarification on the following fields
            worksheet
              .cell(constants.CHC.additionalNotes + String(index))
              .value(formatValue(item.budget.notes));
          }
          index = index + 1;
        });
      }
    });
  },
};
