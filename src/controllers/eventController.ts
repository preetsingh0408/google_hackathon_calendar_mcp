import { getDb } from "../db";
import { Event } from "../models/event";

export function createEvent(event: Omit<Event, "id">): number {
	const db = getDb();
	const result = db
		.prepare(
			"INSERT INTO events (title, description, start, end) VALUES (?, ?, ?, ?)",
		)
		.run(event.title, event.description ?? "", event.start, event.end);
	return Number(result.lastInsertRowid ?? 0);
}
export function listEvents(limit?: number): Event[] {
	const db = getDb();
	if (limit) {
		return db
			.prepare("SELECT * FROM events ORDER BY start ASC LIMIT ?")
			.all(limit) as Event[];
	}
	return db
		.prepare("SELECT * FROM events ORDER BY start ASC")
		.all() as Event[];
}
export function deleteEvent(id: number): boolean {
	const db = getDb();
	const result = db.prepare("DELETE FROM events WHERE id = ?").run(id);
	return result.changes > 0;
}
export function updateEvent(event: Event): boolean {
	const db = getDb();
	const result = db
		.prepare(
			"UPDATE events SET title = ?, description = ?, start = ?, end = ? WHERE id = ?",
		)
		.run(
			event.title,
			event.description ?? "",
			event.start,
			event.end,
			event.id,
		);
	return result.changes > 0;
}
