import XlsxPopulate from "xlsx-populate";

import constants from "../utils/constants";

import { Request, Response } from "express";

export async function generateTemplate(req: Request, res: Response, next: any) {
  // logs out data from the request
  console.log(req.body);

  /* generate workbook object from XLSX file */
  XlsxPopulate.fromFileAsync(
    __dirname + "/MOH.FinRptVarNotes.FreeForm.v3.r9.xlsm"
  )
    .then((workbook: any) => {
      for (let i = 0; i < 200; i++) {
        workbook
          .sheet(constants.CHC.sheetId)
          .cell("A" + (i + 3).toString())
          .value(0);
        workbook
          .sheet(constants.CHC.sheetId)
          .cell(constants.CHC.p1.concat((i + 3).toString()))
          .value(Math.floor(Math.random() * 10000));
        workbook
          .sheet(constants.CHC.sheetId)
          .cell(constants.CHC.p2.concat((i + 3).toString()))
          .value(Math.floor(Math.random() * 10000));
      }

      workbook.deleteSheet(2);
      workbook.deleteSheet(3);

      // // Make edits.
      // workbook
      //   .sheet(constants.CHC.sheetId)
      //   .cell(constants.CHC.p1.concat("3"))
      //   .value(12000);

      // Get the output
      return workbook.outputAsync();
    })
    .then((data: any) => {
      // Set the output file name.
      res.attachment("output.xlsm");

      // Send the workbook.
      res.send(data);
    })
    .catch((err: any) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
}
