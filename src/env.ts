import 'dotenv/config';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    PORT: z.string(),
    SENDGRID_API_KEY: z.string(),

    RAZORPAY_KEY: z.string(),
    RAZORPAY_SECRET: z.string(),

    DEVELOPMENT: z.string(),

    S3_BUCKET: z.string(),
    REGION: z.string(),
    AWS_ACCESS_KEY: z.string(),
    AWS_SECRET_KEY: z.string(),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
