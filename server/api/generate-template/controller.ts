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
import { getCurrentFiscalAndPeriod } from "../utils/helper";

export default {
  generateTemplate: async (req: Request, res: Response, next: any) => {
    try {
      // logs out data from the request
      const data: FinancialSubmission = req.body;

      const role = res.locals.role;

      const currentFiscalAndPeriod = await getCurrentFiscalAndPeriod();

      // console.log("current fiscal", currentFiscalAndPeriod);
      console.log("role", role);

      if (
        role.role !== "admin" &&
        (data.fiscalYear !== currentFiscalAndPeriod.fiscalYear ||
          data.reportingPeriod !== currentFiscalAndPeriod.period)
      ) {
        return res.status(403).send("Forbidden");
      }

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

      /* generate workbook object from XLSX file */
      XlsxPopulate.fromFileAsync(__dirname + process.env.TEMPLATE_ROUTE)
        .then((workbook: Workbook) => {
          const worksheet = workbook.sheet(
            `${data.typeOfInitiative.toUpperCase()}`
          );

          worksheet.hidden(false);

          workbook
            .sheet(`${data.typeOfInitiative.toUpperCase()} Expenses`)
            .hidden(false);
          workbook
            .sheet(`${data.typeOfInitiative.toUpperCase()} Hierarchy`)
            .hidden(false);

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
      // check if body satisfy the FinancialSubmission interface
      const data: FinancialSubmission = req.body;

      const role = res.locals.role;

      const currentFiscalAndPeriod = await getCurrentFiscalAndPeriod();

      // console.log("current fiscal", currentFiscalAndPeriod);
      console.log("role", role);

      if (
        role.role !== "admin" &&
        (data.fiscalYear !== currentFiscalAndPeriod.fiscalYear ||
          (data.fiscalYear === currentFiscalAndPeriod.fiscalYear &&
            data.reportingPeriod !== currentFiscalAndPeriod.period))
      ) {
        return res.status(403).send("Forbidden");
      }

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
          return mapping.mapFinancialItems(
            budgetFin.budget,
            budgetFin.reporting[0],
            data.healthAuthority,
            data.typeOfInitiative,
            data.reportingPeriod
          );
        })
        .flat(1);

      res
        .status(200)
        .send({ step1: budgetToFinancials, step2: budgetsToFinancialItems });
    } catch (error) {
      console.error("Error creating mappings", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
