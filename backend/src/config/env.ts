import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["local", "test", "staging", "production"]),
  PORT: z.string().transform((val: string) => {
    if (isNaN(Number(val))) {
      throw new Error("PORT is not a valid number string");
    }
    return Number(val);
  }),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  LOG_LEVEL: z.enum(["debug", "info", "error"]),
});

export const validateEnvVars = () => {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    console.error(`Environment validation error: ${error}`);
    process.exit(1);
  }
};
