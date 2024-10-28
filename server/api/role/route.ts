import express from "express";
import roleController from "./controller";

const router = express.Router();

router.get("/", roleController.getRLSRoleController);

export default router;
