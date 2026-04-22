import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from "../server/persistence/database";

/**
 * Crea una DB aislada en memoria para cada test suite
 */
export function createTestDB() {
	const sqlite = new Database(':memory:');
	const db = drizzle(sqlite, { schema });

	// crear tablas manualmente (sin migraciones)
	sqlite.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'operador',
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);

	return { db, sqlite };
}
