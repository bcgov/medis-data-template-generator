import XlsxPopulate, { Workbook } from "xlsx-populate";
import { FinancialSubmission } from "../../interfaces/FinancialSubmission";

import { Request, Response } from "express";
import ChefsService from "../components/chefsService";
import mapping from "../utils/mapping";
import worksheetUtils from "../utils/worksheet";
import env from "../utils/env";
import { getCurrentFiscalAndPeriod, getLatestS3Object } from "../utils/helper";
import { getTemplateAsBuffer } from "../utils/s3";
import client from "../components/minioService";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

export default {
  generateTemplate: async (req: Request, res: Response, next: any) => {
    try {
      // logs out data from the request
      const data: FinancialSubmission = req.body;

      const role = res.locals.role;

      const currentFiscalAndPeriod = await getCurrentFiscalAndPeriod();

      if (
        role.role !== "admin" &&
        (data.fiscalYear !== currentFiscalAndPeriod.fiscalYear ||
          Number(data.reportingPeriod.substring(1)) !==
            currentFiscalAndPeriod.period)
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

      const bucket = env.MINIO_BUCKET || "";
      const lresponse = await client.send(
        new ListObjectsV2Command({ Bucket: bucket })
      );

      if (!lresponse.Contents) {
        return res.status(200).send([]);
      }

      const latestFile = getLatestS3Object(lresponse.Contents);

      if (!latestFile || !latestFile.Key) {
        return res.status(404).send("Template not found");
      }

      const buffer = await getTemplateAsBuffer(bucket, latestFile.Key);

      if (!buffer) {
        throw new Error("Template not found");
      }

      // const readableStream
      const readableStream = await buffer.transformToByteArray();

      // console.log("buffer", readableStream);

      /* generate workbook object from XLSX file */
      XlsxPopulate.fromDataAsync(readableStream)
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
          res.attachment("filled." + latestFile.Key);

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

      if (
        role.role !== "admin" &&
        (data.fiscalYear !== currentFiscalAndPeriod.fiscalYear ||
          Number(data.reportingPeriod.substring(1)) !==
            currentFiscalAndPeriod.period)
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
