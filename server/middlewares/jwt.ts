import { NextFunction, Request, Response } from "express";
import * as jose from "jose";
import env from "../api/utils/env";

const jwksUri = env.JWKS_URI || "";

const JWKS = jose.createRemoteJWKSet(new URL(jwksUri));

export function getBearerTokenFromHeader(authorization: string): string | null {
  const [, token] = authorization.split("Bearer ");
  return token || null;
}

export async function verifyToken(token: string): Promise<jose.JWTPayload> {
  const { payload } = await jose.jwtVerify(token, JWKS, {});
  return payload;
}

export async function protectMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;
  if (!authorization) {
    console.log("No authorization header");
    return res.status(401).send("Unauthorized");
  }

  const token = getBearerTokenFromHeader(authorization);
  if (!token) {
    console.log("No token found");
    return res.status(401).send("Unauthorized");
  }

  try {
    const payload = await verifyToken(token);
    if (!payload) {
      console.log("Invalid token");
      return res.status(401).send("Unauthorized");
    }

    res.locals.context = payload;
    next();
  } catch (error) {
    if (
      String(error).includes("JWTExpired") ||
      String(error).includes("JWSInvalid")
    ) {
      console.log("Token expired");
      return res.status(401).send("Token expired");
    }
    console.error("Error verifying token:", error);
    next(error);
  }
}
