import express from "express";
import instructionController from "./controller";

const router = express.Router();

router.get("/", instructionController.getRLSInstructions);

export default router;
