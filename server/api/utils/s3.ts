import { GetObjectCommand } from "@aws-sdk/client-s3";
import client from "../components/minioService";
import minioClient from "../components/minioService";

export async function getTemplateAsBuffer(bucket: string, object: string) {
  const response = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: object })
  );

  return response.Body;
}
