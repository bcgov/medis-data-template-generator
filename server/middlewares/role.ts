import { NextFunction, Request, Response } from "express";
import { getRLSRole } from "../api/components/rlsService";

export async function roleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const role = await getRLSRole(res.locals.context);
    if (role.length === 0) {
      return res.status(401).send("Unauthorized");
    }
    res.locals.role = role[0];
  } catch (error) {
    console.error("Error fetching RLS Role", error);
    return res.status(500).send("Internal Server Error");
  }

  next();
}
