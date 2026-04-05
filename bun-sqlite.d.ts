declare module "bun:sqlite" {
	export class Database {
		constructor(filename: string);
		exec(sql: string): void;
		prepare(sql: string): any;
		// Add more methods as needed for your usage
	}
}
