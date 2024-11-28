import express from "express";
import generateTemplateRouter from "./generate-template/route";
import healthAuthorityRouter from "./health-authority/route";
import reportingPeriodRouter from "./reporting-periods/route";
import replaceTemplateRouter from "./replace-template/route";
import roleRouter from "./role/route";

const router = express.Router();

router.use("/generate-template", generateTemplateRouter);
router.use("/reporting-periods", reportingPeriodRouter);
router.use("/health-authority", healthAuthorityRouter);
router.use("/replace-template", replaceTemplateRouter);
router.use("/role", roleRouter);

export default router;
