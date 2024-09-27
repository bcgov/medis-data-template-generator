import XlsxPopulate from "xlsx-populate";

import constants from "../utils/constants";
import { FinancialSubmission } from "../../interfaces/FinancialSubmission";

import { Request, Response } from "express";
import ChefsService from "../components/chefsService";

export default {
  generateTemplate: async (req: Request, res: Response, next: any) => {
    // logs out data from the request
    console.log("Request Body ", req.body);
    // check if body satisfy the FinancialSubmission interface
    const data: FinancialSubmission = req.body;

    const budgetData =
      await ChefsService().getBudgetSubmissionForFiscalYear(data);

    const reportingData =
      await ChefsService().getReportingSubmissionsForFiscalYearAndPeriod(data);

    return res.status(500).send("Internal Server Error");

    /* generate workbook object from XLSX file */
    // XlsxPopulate.fromFileAsync(
    //   __dirname + process.env.TEMPLATE_ROUTE
    // )
    //   .then((workbook: any) => {
    //     for (let i = 0; i < 200; i++) {
    //       workbook
    //         .sheet(constants.CHC.sheetId)
    //         .cell("A" + (i + 3).toString())
    //         .value(0);
    //       workbook
    //         .sheet(constants.CHC.sheetId)
    //         .cell(constants.CHC.p1.concat((i + 3).toString()))
    //         .value(Math.floor(Math.random() * 10000));
    //       workbook
    //         .sheet(constants.CHC.sheetId)
    //         .cell(constants.CHC.p2.concat((i + 3).toString()))
    //         .value(Math.floor(Math.random() * 10000));
    //     }

    //     workbook.deleteSheet(2);
    //     workbook.deleteSheet(2);

    //     // // Make edits.
    //     // workbook
    //     //   .sheet(constants.CHC.sheetId)
    //     //   .cell(constants.CHC.p1.concat("3"))
    //     //   .value(12000);

    //     // Get the output
    //     return workbook.outputAsync();
    //   })
    //   .then((data: any) => {
    //     // Set the output file name.
    //     res.attachment("output.xlsm");

    //     // Send the workbook.
    //     res.send(data);
    //   })
    //   .catch((err: any) => {
    //     console.error(err);
    //     res.status(500).send("Internal Server Error");
    //   });
  },
  createMappings: async (req: Request, res: Response) => {
    try {
      console.log("Request Body ", req.body);
      // check if body satisfy the FinancialSubmission interface
      const data: FinancialSubmission = req.body;

      const budgetData =
        await ChefsService().getBudgetSubmissionForFiscalYear(data);

      const reportingData =
        await ChefsService().getReportingSubmissionsForFiscalYearAndPeriod(
          data
        );

      res.status(200).send({
        budgets: budgetData,
        reporting: reportingData,
      });
    } catch (error) {
      console.error("Error creating mappings", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
