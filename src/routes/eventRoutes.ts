import { z } from "zod";
import {
	createEvent,
	listEvents,
	deleteEvent,
	updateEvent,
} from "../controllers/eventController";
import { Event } from "../models/event";

const baseEventSchema = z.object({
	title: z.string().trim().min(1),
	description: z.string().trim().optional(),
	start: z
		.string()
		.datetime({ offset: true })
		.describe("ISO 8601 start datetime, for example 2025-01-15T09:00:00Z"),
	end: z
		.string()
		.datetime({ offset: true })
		.describe("ISO 8601 end datetime, for example 2025-01-15T10:00:00Z"),
});
const validateEventRange = <T extends { start: string; end: string }>(event: T) =>
	new Date(event.end).getTime() > new Date(event.start).getTime();
export const eventSchema = baseEventSchema.refine(validateEventRange, {
	message: "end must be after start",
	path: ["end"],
});
export const eventWithIdSchema = baseEventSchema
	.extend({ id: z.string().min(1) })
	.refine(validateEventRange, {
		message: "end must be after start",
		path: ["end"],
	});
export function registerEventTools(mcpServer: any) {
	mcpServer.registerTool(
		"create_event",
		{
			description: "Create a new calendar event.",
			inputSchema: eventSchema,
		},
		async (args: Event) => {
			const id = await createEvent(args);
			return {
				content: [
					{ type: "text", text: JSON.stringify({ id, ...args }) },
				],
			};
		},
	);
	mcpServer.registerTool(
		"list_events",
		{
			description: "List all calendar events.",
			inputSchema: z.object({ limit: z.number().int().positive().optional() }),
		},
		async ({ limit }: { limit?: number }) => {
			const events = await listEvents(limit);
			return {
				content: [{ type: "text", text: JSON.stringify(events) }],
			};
		},
	);
	mcpServer.registerTool(
		"delete_event",
		{
			description: "Delete a calendar event by id.",
			inputSchema: z.object({ id: z.string().min(1) })
		},
		async ({ id }: { id: string }) => {
			const deleted = await deleteEvent(id);
			return {
				content: [{ type: "text", text: JSON.stringify({ deleted }) }],
			};
		},
	);
	mcpServer.registerTool(
		"update_event",
		{
			description: "Update a calendar event by id.",
			inputSchema: eventWithIdSchema,
		},
		async ({ id, title, description, start, end }: Event) => {
			const updated = await updateEvent({
				id,
				title,
				description,
				start,
				end,
			});
			return {
				content: [{ type: "text", text: JSON.stringify({ updated }) }],
			};
		},
	);
}
