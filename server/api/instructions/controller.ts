import { Request, Response, NextFunction } from "express";
import chefsService from "../components/chefsService";

export default {
  getRLSInstructions: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const role = res.locals.role;
      if (!role) {
        return res.status(401).send("Unauthorized");
      }
      // const response = await getInstructions();
      const response = await chefsService().getInstructions();
      res.status(200).send(response);
    } catch (error) {
      console.error("Error fetching Instructions", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
