import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["local", "development", "production"]),
  PORT: z.string().transform((val: string) => {
    if (isNaN(Number(val))) {
      throw new Error("PORT is not a valid number string");
    }
    return Number(val);
  }),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  LOG_LEVEL: z.enum(["debug", "info", "error"]),
  JWT_ACCESS_SECRET: z.string().min(32).max(150),
  JWT_REFRESH_SECRET: z.string().min(32).max(150),
  ACCESS_TOKEN_TTL: z.string().transform((val: string) => {
    if (isNaN(Number(val))) {
      throw new Error("ACCESS_TOKEN_TTL is not a valid number string");
    }
    return Number(val);
  }),
  REFRESH_TOKEN_TTL: z.string().transform((val: string) => {
    if (isNaN(Number(val))) {
      throw new Error("REFRESH_TOKEN_TTL is not a valid number string");
    }
    return Number(val);
  }),
  APP_URL: z.url(),
  SMTP_HOST: z.string().min(2).max(50),
  SMTP_USER: z.string().min(2).max(50),
  SMTP_PASS: z.string().min(2).max(50),
});

export const validateEnvVars = () => {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    console.error(`Environment validation error: ${error}`);
    process.exit(1);
  }
};
