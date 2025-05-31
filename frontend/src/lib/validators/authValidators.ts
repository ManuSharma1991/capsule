// src/lib/validators/authValidators.ts
import { z } from 'zod';

export const loginSchema = z.object({
    empId: z
        .string()
        .min(1, { message: 'Employee ID is required' })
        .regex(/^U\d{6}$/, {
            message: 'Employee ID must be in the format U123456 (U followed by 6 digits)',
        }),
    password: z
        .string()
        .min(1, { message: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' }), // Example minimum length
});

export type LoginFormData = z.infer<typeof loginSchema>;