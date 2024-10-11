import { Request, Response, NextFunction } from "express";
import { getRLSRole } from "../components/rlsService";

export default {
  getRLSRoleController: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await getRLSRole(res.locals.context);
      res.status(200).send(response);
    } catch (error) {
      console.error("Error fetching RLS Health Authority Hierarchy", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
