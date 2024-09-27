import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import * as middlewares from "./middlewares/common";
import router from "./api/routes";

require("dotenv").config();

const corsOptions = {
  origin:
    process.env.ORIGIN_URL ||
    process.env.OPENSHIFT_NODEJS_ORIGIN_URL ||
    "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

const staticFilesPath = process.env.FRONTEND_PATH || "/app";

const app = express();

app.use(
  morgan(
    "[:date] :method :url :status :res[content-length] - :remote-addr - :response-time ms"
  )
);
app.set("trust proxy", "loopback, linklocal, uniquelocal");
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", router);

app.use((req, res) => {
  if (req.originalUrl.startsWith(`${process.env.API_BASEPATH}/api`)) {
    // Return a 404 problem if attempting to access API
    return res.status(404).json({
      type: "https://httpstatuses.com/404",
      title: "Not Found",
      status: 404,
      detail: "Resource not found",
    });
  } else {
    // Redirect any non-API requests to static frontend with redirect breadcrumb
    const query = new URLSearchParams({ ...req.query, r: req.path });
    res.redirect(`${staticFilesPath}/?${query}`);
  }
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
