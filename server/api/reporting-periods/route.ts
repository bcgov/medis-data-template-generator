import express from "express";
import reportingPeriodController from "./controller";

const router = express.Router();

router.get("/", reportingPeriodController.getReportingPeriods);

export default router;
