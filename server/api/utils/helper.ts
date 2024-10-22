import { ReportingPeriods } from "../../interfaces/ReportingPeriods";
import ChefsService from "../components/chefsService";

export async function getCurrentFiscalAndPeriod() {
  const currentFiscal =
    new Date().getFullYear().toString() +
    "/" +
    (new Date().getFullYear() + 1).toString().substring(2, 4);

  const periods = await ChefsService().getReportingPeriod();
  const today = new Date();

  const currentPeriod = periods
    .find(
      (fiscal: {
        fiscalYear: string;
        periodReportingDates: ReportingPeriods[];
      }) => fiscal.fiscalYear === currentFiscal
    )
    .periodReportingDates.find(
      (period: ReportingPeriods) =>
        today >= new Date(period.startDate) &&
        today <= new Date(period.submissionDueDate) &&
        period.period !== 14
    ).period;

  if (!currentPeriod) {
    throw new Error("No period found");
  }

  return {
    fiscalYear: currentFiscal,
    period: currentPeriod,
  };
}
