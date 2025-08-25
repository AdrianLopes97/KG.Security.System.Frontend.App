import { z } from "zod";

const envSchema = z.object({
  VITE_PORT: z.coerce.number().default(3000),
  VITE_BASE_API_URL: z.url(),
});

export const env = envSchema.parse(import.meta.env);
