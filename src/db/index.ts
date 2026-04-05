import { Firestore } from "@google-cloud/firestore";

const projectId = "inlaid-span-491507-b6";

let firestore: Firestore;

export function getFirestore() {
	if (!firestore) {
		firestore = new Firestore({
			projectId,
		});
		console.log("✅ Firestore client initialized");
	}
	return firestore;
}

export const eventsCollection = getFirestore().collection("events");

export async function initDb() {
	// Firestore doesn't need explicit DB creation
	console.log("✅ Firestore ready (no init required)");
}