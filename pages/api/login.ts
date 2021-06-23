import argon2 from 'argon2';
import { NextApiRequest, NextApiResponse } from 'next';
// Since all files in the API folder
// are server-side only, we can import from
// the database statically at the top
import { getUserWithPasswordHashByUsername } from '../../util/database';
import { ApplicationError, User } from '../../util/types';

export type LoginResponse = { user: User } | { errors: ApplicationError[] };

// An API Route needs to define the response
// that is returned to the user
export default async function Login(
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
      return res
        .status(401)
        .json({ errors: [{ message: 'Username or password did not match' }] });
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
        .json({ errors: [{ message: 'Username or password did not match' }] });
    }

    // TODO: Generate token consisting of a long string of letters
    // and number, which will serve as a record that the user
    // at one point did log in correctly

    // TODO: Save the token to the database with a time limit

    // TODO: Save the token in a cookie on the user's machine
    // (cookies get sent automatically to the server every time
    // a user makes a request)

    // Destructuring with a rest parameter
    // passwordHash => passwordHash will take it out of the object
    // ...user => anything else that is inside of the object (see util/types.js) is going to go into a new variable called "user"
    const { passwordHash, ...user } = userWithPasswordHash;

    // now we have a user that doesn't have the passwordHash anymore
    return res.status(200).json({ user: user });
  }

  res.status(400).json({ errors: [{ message: 'Bad request' }] });
}
