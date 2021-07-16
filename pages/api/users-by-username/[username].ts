import { NextApiRequest, NextApiResponse } from 'next';
import { convertQueryValueString } from '../../../util/context';
import {
  deleteUserByUserId,
  deleteUserByUserUsername,
  getUserByUsernameAndToken,
} from '../../../util/database';
import { ApplicationError, User } from '../../../util/types';

export type SingleUserResponseType =
  | { user: User | null }
  | { errors: ApplicationError[] };

export default async function singleUserHandler(
  req: NextApiRequest,
  res: NextApiResponse<SingleUserResponseType>,
) {
  // Retrieve username from the query string (the square bracket notation in the filename)
  const username = convertQueryValueString(req.query.username);

  // Retrieve the session token from the cookie that has been forwarded from the frontend (in getServerSideProps in the page component file)
  const token = convertQueryValueString(req.cookies.sessionToken);

  // Get either an array of errors OR a user
  const result = await getUserByUsernameAndToken(username, token);

  // Delete user
  if (req.method === 'DELETE') {
    if (username) {
      await deleteUserByUserUsername(username);
    }
  }

  // If we have received an array of errors, set the
  // response accordingly
  if (Array.isArray(result)) {
    return res.status(403).json({ errors: result });
  }

  // If we've successfully retrieved a user, return that
  return res.status(200).json({ user: result || null });
}
