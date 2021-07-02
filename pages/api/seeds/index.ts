import { NextApiRequest, NextApiResponse } from 'next';
import { getSeedsWithNotesContentAndUser } from '../../../util/database';

// export type SingleSeedResponseType =
//   | { title: User | null }
//   | { errors: ApplicationError[] };

export default async function singleSeedHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Retrieve full seed
  const fullSeed = await getSeedsWithNotesContentAndUser();
  console.log('fullSeed', fullSeed);

  // If we have received an array of errors, set the response accordingly
  // if (Array.isArray(seed)) {
  //   return res.status(403).json({ errors: seed });
  // }

  // If we've successfully retrieved a title, return that
  return res.status(200).json({
    fullSeed: fullSeed,
  });
}
