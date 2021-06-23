import argon2 from 'argon2';
import { NextApiRequest, NextApiResponse } from 'next';
// Since all files in the API folder
// are server-side only, we can import from
// the database statically at the top
import { insertUser } from '../../util/database';

// An API Route needs to define the response
// that is returned to the user
export default async function Register(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // Destructure relevant information from the request body
    const { firstName, lastName, username, email, password } = req.body;

    // Create a hash of the password to save in the database
    const passwordHash = await argon2.hash(password);
    console.log('password', password);
    console.log('password hash', passwordHash);

    const user = await insertUser(
      firstName,
      lastName,
      username,
      email,
      passwordHash,
    );
    return res.status(200).json({ user: user });
  }

  res.status(400).json(null);
}
