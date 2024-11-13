import { ReportingPeriods } from "./types";

export function getCurrentFiscalAndPeriod(periods: any[]) {
  const currentFiscal = getCurrentFiscalYear();
  const previousFiscal = getPreviousFiscalYear();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight to compare only dates

  const currentFiscalPeriods = periods
    .find(
      (fiscal: {
        fiscalYear: string;
        periodReportingDates: ReportingPeriods[];
      }) => fiscal.fiscalYear === currentFiscal
    )
    .periodReportingDates.filter(
      (period: ReportingPeriods) => period.period !== 14
    )
    .map((period: ReportingPeriods) => ({
      ...period,
      fiscalYear: currentFiscal,
    }));

  const previousFiscalPeriods = periods
    .find(
      (fiscal: {
        fiscalYear: string;
        periodReportingDates: ReportingPeriods[];
      }) => fiscal.fiscalYear === previousFiscal
    )
    .periodReportingDates.filter(
      (period: ReportingPeriods) => period.period !== 14
    )
    .map((period: ReportingPeriods) => ({
      ...period,
      fiscalYear: previousFiscal,
    }));

  const allPeriods = [...previousFiscalPeriods, ...currentFiscalPeriods];
  // in the case that nothing matches, default to the last period
  let validationPeriod = 13;
  let validationFiscalYear = currentFiscal;

  allPeriods.forEach((period, index) => {
    let start = new Date(period.startDate);

    if (index > 0) {
      start = new Date(allPeriods[index - 1].submissionDueDate);
    }
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    let end = new Date(period.submissionDueDate);
    end.setDate(end.getDate());
    end.setHours(23, 59, 59, 999);
    if (today >= start && today <= end) {
      validationFiscalYear = period.fiscalYear;
      validationPeriod = period.period;
    }
  });

  if (!validationPeriod || !validationFiscalYear) {
    throw new Error("No period found");
  }

  return {
    fiscalYear: validationFiscalYear,
    period: validationPeriod,
  };
}

function getCurrentFiscalYear() {
  /*
    This function works as per MoH fiscal year. You can change it according to your need. 
    You only need to modify the conditional statement. 
    i.e, if (curMonth > 3) where April(3) is the starting month of fiscal year.
    getMonth() returns number of the month in a date value starting from 0 to 11*/

  //get current date
  var today = new Date();
  //get current month
  var curMonth = today.getMonth();
  var fiscalYr = "";
  if (curMonth >= 3) {
    //
    var nextYr1 = (today.getFullYear() + 1).toString();
    fiscalYr =
      today.getFullYear().toString() +
      "/" +
      nextYr1.charAt(2) +
      nextYr1.charAt(3);
  } else {
    var nextYr2 = today.getFullYear().toString();
    fiscalYr =
      (today.getFullYear() - 1).toString() +
      "/" +
      nextYr2.charAt(2) +
      nextYr2.charAt(3);
  }
  return fiscalYr;
}

function getPreviousFiscalYear() {
  const currentFiscalYear = getCurrentFiscalYear();
  const year1 = Number(currentFiscalYear.substring(0, 4));
  const year2 = Number(
    currentFiscalYear.substring(0, 2) + currentFiscalYear.substring(5, 7)
  );

  const prevYear1 = String(year1 - 1);
  const prevYear2 = String(year2 - 1);

  return `${prevYear1}/${prevYear2.substring(2, 4)}`;
}
