import { Request, Response, NextFunction } from "express";
import { getRLSHealthAuthorityHierarchy } from "../components/rlsService";

export default {
  getRLSHealthAuthorityHierarchy: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await getRLSHealthAuthorityHierarchy();
      res.status(200).send(response);
    } catch (error) {
      console.error("Error fetching RLS Health Authority Hierarchy", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
