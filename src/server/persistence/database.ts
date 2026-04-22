import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

const sqlite = new Database(process.env.DB_FILE_NAME!);
export const db = drizzle({ client: sqlite });
export type DB = typeof db;

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),

	username: text('username').notNull().unique(),

	passwordHash: text('password_hash').notNull(),

	role: text('role')
		.notNull()
		.$type<'admin' | 'operador'>()
		.default('operador'),

	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
});
