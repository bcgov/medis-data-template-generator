export default function ChefsService() {
  const SERVICE = "CHEFS";
  const apiUrl = process.env.CHEFS_API_URL;
  const credentials = {
    fiscalYearReportingDatesFormId:
      process.env.CHEFS_FISCAL_YEAR_REPORTING_DATES_FORM_ID,
    fiscalYearReportingDatesApiKey:
      process.env.CHEFS_FISCAL_YEAR_REPORTING_DATES_API_KEY,
  };

  const getReportingPeriod = async () => {
    try {
      const fields = "fiscalYear,periodReportingDates";
      const url = `${apiUrl}/forms/${credentials.fiscalYearReportingDatesFormId}/submissions?deleted=false&draft=false&fields=${fields}`;
      const response = await fetch(url, {
        headers: {
          Authorization:
            "Basic " +
            btoa(
              credentials.fiscalYearReportingDatesFormId +
                ":" +
                credentials.fiscalYearReportingDatesApiKey
            ),
        },
      }).then((res) => res.json());

      return response;
    } catch (error) {
      console.error("Error fetching reporting period", error);
      throw new Error("Error fetching reporting period");
    }
  };

  return {
    getReportingPeriod,
  };
}
