export type InitiativeTypes = "pcn" | "upcc" | "fnpcc" | "nppcc" | "chc" | null;

export type ReportingPeriods = {
  endDate: string;
  period: number;
  startDate: string;
  submissionDueDate: string;
  validationDueDate: string;
};
