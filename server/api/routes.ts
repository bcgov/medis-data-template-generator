import express from "express";
import generateTemplateRouter from "./generate-template/route";
import healthAuthorityRouter from "./health-authority/route";
import reportingPeriodRouter from "./reporting-periods/route";

const router = express.Router();

router.use("/generate-template", generateTemplateRouter);
router.use("/reporting-periods", reportingPeriodRouter);
router.use("/health-authority", healthAuthorityRouter);

router.get("/health-check", (req, res) => {
  res.json({
    message: "Healthy!",
  });
});

export default router;
