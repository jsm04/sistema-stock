// user.service.ts (ajuste)
import type { InferSelectModel } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import type { CreateUserInput, LoginInput } from '../validation/user.schema';
import { users, type DB } from '../persistence/database';

export function userService(db: DB) {
	async function hashPassword(password: string): Promise<string> {
		return Bun.password.hash(password);
	}

	async function verifyPassword(
		password: string,
		hash: string,
	): Promise<boolean> {
		return Bun.password.verify(password, hash);
	}

	async function createUser(input: CreateUserInput) {
		const passwordHash = await hashPassword(input.password);

		try {
			const result = await db
				.insert(users)
				.values({
					username: input.username,
					passwordHash,
					role: input.role ?? 'operador',
				})
				.returning();

			return result[0];
		} catch {
			throw new Error('Username already exists');
		}
	}

	async function login(input: LoginInput) {
		const user = await db
			.select()
			.from(users)
			.where(eq(users.username, input.username))
			.get();

		if (!user) throw new Error('Invalid credentials');

		const valid = await verifyPassword(input.password, user.passwordHash);
		if (!valid) throw new Error('Invalid credentials');

		return {
			id: user.id,
			username: user.username,
			role: user.role,
		};
	}

	return { createUser, login };
}
