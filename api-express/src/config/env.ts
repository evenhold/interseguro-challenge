import { z } from "zod";

try {
  process.loadEnvFile();
} catch {
  // .env is optional — in Docker env vars come from env_file or environment
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);
