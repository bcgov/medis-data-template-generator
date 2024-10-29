require("dotenv").config();

export default {
  CHEFS_FISCAL_YEAR_REPORTING_DATES_FORM_ID:
    process.env.CHEFS_FISCAL_YEAR_REPORTING_DATES_FORM_ID,
  CHEFS_FISCAL_YEAR_REPORTING_DATES_API_KEY:
    process.env.CHEFS_FISCAL_YEAR_REPORTING_DATES_API_KEY,
  CHEFS_PCN_BUDGET_FORM_ID: process.env.CHEFS_PCN_BUDGET_FORM_ID,
  CHEFS_PCN_BUDGET_API_KEY: process.env.CHEFS_PCN_BUDGET_API_KEY,
  CHEFS_CHC_BUDGET_FORM_ID: process.env.CHEFS_CHC_BUDGET_FORM_ID,
  CHEFS_CHC_BUDGET_API_KEY: process.env.CHEFS_CHC_BUDGET_API_KEY,
  CHEFS_UPCC_BUDGET_FORM_ID: process.env.CHEFS_UPCC_BUDGET_FORM_ID,
  CHEFS_UPCC_BUDGET_API_KEY: process.env.CHEFS_UPCC_BUDGET_API_KEY,
  CHEFS_NPPCC_BUDGET_FORM_ID: process.env.CHEFS_NPPCC_BUDGET_FORM_ID,
  CHEFS_NPPCC_BUDGET_API_KEY: process.env.CHEFS_NPPCC_BUDGET_API_KEY,
  CHEFS_PCN_FINANCIAL_FORM_ID: process.env.CHEFS_PCN_FINANCIAL_FORM_ID,
  CHEFS_PCN_FINANCIAL_API_KEY: process.env.CHEFS_PCN_FINANCIAL_API_KEY,
  CHEFS_CHC_FINANCIAL_FORM_ID: process.env.CHEFS_CHC_FINANCIAL_FORM_ID,
  CHEFS_CHC_FINANCIAL_API_KEY: process.env.CHEFS_CHC_FINANCIAL_API_KEY,
  CHEFS_UPCC_FINANCIAL_FORM_ID: process.env.CHEFS_UPCC_FINANCIAL_FORM_ID,
  CHEFS_UPCC_FINANCIAL_API_KEY: process.env.CHEFS_UPCC_FINANCIAL_API_KEY,
  CHEFS_NPPCC_FINANCIAL_FORM_ID: process.env.CHEFS_NPPCC_FINANCIAL_FORM_ID,
  CHEFS_NPPCC_FINANCIAL_API_KEY: process.env.CHEFS_NPPCC_FINANCIAL_API_KEY,
  CHEFS_API_URL: process.env.CHEFS_API_URL,
  PORT: process.env.PORT,
  ENVIRONMENT: process.env.ENVIRONMENT,
  TEMPLATE_ROUTE: process.env.TEMPLATE_ROUTE,
  JWKS_URI: process.env.JWKS_URI,
  RLS_API_URL: process.env.RLS_API_URL,
  RLS_HA_FORM_ID: process.env.RLS_HA_FORM_ID,
  RLS_ROLE_FORM_ID: process.env.RLS_ROLE_FORM_ID,
  RLS_API_KEY: process.env.RLS_API_KEY,
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  MINIO_BUCKET: process.env.MINIO_BUCKET,
  MINIO_REGION: process.env.MINIO_REGION,
};
