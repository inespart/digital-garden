import { NextApiRequest, NextApiResponse } from 'next';
import { convertQueryValueString } from '../../../../util/context';
import {
  deleteSeedBySeedId,
  getAuthorBySeedId,
  getCategoryById,
  getNoteContentByNoteId,
  getSeedBySeedSlug,
  getUserByUsername,
  getValidSessionByToken,
  updateSeedBySeedId,
} from '../../../../util/database';
import {
  ApplicationError,
  Author,
  Content,
  Seed,
} from '../../../../util/types';

// Define the types of the response
export type SingleSeedResponseType =
  | {
      seed: Seed | null;
      author: Author | undefined;
      categoryName: string | undefined;
      publicNoteContent: Content | undefined;
      privateNoteContent: string | Content | undefined;
      slugTitle: string | undefined;
    }
  | { errors: ApplicationError[] };

export default async function singleSeedHandler(
  req: NextApiRequest,
  res: NextApiResponse<SingleSeedResponseType>,
) {
  // Check if session is valid
  // validSession {
  //   id: 8,
  //   token: 'AVDn...,
  //   expiry: 2021-07-06T10:18:22.330Z,
  //   userId: 3
  // }
  const validSession = await getValidSessionByToken(req.cookies.sessionToken);
  // console.log('validSession', validSession);
  // console.log('req.cookies.sessionToken', req.cookies.sessionToken);

  // Retrieve slug from the query string (the square bracket notation in the filename)
  // console.log('req.query', req.query.username);
  const user = await getUserByUsername(req.query.username);
  if (!user) {
    return res
      .status(404)
      .json({ errors: [{ field: 'user', message: 'User not found.' }] });
  }
  // console.log('user', user);

  // Get slug title
  const slugTitle = convertQueryValueString(req.query.seed);

  // Save seed slug
  const slug = `${user.id}-${slugTitle}`;

  if (!slug) {
    return res
      .status(409)
      .json({ errors: [{ field: 'slug', message: 'Slug is missing.' }] });
  }

  // Get either an array of errors OR a seed
  const seed = await getSeedBySeedSlug(slug);

  if (!seed) {
    return res
      .status(409)
      .json({ errors: [{ field: 'seed', message: 'Seed is missing.' }] });
  }

  // Get public note content
  const publicNoteContent = await getNoteContentByNoteId(seed.publicNoteId);

  // Get the author of the seed
  const author = await getAuthorBySeedId(seed.id);

  let privateNoteContent;

  // If author is the same as validSession user, also get the private note content
  if (author?.userId === validSession?.userId) {
    privateNoteContent = await getNoteContentByNoteId(seed.privateNoteId);
  } else {
    privateNoteContent = '';
  }

  // Get category name
  const category = await getCategoryById(seed.categoryId);
  const categoryName = category?.title;

  if (req.method === 'DELETE') {
    if (!validSession) {
      return res.status(403).json({
        errors: [{ field: 'validSession', message: 'No valid session' }],
      });
    } else {
      await deleteSeedBySeedId(seed.id);
    }
  }

  if (req.method === 'PUT') {
    await updateSeedBySeedId(
      seed.id,
      req.body.resourceUrl,
      seed.publicNoteId,
      req.body.publicNoteContent,
      seed.privateNoteId,
      req.body.privateNoteContent,
    );
  }

  // If we have received an array of errors, set the
  // response accordingly
  if (Array.isArray(seed)) {
    return res.status(403).json({ errors: seed });
  }

  // If we've successfully retrieved the information, return that to the frontend
  return res.status(200).json({
    seed: seed,
    author: author,
    categoryName: categoryName,
    publicNoteContent: publicNoteContent,
    privateNoteContent: privateNoteContent,
    slugTitle: slugTitle,
  });
}
