import * as express from "express";
import controller from "./controller";
import multer from "multer";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

router.get("/financial/latest", controller.getLatestFinancialsTemplate);
router.get("/financial", controller.getFinancialsTemplate);
router.post(
  "/financial",
  upload.single("file"),
  controller.replaceFinancialsTemplate
);

export default router;
