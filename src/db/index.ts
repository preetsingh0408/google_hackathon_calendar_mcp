import { Database } from "bun:sqlite";
import type { Database as DatabaseType } from "bun:sqlite";
let db: DatabaseType;

export function initDb() {
	db = new Database("calendar.db");

	db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      start DATETIME NOT NULL,
      end DATETIME NOT NULL
    )
  `);

	return db;
}

export function getDb() {
	if (!db) throw new Error("DB not initialized. Call initDb() first.");
	return db;
}
