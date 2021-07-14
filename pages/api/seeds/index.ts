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
  // allSeeds [
  //   {
  //     title: 'Create a startup',
  //     imageUrl: 'https://images.com,
  //     resourceUrl: '',
  //     publicNoteId: 1,
  //     userId: 1,
  //     categoryId: 1,
  //     slug: '1-create-a-startup',
  //     id: 1,
  //     content: '<p>This is the public note</p>',
  //     username: 'ip',
  //     categoriesTitle: 'Business'
  //   },
  const allSeeds = await getAllSeeds();
  // console.log('allSeeds', allSeeds);

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
  const isSessionValid = validSession ? true : false;
  // console.log('isSessionValid', isSessionValid);

  let allSeedsByValidSessionUser;

  // Check if valid session is defined
  if (validSession) {
    // Retrieve seeds of valid session user
    allSeedsByValidSessionUser = await getSeedsByValidSessionUser(
      validSession.userId,
    );

    // console.log('allSeedsByValidSessionUser', allSeedsByValidSessionUser);
  } else {
    // return res.status(404).json({ errors: [{ message: 'No valid session.' }] });
  }

  // If we've successfully retrieved the seeds, return them
  return res.status(200).json({
    allSeeds: allSeeds,
    isSessionValid: isSessionValid,
    allSeedsByValidSessionUser: allSeedsByValidSessionUser,
  });
}
