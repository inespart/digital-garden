import camelcaseKeys from 'camelcase-keys';
import dotenvSafe from 'dotenv-safe';
import postgres from 'postgres';
// import setPostgresDefaultsOnHeroku from '../setPostgresDefaultsOnHeroku';
import { User, UserWithPasswordHash } from './types';

// setPostgresDefaultsOnHeroku();

// Read the PostgreSQL secret connection information
// (host, database, username, password) from the .env file
dotenvSafe.config();

declare module globalThis {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let __postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production') {
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.__postgresSqlClient) {
      globalThis.__postgresSqlClient = postgres();
    }
    sql = globalThis.__postgresSqlClient;
  }

  return sql;
}

// Connect to PostgreSQL
const sql = connectOneTimeToDatabase();

// // Perform a first query
// export async function getSeeds() {
//   const seeds = await sql`SELECT * FROM seeds`;
//   return seeds.map((seed) => camelcaseKeys(seed));
// }

export async function insertUser(
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  passwordHash: string,
) {
  console.log('email', email);
  const users = await sql`
    INSERT INTO users
      (first_name, last_name, username, email, password_hash)
    VALUES
      (${firstName}, ${lastName}, ${username}, ${email}, ${passwordHash})
    RETURNING
      id,
      first_name,
      last_name,
      username,
      email
  `;
  console.log('users', users);
  return users.map((user) => camelcaseKeys(user))[0];
}

export async function getUserById(id?: number) {
  // Return undefined if userId is not parseable
  // to an integer
  if (!id) return undefined;

  const users = await sql<[User]>`
    SELECT
      id,
      first_name,
      last_name,
      username,
      email
    FROM
      users
    WHERE
      id = ${id}
  `;
  return users.map((user) => camelcaseKeys(user))[0];
}

export async function getUserByUsername(username?: string) {
  // Return undefined if username is falsy
  if (!username) return undefined;

  const users = await sql<[User]>`
    SELECT
      id,
      first_name,
      last_name,
      username,
      email
    FROM
      users
    WHERE
      username = ${username}
  `;
  return users.map((user) => camelcaseKeys(user))[0];
}

export async function getUserWithPasswordHashByUsername(username?: string) {
  // Return undefined if username is falsy
  if (!username) return undefined;

  const users = await sql<[UserWithPasswordHash]>`
    SELECT
      *
    FROM
      users
    WHERE
      username = ${username}
  `;
  return users.map((user) => camelcaseKeys(user))[0];
}
