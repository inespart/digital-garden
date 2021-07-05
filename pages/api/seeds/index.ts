import { NextApiRequest, NextApiResponse } from 'next';
import {
  getAllSeeds,
  getSeedsByValidSessionUser,
  getValidSessionByToken,
} from '../../../util/database';

// export type SingleSeedResponseType =
//   | { title: User | null }
//   | { errors: ApplicationError[] };

export default async function singleSeedHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Retrieve all seeds
  const allSeeds = await getAllSeeds();
  // console.log('fullSeed', fullSeed);

  // Check if session is valid
  // validSession {
  //   id: 8,
  //   token: 'AVDn...,
  //   expiry: 2021-07-06T10:18:22.330Z,
  //   userId: 3
  // }
  const validSession = await getValidSessionByToken(req.cookies.sessionToken);
  // console.log('req.cookies', req.cookies.sessionToken);
  // console.log('validSession', validSession);

  // Check if valid session is not undefined
  if (!validSession) {
    return res.status(404).json({ errors: [{ message: 'No valid session.' }] });
  }

  // Retrieve seeds of valid session user
  const allSeedsByValidSessionUser = await getSeedsByValidSessionUser(
    validSession.userId,
  );
  // console.log('allSeedsByValidSessionUser', allSeedsByValidSessionUser);

  // If we have received an array of errors, set the response accordingly
  // if (Array.isArray(seed)) {
  //   return res.status(403).json({ errors: seed });
  // }

  // If we've successfully retrieved a title, return that
  return res.status(200).json({
    allSeeds: allSeeds,
    allSeedsByValidSessionUser: allSeedsByValidSessionUser,
  });
}
