import * as express from "express";
import controller from "./controller";

const router = express.Router();

router.get("/", controller.generateTemplate);
router.post("/", controller.generateTemplate);
router.post("/create-mappings", controller.createMappings);

export default router;
