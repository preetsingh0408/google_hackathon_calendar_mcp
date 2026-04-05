import { Hono } from "hono";
import { cors } from "hono/cors";
import { StreamableHTTPTransport } from "@hono/mcp";
import { serve } from "@hono/node-server";
import { createMcpServer } from "./mcp";
import { initDb } from "./db";

async function main() {
	await initDb();
	const app = new Hono();
	const port = Number.parseInt(process.env.PORT ?? "8787", 10);

	app.use(
		"/*",
		cors({
			origin: "*",
			allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
			allowHeaders: [
				"Content-Type",
				"mcp-session-id",
				"Last-Event-ID",
				"mcp-protocol-version",
			],
			exposeHeaders: ["mcp-session-id", "mcp-protocol-version"],
		}),
	);

	app.use("/*", async (c, next) => {
		await next();
		c.res.headers.delete("Transfer-Encoding");
		c.res.headers.set("X-Accel-Buffering", "no");
	});

	app.get("/health", (c) => c.json({ status: "ok" }));

	app.all("/mcp", async (context) => {
		const transport = new StreamableHTTPTransport({
			sessionIdGenerator: undefined,
		});
		const mcpServer = createMcpServer();
		await mcpServer.connect(transport);
		return transport.handleRequest(context);
	});

	serve({
		fetch: app.fetch,
		port,
		hostname: "0.0.0.0",
	});
	console.log(`✅ MCP server started on port ${port}`);
}

main().catch((error) => {
	console.error("Failed to start MCP server:", error);
	process.exit(1);
});
