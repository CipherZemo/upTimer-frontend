import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const checkSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  url: z.string().url('Please enter a valid URL'),
  interval: z.number().min(1).max(60),
  timeout: z.number().min(5).max(60).optional(),
  expectedStatusCode: z.number().min(100).max(599).optional(),
  tags: z.array(z.string()).optional(),
  webhookUrl: z.string().url('Invalid webhook URL').optional().or(z.literal('')),
  webhookEnabled: z.boolean().optional(),
});