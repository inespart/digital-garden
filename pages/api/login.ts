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
  getUserWithPasswordHashByUsername,
  insertSession,
} from '../../util/database';
import { ApplicationError, User } from '../../util/types';

export type LoginResponse = { user: User } | { errors: ApplicationError[] };

// An API Route needs to define the response
// that is returned to the user
export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>,
) {
  if (req.method === 'POST') {
    // Destructure relevant information from the request body
    const { username, password } = req.body;

    // Get the user from the database with the username
    const userWithPasswordHash = await getUserWithPasswordHashByUsername(
      username,
    );

    // If a matching user does not exist in the database, return a
    // 401 Unauthorized status code and an error
    if (!userWithPasswordHash) {
      return res.status(401).json({
        errors: [
          {
            field: 'usernamePasswordDidNotMatch',
            message: 'Username or password did not match',
          },
        ],
      });
    }

    // Check that the entered plaintext password matches with the
    // password hash stored in the database
    const passwordMatches = await argon2.verify(
      userWithPasswordHash.passwordHash,
      password,
    );

    // If the password doesn't match the password hash, return a
    // 401 Unauthorized status code and an error
    if (!passwordMatches) {
      return res
        .status(401)
        .json({
          errors: [
            {
              field: 'passwordMatchesPasswordHash',
              message: 'Username or password did not match',
            },
          ],
        });
    }

    // Clean up expired sessions
    await deleteExpiredSessions();

    // Generate token consisting of a long string of letters
    // and number, which will serve as a record that the user
    // at one point did log in correctly
    const token = crypto.randomBytes(64).toString('base64');

    // Save the token to the database (with an automatically
    // generated expiry of 24 hours)
    const session = await insertSession(token, userWithPasswordHash.id);

    const cookie = createSerializedSessionTokenCookie(session.token);

    // Destructuring with a rest parameter
    // passwordHash => passwordHash will take it out of the object
    // ...user => anything else that is inside of the object (see util/types.js) is going to go into a new variable called "user"
    const { passwordHash, ...user } = userWithPasswordHash;

    // now we have a user that doesn't have the passwordHash anymore
    return res.status(200).setHeader('Set-Cookie', cookie).json({ user: user });
  }

  res
    .status(400)
    .json({ errors: [{ field: 'badRequest', message: 'Bad request' }] });
}
