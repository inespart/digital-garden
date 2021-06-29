import { NextApiRequest, NextApiResponse } from 'next';
import { convertQueryValueString } from '../../../util/context';
import { getUsersIfValidSessionToken } from '../../../util/database';
import { ApplicationError, User } from '../../../util/types';

export type UsersRestrictedResponseType =
  | { users: User[] }
  | { errors: ApplicationError[] };

// API design here is not so great, maybe don't copy
export default async function singleUserHandler(
  req: NextApiRequest,
  res: NextApiResponse<UsersRestrictedResponseType>,
) {
  // Retrieve the session token from the cookie that
  // has been forwarded from the frontend (in
  // getServerSideProps in the page component file)
  const token = convertQueryValueString(req.cookies.sessionToken);

  // Get either an array of errors OR a user
  const result = await getUsersIfValidSessionToken(token);

  // If we have received an array of errors, set the
  // response accordingly
  if (result.length > 0 && 'message' in result[0]) {
    return res.status(403).json({
      errors: result as ApplicationError[],
    });
  }

  // If we've successfully retrieved a user, return that instead
  return res.status(200).json({ users: result as User[] });
}
