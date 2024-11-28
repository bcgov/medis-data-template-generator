import constants from "./constants";
import {
  Initiative,
  SubmissionInitiative,
} from "../../interfaces/FinancialSubmission";

const formatValue = (value: any, trim?: boolean) => {
  return value === undefined || value === null
    ? null
    : trim
      ? String(value).trim()
      : value;
};

export default {
  fillWorksheet: (
    budgetsToFinancialItems: any[],
    worksheet: any,
    initiative: SubmissionInitiative
  ) => {
    let index = 1;
    budgetsToFinancialItems.forEach((item: any) => {
      if (
        item.reporting.length === 0 ||
        item.budget.expenseItem === "Change Management" ||
        item.budget.expenseSubCategory === "Overhead"
      ) {
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
        if (initiative !== "pcn") {
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
          .value(
            formatValue(item.budget.expenseSubCategory) === "Overhead"
              ? "Overhead Budget"
              : formatValue(item.budget.expenseSubCategory)
          );
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative].expenseItem +
              String(index)
          )
          .value(
            formatValue(item.budget.expenseItem) === "Change Management"
              ? "Chg Mgmt Budget"
              : formatValue(item.budget.expenseItem)
          );
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative]
              .expenseItemSubType + String(index)
          )
          .value(formatValue(item.budget.expenseItemSubType));
        if (initiative === "upcc") {
          worksheet
            .cell(
              constants[initiative.toUpperCase() as "UPCC"].typeOfCare +
                String(index)
            )
            .value(formatValue(item.budget.typeOfCare));
        }

        // PCN specific fields
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
            .value(
              formatValue(
                !!item.budget.fiscalYearAllocation
                  ? Number(item.budget.fiscalYearAllocation) / 100
                  : null
              )
            );
          worksheet
            .cell(constants.PCN.ftesInclRelief + String(index))
            .value(formatValue(item.budget.ftesInclRelief));
          worksheet
            .cell(constants.PCN.totalBudgetAllocation + String(index))
            .value(formatValue(item.budget.totalBudgetAllocation));
        }
        // if (initiative === "pcn") {
        if (!!item.submissionInformation.budgetLevel) {
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .fyExpenseForecast + String(index)
            )
            .value(
              formatValue(
                item.submissionInformation.budgetLevel.fyExpenseForecast
              )
            );
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .ytdExpenseVarianceNote + String(index)
            )
            .value(
              formatValue(
                item.submissionInformation.budgetLevel.ytdExpenseVarianceNote
              )
            );
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .fyExpenseVarianceNote + String(index)
            )
            .value(
              formatValue(
                item.submissionInformation.budgetLevel.fyExpenseVarianceNote
              )
            );
        }
        if (initiative === "pcn") {
          worksheet
            .cell(constants.PCN.notes + String(index))
            .value(formatValue(item.submissionInformation.notes));
        } else {
          worksheet
            .cell(
              // @ts-expect-error - TS doesn't know that initiative is a valid key for constants
              constants[initiative.toUpperCase()].additionalNotes +
                String(index)
            )
            .value(formatValue(item.submissionInformation.notes));
        }
        worksheet
          .cell(
            constants[initiative.toUpperCase() as Initiative]
              .reasonForExceptionInPeriodReported + String(index)
          )
          .value(
            formatValue(
              item.submissionInformation.reasonForExceptionInPeriodReported,
              true
            )
          );
        index = index + 1;
      }
      if (item.reporting.length > 0) {
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
          if (initiative !== "pcn") {
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
            .value(
              formatValue(report.expenseSubCategory) === "Overhead"
                ? "Overhead Expense"
                : formatValue(report.expenseSubCategory)
            );
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative].expenseItem +
                String(index)
            )
            .value(
              formatValue(report.expenseItem) === "Change Management"
                ? "Chg Mgmt Expense"
                : formatValue(report.expenseItem)
            );
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .expenseItemSubType + String(index)
            )
            .value(formatValue(report.expenseItemSubType));

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
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .fyExpenseForecast + String(index)
            )
            .value(formatValue(report.fyExpenseForecast));
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
            .value(
              formatValue(
                report.fyExpenseVarianceNote || report.fyExpenseVarianceNote
              )
            );
          worksheet
            .cell(
              constants[initiative.toUpperCase() as Initiative]
                .reasonForExceptionInPeriodReported + String(index)
            )
            .value(
              formatValue(
                item.submissionInformation.reasonForExceptionInPeriodReported
              )
            );

          if (initiative === "upcc") {
            worksheet
              .cell(
                constants[initiative.toUpperCase() as "UPCC"].typeOfCare +
                  String(index)
              )
              .value(formatValue(item.budget.typeOfCare));
          }

          // PCN specific fields
          if (
            formatValue(report.expenseSubCategory) !== "Overhead" &&
            formatValue(report.expenseItem) !== "Change Management"
          ) {
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
                  constants[
                    initiative.toUpperCase() as "UPCC" | "CHC" | "NPPCC"
                  ].approvedFtes + String(index)
                )
                .value(
                  formatValue(item.budget.approvedFtes) ||
                    formatValue(item.budget.approvedFtesInclRelief)
                );
              worksheet
                .cell(
                  constants[
                    initiative.toUpperCase() as "UPCC" | "CHC" | "NPPCC"
                  ].approvedBudget + String(index)
                )
                .value(formatValue(item.budget.approvedBudget));
            }
          }

          if (
            formatValue(report.expenseSubCategory) !== "Overhead" &&
            formatValue(report.expenseItem) !== "Change Management"
          ) {
            worksheet
              .cell(
                constants[initiative.toUpperCase() as Initiative]
                  .approvedAttachmentTarget + String(index)
              )
              .value(formatValue(item.budget.approvedAttachmentTarget));
          }

          if (initiative === "pcn") {
            if (
              formatValue(report.expenseSubCategory) !== "Overhead" &&
              formatValue(report.expenseItem) !== "Change Management"
            ) {
              worksheet
                .cell(constants.PCN.fiscalYearAllocation + String(index))
                .value(
                  formatValue(
                    !!item.budget.fiscalYearAllocation
                      ? Number(item.budget.fiscalYearAllocation) / 100
                      : null
                  )
                );
              worksheet
                .cell(constants.PCN.ftesInclRelief + String(index))
                .value(formatValue(item.budget.ftesInclRelief));
              worksheet
                .cell(constants.PCN.totalBudgetAllocation + String(index))
                .value(formatValue(item.budget.totalBudgetAllocation));
            }

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
          if (initiative === "pcn") {
            // Needs clarification on the following fields
            worksheet
              .cell(constants.PCN.notes + String(index))
              .value(formatValue(item.submissionInformation.notes));
          } else {
            // Needs clarification on the following fields
            worksheet
              .cell(
                // @ts-expect-error - TS doesn't know that initiative is a valid key for constants
                constants[initiative.toUpperCase()].additionalNotes +
                  String(index)
              )
              .value(formatValue(item.submissionInformation.notes));
          }
          index = index + 1;
        });
      }
    });
  },
};
