import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";

export function getDb(databaseUrl: string) {
  const sql = neon(databaseUrl);
  return drizzle(sql);
}

