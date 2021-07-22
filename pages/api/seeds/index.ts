import { NextApiRequest, NextApiResponse } from 'next';
import {
  getAllSeeds,
  getSeedsByValidSessionUser,
  getValidSessionByToken,
} from '../../../util/database';

export default async function singleSeedHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Retrieve all seeds
  const allSeeds = await getAllSeeds();

  // Check if session is valid
  const validSession = await getValidSessionByToken(req.cookies.sessionToken);
  const isSessionValid = validSession ? true : false;

  let allSeedsByValidSessionUser;

  // Check if valid session is defined
  if (validSession) {
    // Retrieve seeds of valid session user
    allSeedsByValidSessionUser = await getSeedsByValidSessionUser(
      validSession.userId,
    );
  }
  // else {
  //   console.log('unregistered user');
  // }

  // Return to the frontend
  return res.status(200).json({
    allSeeds: allSeeds,
    isSessionValid: isSessionValid,
    allSeedsByValidSessionUser: allSeedsByValidSessionUser,
  });
}
