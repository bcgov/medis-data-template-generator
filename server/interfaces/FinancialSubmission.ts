export type PCNFinancialSubmission = {
  typeOfInitiative: "pcn";
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
