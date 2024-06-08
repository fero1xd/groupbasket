import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../env';
import { createId } from '@paralleldrive/cuid2';

const client = new S3Client({
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
  region: env.REGION,
});

export const getPresignedUrl = async (ext: string) => {
  const id = createId();
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: `${id}.${ext}`,
    ContentType: 'image/' + ext,
  });

  return {
    url: await getSignedUrl(client, command, { expiresIn: 3600 }),
    key: `${id}.${ext}`,
  };
};
