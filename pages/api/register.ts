import argon2 from 'argon2';
// eslint-disable-next-line unicorn/prefer-node-protocol
import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSerializedSessionTokenCookie } from '../../util/cookies';
// Since all files in the API folder
// are server-side only, we can import from
// the database statically at the top
import {
  deleteExpiredSessions,
  insertSession,
  insertUser,
} from '../../util/database';

// An API Route needs to define the response
// that is returned to the user
export default async function registerHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // Destructure relevant information from the request body
    const { firstName, lastName, username, email, password } = req.body;

    // Create a hash of the password to save in the database
    const passwordHash = await argon2.hash(password);

    const user = await insertUser(
      firstName,
      lastName,
      username,
      email,
      passwordHash,
    );

    // Clean up expired sessions
    await deleteExpiredSessions();

    // Generate token consisting of a long string of letters
    // and number, which will serve as a record that the user
    // at one point did log in correctly
    const token = crypto.randomBytes(64).toString('base64');

    // Save the token to the database (with an automatically
    // generated expiry of 24 hours)
    const session = await insertSession(token, user.id);

    const cookie = createSerializedSessionTokenCookie(session.token);

    return res.status(200).setHeader('Set-Cookie', cookie).json({ user: user });
  }

  res.status(400).json(null);
}
