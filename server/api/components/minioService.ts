import env from "../utils/env";
import { S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
  endpoint: env.MINIO_ENDPOINT,
  region: env.MINIO_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.MINIO_ACCESS_KEY as string,
    secretAccessKey: env.MINIO_SECRET_KEY as string,
  },
  retryMode: "standard",
  maxAttempts: 3,
});

export default client;
