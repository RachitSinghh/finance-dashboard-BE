import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["Viewer", "Analyst", "Admin"]).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const recordSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    type: z.enum(["income", "expense"]),
    category: z.string().min(1),
    date: z.string().optional().or(z.date().optional()),
    description: z.string().optional(),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    userId: z.string(),
    role: z.enum(["Viewer", "Analyst", "Admin"]),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    userId: z.string(),
    status: z.enum(["active", "inactive"]),
  }),
});
