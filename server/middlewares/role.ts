import { NextFunction, Request, Response } from "express";
import { getRLSRole } from "../api/components/rlsService";

export async function roleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const role = await getRLSRole(res.locals.context);
  if (role.length === 0) {
    next(new Error("User does not have a role"));
  }
  res.locals.role = role[0];
  next();
}
