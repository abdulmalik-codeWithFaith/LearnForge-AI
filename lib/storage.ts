import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.B2_SECRET_ACCESS_KEY as string,
  },
});

const BUCKET = process.env.B2_BUCKET_NAME as string;

export async function uploadFile(
  key: string,
  body: Buffer,
  contentType: string
) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return key;
}

export async function getSignedFileUrl(key: string, expiresInSeconds = 3600) {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}