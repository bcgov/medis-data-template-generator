import { Request, Response } from "express";
import env from "../utils/env";
import { Readable } from "stream";
import client from "../components/minioService";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export default {
  getFinancialsTemplate: async (req: Request, res: Response) => {
    try {
      const role = res.locals.role;

      if (!role.role || role.role !== "admin") {
        return res.status(403).send("Forbidden");
      }

      const bucket = env.MINIO_BUCKET || "";

      if (!env.TEMPLATE_ROUTE) {
        throw new Error("Template route not found");
      }

      const response = await client.send(
        new GetObjectCommand({ Bucket: bucket, Key: env.TEMPLATE_ROUTE })
      );

      if (!response.Body) {
        throw new Error("Template not found");
      }

      (response.Body as Readable).pipe(res);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
  replaceFinancialsTemplate: async (req: Request, res: Response) => {
    try {
      const role = res.locals.role;

      if (!role.role || role.role !== "admin") {
        return res.status(403).send("Forbidden");
      }

      if (!req.file) {
        return res.status(400).send("No files were uploaded.");
      }

      const bucket = env.MINIO_BUCKET || "";
      const templateName = env.TEMPLATE_ROUTE || "";

      const formData = req.file.buffer;

      const params = {
        Bucket: bucket,
        Key: templateName,
        Body: formData,
      };

      await client.send(new PutObjectCommand(params));
      res.status(200).send("File uploaded successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
};
