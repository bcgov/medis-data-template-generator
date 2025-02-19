export type InitiativeTypes = "pcn" | "upcc" | "fnpcc" | "nppcc" | "chc" | null;

export type ReportingPeriods = {
  endDate: string;
  period: number;
  startDate: string;
  submissionDueDate: string;
  validationDueDate: string;
};

export type PCNFinancialSubmission = {
  typeOfInitiative: string;
  reportingPeriod: string;
  healthAuthority: string;
  communitiesNames: string[];
  fiscalYear: string;
};

export type OtherFinancialSubmission = {
  typeOfInitiative: string;
  reportingPeriod: string;
  healthAuthority: string;
  communitiesNames: string[];
  initiativeNames: string[];
  fiscalYear: string;
};

export type FinancialSubmission =
  | PCNFinancialSubmission
  | OtherFinancialSubmission;

export const haMapping = {
  Fraser: "FHA",
  Interior: "IHA",
  "Vancouver Island": "VIHA",
  Northern: "NHA",
  "Vancouver Coastal": "VCHA",
  "Nisga'a Valley": "NVHA",
  NotAvailable: "N-A",
};

export type HA = keyof typeof haMapping;
