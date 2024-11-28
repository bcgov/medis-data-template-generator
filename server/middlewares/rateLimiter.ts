import rateLimit from "express-rate-limit";
import env from "../api/utils/env";

const limiter = rateLimit({
  windowMs: Number(env.LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  limit: Number(env.LIMIT) || 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

export default limiter;
