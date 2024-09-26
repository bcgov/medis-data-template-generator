import express from "express";
import healthAuthorityController from "./controller";

const router = express.Router();

router.get("/", healthAuthorityController.getRLSHealthAuthorityHierarchy);

export default router;
