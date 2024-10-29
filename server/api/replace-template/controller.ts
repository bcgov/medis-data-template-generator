import { Request, Response } from "express";
import env from "../utils/env";
import { getTemplateAsBuffer } from "../utils/s3";
import client from "../components/minioService";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export default {
  getFinancialsTemplate: async (req: Request, res: Response) => {
    try {
      const role = res.locals.role;

      if (role.role !== "admin") {
        return res.status(403).send("Forbidden");
      }

      const bucket = env.MINIO_BUCKET || "";

      if (!env.TEMPLATE_ROUTE) {
        throw new Error("Template route not found");
      }

      const buffer = await getTemplateAsBuffer(bucket, env.TEMPLATE_ROUTE);

      if (!buffer) {
        throw new Error("Template not found");
      }

      // const readableStream
      const readableStream = await buffer.transformToByteArray();
      res.attachment("filled." + env.TEMPLATE_ROUTE);

      // Send the workbook.
      res.send(readableStream);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
  replaceFinancialsTemplate: async (req: Request, res: Response) => {
    try {
      const role = res.locals.role;

      if (role.role !== "admin") {
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
