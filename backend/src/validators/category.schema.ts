import { z } from "zod";

export const createCategorySchema = z.object({
  body: z
    .object({
      name: z.string().min(1).max(30),
      icon: z.string().min(1).max(20),
    })
    .strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const getCategoriesSchema = z.object({
  body: z.undefined(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});
