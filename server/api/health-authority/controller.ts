import { Request, Response, NextFunction } from "express";
import { getRLSHealthAuthorityHierarchy } from "../components/rlsService";

export default {
  getRLSHealthAuthorityHierarchy: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const role = res.locals.role;
      if (!role) {
        return res.status(401).send("Unauthorized");
      }
      const response = await getRLSHealthAuthorityHierarchy(res.locals.context);
      res.status(200).send(response);
    } catch (error) {
      console.error("Error fetching RLS Health Authority Hierarchy", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
