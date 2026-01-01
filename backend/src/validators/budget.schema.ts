import { z } from "zod";

export const budgetSchema = z.object({
  body: z
    .object({
      monthlyLimit: z.number().min(1).max(1_000_000_000),
      month: z.number().min(0).max(11),
      year: z.number().min(2026).max(2050),
    })
    .strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});
