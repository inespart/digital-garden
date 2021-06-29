import argon2 from 'argon2';
// eslint-disable-next-line unicorn/prefer-node-protocol
import crypto from 'crypto';
import Tokens from 'csrf';
import { NextApiRequest, NextApiResponse } from 'next';
import { generateCsrfSecretByToken } from '../../util/auth';
import { createSerializedSessionTokenCookie } from '../../util/cookies';
// Since all files in the API folder
// are server-side only, we can import from
// the database statically at the top
import {
  deleteExpiredSessions,
  deleteSessionByToken,
  getValidSessionByToken,
  insertSession,
  insertUser,
} from '../../util/database';
import { ApplicationError, User } from '../../util/types';

const tokens = new Tokens();

export type RegisterResponse =
  | {
      user: User;
    }
  | { errors: ApplicationError[] };

// An API Route needs to define the response
// that is returned to the user
export default async function registerHandler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>,
) {
  if (req.method === 'POST') {
    // Retrieve csrfToken, etc. from the request body from the frontend
    // Destructure relevant information from the request body
    const { firstName, lastName, username, email, password, csrfToken } =
      req.body;

    const sessionToken = req.cookies.sessionTokenRegister;
    // console.log('req.cookies register.ts', req.cookies);
    // console.log(
    //   'req.cookies.sessionToken register.ts',
    //   req.cookies.sessionToken,
    // );
    // console.log('sessionToken register.ts', sessionToken);

    const registerSession = await getValidSessionByToken(sessionToken);

    if (!registerSession) {
      return res.status(400).json({ errors: [{ message: 'Invalid session' }] });
    }

    const csrfSecret = generateCsrfSecretByToken(sessionToken);

    // Security: Check CSRF Token
    const isCsrfTokenValid = tokens.verify(csrfSecret, csrfToken);
    // sessionToken gets created upon new registration
    // console.log('short lived session token - register.ts', sessionToken);
    // console.log('csrfToken', csrfToken);

    if (!isCsrfTokenValid) {
      return res
        .status(400)
        .json({ errors: [{ message: "CSRF token doesn't match" }] });
    }

    await deleteSessionByToken(sessionToken);

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

    // Save the token to the database (with an automatically generated expiry of 24 hours)
    const session = await insertSession(token, user.id);

    const cookie = createSerializedSessionTokenCookie(session.token);

    return res.status(200).setHeader('Set-Cookie', cookie).json({ user: user });
  }

  res.status(400).json({ errors: [{ message: 'Bad request' }] });
}
