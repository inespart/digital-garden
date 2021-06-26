import { NextApiRequest, NextApiResponse } from 'next';
import { convertQueryValueString } from '../../../util/context';
import { getUserByUsername } from '../../../util/database';

// API design here is not so great, maybe don't copy
export default async function singleUserHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const username = convertQueryValueString(req.query.username);
  const user = await getUserByUsername(username);
  return res.status(200).json({ user: user || null });
}
