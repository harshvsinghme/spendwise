import { z } from "zod";

export const createBudgetSchema = z.object({
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

export const deleteBudgetSchema = z.object({
  body: z.undefined(),
  query: z.object({}).strict(),
  params: z
    .object({
      id: z.string().transform((val: string, ctx) => {
        if (isNaN(Number(val)) || Number(val) <= 0) {
          ctx.addIssue({
            code: "custom",
            message: `id is not a valid number string`,
          });
          return z.NEVER;
        }
        return Number(val);
      }),
    })
    .strict(),
});
