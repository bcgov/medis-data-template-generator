import XlsxPopulate, { Workbook } from "xlsx-populate";

import constants from "../utils/constants";
import {
  FinancialSubmission,
  Initiative,
} from "../../interfaces/FinancialSubmission";

import { Request, Response } from "express";
import ChefsService from "../components/chefsService";
import mapping from "../utils/mapping";
import worksheetUtils from "../utils/worksheet";
import env from "../utils/env";

export default {
  generateTemplate: async (req: Request, res: Response, next: any) => {
    try {
      // logs out data from the request
      console.log("Request Body ", req.body);
      const data: FinancialSubmission = req.body;

      const budgetData =
        await ChefsService().getBudgetSubmissionForFiscalYear(data);

      const reportingData =
        await ChefsService().getReportingSubmissionsForFiscalYearAndPeriod(
          data
        );

      const budgetToFinancials = mapping.mapBudgetAndFinancialSubmissions(
        budgetData as any[],
        reportingData as any[],
        data.typeOfInitiative
      );

      const budgetsToFinancialItems = budgetToFinancials
        .map((budgetFin: any) => {
          if (budgetFin.reporting.length === 0) {
            return mapping.mapFinancialItems(
              budgetFin.budget,
              undefined,
              data.healthAuthority,
              data.typeOfInitiative,
              data.reportingPeriod
            );
          }

          return mapping.mapFinancialItems(
            budgetFin.budget,
            budgetFin.reporting[0],
            data.healthAuthority,
            data.typeOfInitiative,
            data.reportingPeriod
          );
        })
        .flat(1);

      console.log("Budgets to Financial Items ", budgetsToFinancialItems);

      /* generate workbook object from XLSX file */
      XlsxPopulate.fromFileAsync(__dirname + process.env.TEMPLATE_ROUTE)
        .then((workbook: Workbook) => {
          const worksheet = workbook.sheet(
            constants[data.typeOfInitiative.toUpperCase() as Initiative].sheetId
          );

          // Fill the data
          worksheetUtils.fillWorksheet(
            budgetsToFinancialItems,
            worksheet,
            data.typeOfInitiative
          );

          // Get the output
          return workbook.outputAsync();
        })
        .then((data: string | Uint8Array | ArrayBuffer | Blob | Buffer) => {
          // Set the output file name.
          res.attachment("filled." + env.TEMPLATE_ROUTE);

          // Send the workbook.
          res.send(data);
        })
        .catch((err: any) => {
          console.log(err);
          throw new Error("Error while creating spreadsheet");
        });
    } catch (e) {
      console.error(e);
      res.status(500).send("Internal Server Error");
    }
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

      const budgetToFinancials = mapping.mapBudgetAndFinancialSubmissions(
        budgetData as any[],
        reportingData as any[],
        data.typeOfInitiative
      );

      const budgetsToFinancialItems = budgetToFinancials
        .map((budgetFin: any) => {
          if (budgetFin.reporting.length === 0) {
            return [];
          }

          return mapping.mapFinancialItems(
            budgetFin.budget,
            budgetFin.reporting[0],
            data.healthAuthority,
            data.typeOfInitiative,
            data.reportingPeriod
          );
        })
        .flat(1);

      res.status(200).send(budgetsToFinancialItems);
    } catch (error) {
      console.error("Error creating mappings", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
