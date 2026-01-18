import { z } from "zod";

export const createExpenseSchema = z.object({
  body: z
    .object({
      amount: z.number().min(0).max(1_000_000_000),
      categoryId: z.number().min(1).max(1_000_000_000),
      note: z.string().max(80),
      expenseDate: z.iso.date(),
    })
    .strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const getExpensesSchema = z.object({
  body: z.undefined(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});
