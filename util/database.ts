import camelcaseKeys from 'camelcase-keys';
import dotenvSafe from 'dotenv-safe';
import DOMPurify from 'isomorphic-dompurify';
import postgres from 'postgres';
// import setPostgresDefaultsOnHeroku from '../setPostgresDefaultsOnHeroku';
import {
  ApplicationError,
  Category,
  Content,
  Note,
  Seed,
  Session,
  Slug,
  User,
  UserWithPasswordHash,
} from './types';

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

// Secure version of getUsers which allows ANY authenticated user to view ALL users
export async function getUsersIfValidSessionToken(token?: string) {
  // Security: Return "Access denied" error if falsy token passed
  if (!token) {
    const errors: ApplicationError[] = [{ message: 'Access denied' }];
    return errors;
  }

  const session = await getValidSessionByToken(token);

  // Security: Return "Access denied" error if token does not match valid session
  if (!session) {
    const errors: ApplicationError[] = [{ message: 'Access denied' }];
    return errors;
  }

  // Security: Now this query has been protected
  // and it will only run in case the user has a
  // token corresponding to a valid session
  const users = await sql<User[]>`
    SELECT
      id,
      first_name,
      last_name,
      username
    FROM
      users
  `;

  return users.map((user) => camelcaseKeys(user));
}

export async function insertUser(
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  passwordHash: string,
) {
  const users = await sql<[User]>`
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
  // Return undefined if userId is not parseable to an integer
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

export async function getUserByUsername(username: string | string[]) {
  // Return undefined if userId is not parseable to an integer
  if (!username) return undefined;

  const users = await sql<[User]>`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      username = ${username}
  `;
  return users.map((user) => camelcaseKeys(user))[0];
}

export async function getUserByUsernameAndToken(
  username?: string,
  token?: string,
) {
  // Security: If the user is not logged in, we do not allow access and return an error from the database function
  if (!token) {
    const errors: ApplicationError[] = [{ message: 'Access denied' }];
    return errors;
  }

  // Return undefined if username is falsy
  // (for example, an undefined or '' value for the username)
  if (!username) return undefined;

  // Security: Retrieve user via the session token
  const userFromSession = await getUserByValidSessionToken(token);

  // If there is either
  // - no valid session mathing the token
  // - no user matching the valid session
  // return undefined
  if (!userFromSession) return undefined;

  // Retrieve all matching users from database
  // users could be an array with the matching user OR an empty array
  const users = await sql<[User | undefined]>`
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

  // ? will test if the first user exists or not
  // it will be undefined in the case it cannot find a user
  // only in the case it can find a user, it will do the property access

  // to avoid the ?
  // first test if the user exists
  const user = users[0];
  // if it doesn't exist, stop the function by returning undefined
  if (!user) return undefined;

  // Security: Match ids of session user with user
  // corresponding to requested username
  if (user.id !== userFromSession.id) {
    const errors: ApplicationError[] = [{ message: 'Access denied' }];

    return errors;
  }

  return camelcaseKeys(user);
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

export async function getValidSessionByToken(token: string) {
  if (!token) return undefined;

  const sessions = await sql<Session[]>`
    SELECT
      *
    FROM
      sessions
    WHERE
      token = ${token} AND
      expiry > NOW()
  `;
  return sessions.map((session) => camelcaseKeys(session))[0];
}

export async function getUserByValidSessionToken(token: string) {
  if (!token) return undefined;

  const session = await getValidSessionByToken(token);

  if (!session) return undefined;

  // once we have the session, we want to get the user information
  // we call another function and pass the session.userId
  return await getUserById(session.userId);
}

export async function insertSession(token: string, userId: number) {
  const sessions = await sql<Session[]>`
    INSERT INTO sessions
      (token, user_id)
    VALUES
      (${token}, ${userId})
    RETURNING *
  `;
  return sessions.map((session) => camelcaseKeys(session))[0];
}

export async function insertFiveMinuteSessionWithoutUserId(token: string) {
  const sessions = await sql<Session[]>`
    INSERT INTO sessions
      (token, expiry)
    VALUES
      (${token}, NOW() + INTERVAL '5 minutes')
    RETURNING *
  `;
  return sessions.map((session) => camelcaseKeys(session))[0];
}

export async function deleteExpiredSessions() {
  const sessions = await sql<Session[]>`
    DELETE FROM
      sessions
    WHERE
      expiry < NOW()
    RETURNING *
  `;
  return sessions.map((session) => camelcaseKeys(session));
}

export async function deleteSessionByToken(token: string) {
  const sessions = await sql<Session[]>`
    DELETE FROM
      sessions
    WHERE
      token = ${token}
    RETURNING *
  `;
  return sessions.map((session) => camelcaseKeys(session))[0];
}

export async function createSeed(
  title: string,
  publicNote: string,
  userId: number,
  categoryId: number,
  isPublished: boolean,
  privateNote: string,
  imageUrl: string,
  resourceUrl: string,
  slug: string,
) {
  const cleanPublicNote = DOMPurify.sanitize(publicNote);

  const publicNoteId = await sql<[Note]>`
    INSERT INTO notes
      (content, is_private)
    VALUES
      (${cleanPublicNote}, ${false})
    RETURNING
      id
  `;

  const cleanPrivateNote = DOMPurify.sanitize(privateNote);

  const privateNoteId = await sql<[Note]>`
    INSERT INTO notes
      (content, is_private)
    VALUES
      (${cleanPrivateNote}, ${true})
    RETURNING
      id
    `;

  const seeds = await sql<[Seed]>`
    INSERT INTO seeds
      (title, public_note_id, user_id, category_id, is_published, private_note_id, image_url, resource_url, slug)
    VALUES
      (${title}, ${publicNoteId[0].id}, ${userId}, ${categoryId}, ${isPublished}, ${privateNoteId[0].id}, ${imageUrl}, ${resourceUrl}, ${slug})
    RETURNING
      title,
      public_note_id,
      user_id,
      category_id,
      is_published,
      private_note_id,
      image_url,
      resource_url,
      slug
  `;
  return seeds.map((seed) => camelcaseKeys(seed))[0];
}

export async function getCategory() {
  const categories = await sql<[Category]>`
  SELECT
      id,
      title
    FROM
      categories
  `;
  return categories.map((category) => camelcaseKeys(category));
}

export async function getCategoryById(categoryId: number) {
  if (!categoryId) return undefined;

  const categories = await sql<[Category]>`
  SELECT
      id,
      title
    FROM
      categories
  `;
  return categories.map((category) => camelcaseKeys(category))[0];
}

export async function getSlugsByUserId(userId: number) {
  if (!userId) return undefined;

  const slugs = await sql<[Slug]>`
    SELECT
      slug
    FROM
      seeds
    WHERE
      user_id = ${userId}
  `;
  return slugs.map((slug) => camelcaseKeys(slug));
}

export async function getSeedBySeedId(seedId: number) {
  if (!seedId) return undefined;

  const seeds = await sql<[Seed]>`
    SELECT
      id,
      title,
      public_note_id,
      private_note_id,
      category_id,
      image_url,
      resource_url
    FROM
      seeds
    WHERE
      id = ${seedId}
  `;
  return seeds.map((seed) => camelcaseKeys(seed))[0];
}

export async function getSeedBySeedSlug(seedSlug: string) {
  if (!seedSlug) return undefined;

  const seeds = await sql<[Seed]>`
    SELECT
      title,
      public_note_id,
      private_note_id,
      slug,
      resource_url,
      image_url
    FROM
      seeds
    WHERE
      slug = ${seedSlug};
  `;
  // console.log('seeds', seeds);
  return seeds.map((seed) => camelcaseKeys(seed))[0];
}

// export async function getSeedBySeedSlug(seedSlug: string) {
//   if (!seedSlug) return undefined;

//   const seeds = await sql<[Seed]>`
//     SELECT
//       seeds.title,
//       seeds.resource_url,
//       seeds.image_url,
//       notes.content,
//       notes.is_private
//     FROM
//       seeds,
//       notes
//     WHERE
//       (notes.id = seeds.public_note_id
//     OR
//       notes.id = seeds.private_note_id)
//     AND
//       seeds.slug = ${seedSlug};
//   `;
//   console.log('seeds', seeds);
//   return seeds.map((seed) => camelcaseKeys(seed))[0];
// }

export async function getNoteContentByNoteId(noteId: number) {
  if (!noteId) return undefined;

  const notesContent = await sql<[Content]>`
    SELECT
      content
    FROM
      notes
    WHERE
      id = ${noteId}
  `;
  return notesContent.map((noteContent) => camelcaseKeys(noteContent))[0];
}

// maybe dont need this anymore
export async function getAllSeeds() {
  const allSeeds = await sql<[Seed]>`
    SELECT
      id,
      title,
      image_url,
      public_note_id
    FROM
      seeds
  `;
  return allSeeds.map((seed) => camelcaseKeys(seed));
}

// maybe dont need this anymore
export async function getPublicNotesContents() {
  const publicNotesContents = await sql<[Content]>`
    SELECT
      id,
      content
    FROM
      notes
  `;
  return publicNotesContents.map((publicNoteContent) =>
    camelcaseKeys(publicNoteContent),
  );
}

export async function getSeedsWithNotesContentAndUser() {
  const seedsWithNotesContentAndUser = await sql<[Seed]>`
    SELECT
      seeds.title,
      seeds.image_url,
      seeds.resource_url,
      seeds.public_note_id,
      seeds.user_id,
      seeds.category_id,
      seeds.slug,
      notes.id,
      notes.content,
      users.username,
      categories.title as categories_title
    FROM
      seeds,
      notes,
      users,
      categories
    WHERE
      notes.id = seeds.public_note_id
    `;
  // console.log('seedsWithNotes', seedsWithNotes);
  return seedsWithNotesContentAndUser.map((seedWithNoteContentAndUser) =>
    camelcaseKeys(seedWithNoteContentAndUser),
  );
}

// getSeedsByUserId
