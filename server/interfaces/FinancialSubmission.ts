export type PCNFinancialSubmission = {
  typeOfInitiative: "pcn";
  reportingPeriod: string;
  healthAuthority: string;
  communitiesNames: string[];
  fiscalYear: string;
};

export type OtherFinancialSubmission = {
  typeOfInitiative: "chc" | "upcc" | "nppcc";
  reportingPeriod: string;
  healthAuthority: string;
  communitiesNames: string[];
  initiativeNames: string[];
  fiscalYear: string;
};

export type Initiative = "PCN" | "CHC" | "UPCC" | "NPPCC";

export type SubmissionInitiative = "pcn" | "chc" | "upcc" | "nppcc";

export type FinancialSubmission =
  | PCNFinancialSubmission
  | OtherFinancialSubmission;
