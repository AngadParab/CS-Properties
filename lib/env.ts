import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, "NEXT_PUBLIC_FIREBASE_API_KEY is required"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is required"),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, "NEXT_PUBLIC_FIREBASE_PROJECT_ID is required"),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is required"),
});

const serverSchema = clientSchema.extend({
  FIREBASE_WEBHOOK_SECRET: z.string().min(1, "FIREBASE_WEBHOOK_SECRET is required"),
});

const isServer = typeof window === 'undefined';
const schema = isServer ? serverSchema : clientSchema;

const envData = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  FIREBASE_WEBHOOK_SECRET: process.env.FIREBASE_WEBHOOK_SECRET,
};

const parsedEnv = schema.safeParse(envData);

if (!parsedEnv.success) {
  console.error("❌ Environment validation failed:", parsedEnv.error.format());
  throw new Error("Invalid environment variables configuration");
}

export const env = parsedEnv.data as z.infer<typeof serverSchema>;
