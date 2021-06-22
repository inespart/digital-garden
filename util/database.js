import camelcaseKeys from 'camelcase-keys';
import dotenvSafe from 'dotenv-safe';
import postgres from 'postgres';

// Read the PostgreSQL secret connection information
// (host, database, username, password) from the .env file
dotenvSafe.config();

// Connect to PostgreSQL
const sql = postgres();

// Perform a first query
export async function getSeeds() {
  const seeds = await sql`SELECT * FROM seeds`;
  return seeds.map((seed) => camelcaseKeys(seed));
}
