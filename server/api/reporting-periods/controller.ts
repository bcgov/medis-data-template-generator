import { Request, Response } from "express";
import ChefsService from "../components/chefsService";

export default {
  getReportingPeriods: async (req: Request, res: Response) => {
    try {
      const role = res.locals.role;
      if (!role) {
        return res.status(401).send("Unauthorized");
      }
      const response = await ChefsService().getReportingPeriod();
      res.status(200).send(response);
    } catch (error) {
      console.error("Error fetching Reporting Periods", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
