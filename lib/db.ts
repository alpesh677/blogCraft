import { neon } from "@neondatabase/serverless";

export default async function getDbConnetion() {
	if (!process.env.DATABASE_URL) {
		throw new Error("Neon DATABASE_URL is not set");
	}
	const sql =  neon(process.env.DATABASE_URL);
    return sql;
}
