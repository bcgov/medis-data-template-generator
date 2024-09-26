import * as express from "express";
import * as controller from "./controller";

const router = express.Router();

router.get("/", controller.generateTemplate);
router.post("/", controller.generateTemplate);

export default router;
