import { NextApiRequest, NextApiResponse } from 'next';
import { convertQueryValueString } from '../../../../util/context';
import {
  getNoteContentByNoteId,
  getSeedBySeedSlug,
  getUserByUsername,
  getValidSessionByToken,
} from '../../../../util/database';
import { ApplicationError, Content, Seed } from '../../../../util/types';

// Type for response
export type SingleSeedResponseType =
  | {
      seed: Seed | null;
      publicNoteContent: Content | undefined;
      privateNoteContent: Content | undefined;
    }
  | { errors: ApplicationError[] };

export default async function singleSeedHandler(
  req: NextApiRequest,
  res: NextApiResponse<SingleSeedResponseType>,
) {
  // Check if session is valid
  const validSession = await getValidSessionByToken(req.cookies.sessionToken);

  console.log('validSession', validSession);

  // Retrieve slug from the query string (the square bracket notation in the filename)
  const slug = convertQueryValueString(req.query.seed);

  if (!slug) {
    return res.status(409).json({ errors: [{ message: 'Slug is missing.' }] });
  }

  // Get either an array of errors OR a user
  // seed {
  //   id: 63,
  //   title: 'This is a test title for business',
  //   publicNoteId: 125,
  //   privateNoteId: 126,
  //   categoryId: 1,
  //   imageUrl: 'www.google.at',
  //   resourceUrl: 'www.resourceurl.at'
  // }
  const seed = await getSeedBySeedSlug(slug);

  if (!seed) {
    return res.status(409).json({ errors: [{ message: 'Seed is missing.' }] });
  }

  let privateNoteContent;

  // Get user id
  if (validSession) {
    const user = await getUserByUsername(req.query.username);
    // console.log('user.id', user.id);
    // console.log('validSession.id', validSession.userId);

    if (user?.id === validSession.userId) {
      // Get private note content
      privateNoteContent = await getNoteContentByNoteId(seed.privateNoteId);
    }
  }

  // Get public note content
  const publicNoteContent = await getNoteContentByNoteId(seed.publicNoteId);

  // If we have received an array of errors, set the
  // response accordingly
  if (Array.isArray(seed)) {
    return res.status(403).json({ errors: seed });
  }

  // If we've successfully retrieved a title, return that
  return res.status(200).json({
    seed: seed,
    publicNoteContent: publicNoteContent,
    privateNoteContent: privateNoteContent,
  });
}
