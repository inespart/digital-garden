import { NextApiRequest, NextApiResponse } from 'next';
import { ApplicationError, User } from '../../../util/types';

export type SingleUserResponseType =
  | { title: User | null }
  | { errors: ApplicationError[] };

export default async function singleUserHandler(
  req: NextApiRequest,
  res: NextApiResponse<SingleUserResponseType>,
) {
  // Retrieve title from the query string (the square bracket notation in the filename)
  const title = convertQueryValueString(req.query.title);

  console.log('req.query', req.query);

  // // Retrieve the session token from the cookie that has been forwarded from the frontend (in getServerSideProps in the page component file)
  // const token = convertQueryValueString(req.cookies.sessionToken);

  // Get either an array of errors OR a user
  const result = await getSeedBySeedId(req.query.id);

  // If we have received an array of errors, set the
  // response accordingly
  if (Array.isArray(result)) {
    return res.status(403).json({ errors: result });
  }

  // If we've successfully retrieved a title, return that
  return res.status(200).json({ title: result || null });
}
