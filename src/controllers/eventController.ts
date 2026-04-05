import { randomUUID } from "crypto";
import { eventsCollection } from "../db";
import { Event } from "../models/event";

function normalizeEvent(id: string, data: Record<string, any>): Event {
	return {
		id,
		title: data.title,
		description: data.description ?? "",
		start: data.start,
		end: data.end,
		created_at: data.created_at,
		updated_at: data.updated_at,
	};
}

export async function createEvent(event: Omit<Event, "id">): Promise<string> {
	const id = randomUUID();

	await eventsCollection.doc(id).set({
		title: event.title,
		description: event.description ?? "",
		start: event.start,
		end: event.end,
		created_at: new Date().toISOString(),
	});

	return id;
}

export async function listEvents(limit?: number): Promise<Event[]> {
	let query: FirebaseFirestore.Query = eventsCollection.orderBy("start", "asc");

	if (limit) {
		query = query.limit(limit);
	}

	const snapshot = await query.get();
	return snapshot.docs.map((doc) => normalizeEvent(doc.id, doc.data()));
}

export async function deleteEvent(id: string): Promise<boolean> {
	const docRef = eventsCollection.doc(id);
	const doc = await docRef.get();

	if (!doc.exists) return false;

	await docRef.delete();
	return true;
}

export async function updateEvent(event: Event): Promise<boolean> {
	if (!event.id) {
		throw new Error("id is required for update");
	}

	const docRef = eventsCollection.doc(event.id);
	const doc = await docRef.get();

	if (!doc.exists) return false;

	await docRef.update({
		title: event.title,
		description: event.description ?? "",
		start: event.start,
		end: event.end,
		updated_at: new Date().toISOString(),
	});

	return true;
}