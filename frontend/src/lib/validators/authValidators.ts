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

export const registerSchema = z.object({
    empId: z.string().min(1, "Employee ID is required").regex(/^U\d{6}$/, "Employee ID must be in Uxxxxxx format (e.g., U123456)"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters long"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[0-9]/, "Password must contain a number")
        .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
    retypePassword: z.string().min(1, "Please retype your password"),
}).refine((data) => data.password === data.retypePassword, {
    message: "Passwords don't match",
    path: ["retypePassword"], // Set the error on the retypePassword field
});

export type RegisterFormData = z.infer<typeof registerSchema>;