import { z } from "zod";

export const signupSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(50),
      email: z.email().max(50),
      password: z.string().min(4, "Password must be at least 4 characters long").max(50),
      currency: z.string().length(3),
    })
    .strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z.email().max(50),
      password: z.string().min(4, "Password must be at least 4 characters long").max(50),
    })
    .strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const refreshSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().min(10).max(150),
    })
    .strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const logoutSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().min(10).max(150),
      devices: z.enum(["current", "all"]),
    })
    .strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const forgotPasswordSchema = z.object({
  body: z
    .object({
      email: z.email().max(50),
    })
    .strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});
export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string().min(10).max(64),
      password: z.string().min(4, "Password must be at least 4 characters long").max(50),
    })
    .strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});
