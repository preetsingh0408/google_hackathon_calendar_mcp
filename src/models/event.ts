export interface Event {
	id?: number;
	title: string;
	description?: string;
	start: string; // ISO string
	end: string; // ISO string
}
