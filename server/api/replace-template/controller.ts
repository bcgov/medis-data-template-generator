import { Request, Response } from "express";
import env from "../utils/env";
import { Readable } from "stream";
import client from "../components/minioService";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getLatestS3Object } from "../utils/helper";

export default {
  getLatestFinancialsTemplate: async (req: Request, res: Response) => {
    try {
      const role = res.locals.role;

      if (!role.role || role.role !== "admin") {
        return res.status(403).send("Forbidden");
      }

      const bucket = env.MINIO_BUCKET || "";

      const response = await client.send(
        new ListObjectsV2Command({ Bucket: bucket })
      );

      if (!response.Contents) {
        return res.status(200).send([]);
      }

      const latestFile = getLatestS3Object(response.Contents);

      return res.status(200).send(latestFile);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  getFinancialsTemplate: async (req: Request, res: Response) => {
    try {
      const role = res.locals.role;

      if (!role.role || role.role !== "admin") {
        return res.status(403).send("Forbidden");
      }

      const bucket = env.MINIO_BUCKET || "";

      const lresponse = await client.send(
        new ListObjectsV2Command({ Bucket: bucket })
      );

      if (!lresponse.Contents) {
        return res.status(200).send([]);
      }

      const latestFile = getLatestS3Object(lresponse.Contents);

      if (!latestFile) {
        return res.status(404).send("Template not found");
      }

      const response = await client.send(
        new GetObjectCommand({ Bucket: bucket, Key: latestFile.Key })
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

      const formData = req.file.buffer;
      const fileName = req.file.originalname;

      console.log("Template Name", req.file);

      const params: PutObjectCommandInput = {
        Bucket: bucket,
        Key: fileName,
        Body: formData,
        Metadata: {
          Type: "Financials Template",
        },
      };

      await client.send(new PutObjectCommand(params));
      res.status(200).send("File uploaded successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
};
