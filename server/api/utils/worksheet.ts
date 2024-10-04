import constants from "./constants";
import {
  Initiative,
  SubmissionInitiative,
} from "../../interfaces/FinancialSubmission";

export default {
  fillWorksheet: (
    budgetsToFinancialItems: any[],
    worksheet: any,
    initiative: SubmissionInitiative
  ) => {
    let index = 4;
    budgetsToFinancialItems.forEach((item: any) => {
      if (item.reporting.length === 0) {
        worksheet.cell("A" + String(index)).value(0);
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative].fiscalYear +
              String(index)
          )
          .value(item.submissionInformation.fiscalYear || null);
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative].communityName +
              String(index)
          )
          .value(item.submissionInformation.communityName || null);
        if (initiative === "upcc" || initiative === "chc") {
          worksheet
            .cell(
              (initiative === "upcc"
                ? constants.UPCC.upccName
                : initiative === "chc"
                  ? constants.CHC.chcName
                  : constants.NPPCC.nppccName) + String(index)
            )
            .value(item.submissionInformation.initiativeName || null);
        }
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative].periodReported +
              String(index)
          )
          .value(item.submissionInformation.periodReported || null);
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative].healthAuthority +
              String(index)
          )
          .value(item.submissionInformation.healthAuthority || null);
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative].expenseCategory +
              String(index)
          )
          .value(item.budget.expenseCategory || null);
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative]
              .expenseSubCategory + String(index)
          )
          .value(item.budget.expenseSubCategory || null);
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative].expenseItem +
              String(index)
          )
          .value(item.budget.expenseItem || null);
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative]
              .expenseItemSubType + String(index)
          )
          .value(item.budget.expenseItemSubType || null);
        if (initiative === "pcn") {
          worksheet
            .cell(constants.PCN.approved4YearFtEs + String(index))
            .value(item.budget.approved4YearFtEs || null);
          worksheet
            .cell(constants.PCN.annualBudget + String(index))
            .value(item.budget.annualBudget || null);
        } else {
          worksheet
            .cell(
              constants[initiative.toUpperCase() as "UPCC" | "CHC" | "NPPCC"]
                .approvedFtes + String(index)
            )
            .value(item.budget.approvedFtes || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as "UPCC" | "CHC" | "NPPCC"]
                .approvedBudget + String(index)
            )
            .value(item.budget.approvedBudget || null);
        }
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative]
              .approvedAttachmentTarget + String(index)
          )
          .value(item.budget.approvedAttachmentTarget || null);
        if (initiative === "pcn") {
          worksheet
            .cell(constants.PCN.fiscalYearAllocation + String(index))
            .value(item.budget.fiscalYearAllocation || null);
          worksheet
            .cell(constants.PCN.ftesInclRelief + String(index))
            .value(item.budget.ftesInclRelief || null);
          worksheet
            .cell(constants.PCN.totalBudgetAllocation + String(index))
            .value(item.budget.totalBudgetAllocation || null);
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
            .value(item.submissionInformation.fiscalYear || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].communityName +
                String(index)
            )
            .value(item.submissionInformation.communityName || null);
          if (initiative === "upcc" || initiative === "chc") {
            worksheet
              .cell(
                (initiative === "upcc"
                  ? constants.UPCC.upccName
                  : initiative === "chc"
                    ? constants.CHC.chcName
                    : constants.NPPCC.nppccName) + String(index)
              )
              .value(item.submissionInformation.initiativeName || null);
          }
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].periodReported +
                String(index)
            )
            .value(item.submissionInformation.periodReported || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .healthAuthority + String(index)
            )
            .value(item.submissionInformation.healthAuthority || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .expenseCategory + String(index)
            )
            .value(report.expenseCategory || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .expenseSubCategory + String(index)
            )
            .value(report.expenseSubCategory || null);
          if (initiative === "upcc") {
            worksheet
              .cell(
                constants[initiative.toUpperCase() as "UPCC"].typeOfCare +
                  String(index)
              )
              .value(report.typeOfCare || null);
          }
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].expenseItem +
                String(index)
            )
            .value(report.expenseItem || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .expenseItemSubType + String(index)
            )
            .value(report.expenseItemSubType || null);
          if (initiative === "pcn") {
            worksheet
              .cell(constants.PCN.approved4YearFtEs + String(index))
              .value(item.budget.approved4YearFtEs || null);
            worksheet
              .cell(constants.PCN.annualBudget + String(index))
              .value(item.budget.annualBudget || null);
          } else {
            worksheet
              .cell(
                constants[initiative.toUpperCase() as "UPCC" | "CHC" | "NPPCC"]
                  .approvedFtes + String(index)
              )
              .value(item.budget.approvedFtes || null);
            worksheet
              .cell(
                constants[initiative.toUpperCase() as "UPCC" | "CHC" | "NPPCC"]
                  .approvedBudget + String(index)
              )
              .value(item.budget.approvedBudget || null);
          }
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .approvedAttachmentTarget + String(index)
            )
            .value(item.budget.approvedAttachmentTarget || null);
          if (initiative === "pcn") {
            worksheet
              .cell(constants.PCN.fiscalYearAllocation + String(index))
              .value(item.budget.fiscalYearAllocation || null);
            worksheet
              .cell(constants.PCN.ftesInclRelief + String(index))
              .value(item.budget.ftesInclRelief || null);
            worksheet
              .cell(constants.PCN.totalBudgetAllocation + String(index))
              .value(item.budget.totalBudgetAllocation || null);

            // Needs clarification on the following fields
            worksheet
              .cell(constants.PCN.otherItems + String(index))
              .value(report.otherItems || null);
            worksheet
              .cell(constants.PCN.listOfRolesTitles + String(index))
              .value(report.listOfRolesTitles || null);
            worksheet
              .cell(constants.PCN.typesOfTraining + String(index))
              .value(report.typesOfTraining || null);
          }

          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p1 +
                String(index)
            )
            .value(report.p1 || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p2 +
                String(index)
            )
            .value(report.p2 || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p3 +
                String(index)
            )
            .value(report.p3 || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p4 +
                String(index)
            )
            .value(report.p4 || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p5 +
                String(index)
            )
            .value(report.p5 || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p6 +
                String(index)
            )
            .value(report.p6 || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p7 +
                String(index)
            )
            .value(report.p7 || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p8 +
                String(index)
            )
            .value(report.p8 || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p9 +
                String(index)
            )
            .value(report.p9 || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p10 +
                String(index)
            )
            .value(report.p10 || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p11 +
                String(index)
            )
            .value(report.p11 || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p12 +
                String(index)
            )
            .value(report.p12 || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].p13 +
                String(index)
            )
            .value(report.p13 || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .ftesHiredToDate + String(index)
            )
            .value(report.ftesHiredToDate || null);
          if (report.expenseItem !== "Change Management") {
            worksheet
              .cell(
                constants[initiative.toUpperCase() as Initiative]
                  .fyExpenseForecast + String(index)
              )
              .value(report.fyExpenseForecast || null);
          }
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .ytdExpenseVarianceNote + String(index)
            )
            .value(report.ytdExpenseVarianceNote || null);
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .fyExpenseVarianceNote + String(index)
            )
            .value(report.fyExpenseVarianceNote || null);
          if (initiative === "pcn") {
            // Needs clarification on the following fields
            worksheet
              .cell(constants.PCN.notes + String(index))
              .value(report.notes || null);
          } else {
            // Needs clarification on the following fields
            worksheet
              .cell(constants.CHC.additionalNotes + String(index))
              .value(item.budget.notes || null);
          }
          index = index + 1;
        });
      }
    });
  },
};
