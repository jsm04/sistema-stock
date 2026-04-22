import { z } from 'zod';

/**
 * Crear usuario
 */
export const createUserSchema = z.object({
	username: z
		.string()
		.min(3)
		.max(50)
		.regex(/^[a-zA-Z0-9_]+$/),

	password: z.string().min(6).max(100),

	role: z.enum(['admin', 'operador']).optional().default('operador'),
});

/**
 * Login
 */
export const loginSchema = z.object({
	username: z.string(),
	password: z.string(),
});

/**
 * Tipos inferidos
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
