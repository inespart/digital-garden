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

  // Retrieve slug from the query string (the square bracket notation in the filename)
  // console.log('req.query', req.query.username);
  const user = await getUserByUsername(req.query.username);
  if (!user) {
    return res.status(404).json({ errors: [{ message: 'User not found.' }] });
  }
  // console.log('user', user);

  // Get slug title
  // education-title-ip
  const slugTitle = convertQueryValueString(req.query.seed);

  // Save seed slug
  // 1-education-title-ip
  const slug = `${user.id}-${slugTitle}`;

  if (!slug) {
    return res.status(409).json({ errors: [{ message: 'Slug is missing.' }] });
  }

  // Get either an array of errors OR a user
  const seed = await getSeedBySeedSlug(slug);
  // console.log('seed in .ts', seed);

  if (!seed) {
    return res.status(409).json({ errors: [{ message: 'Seed is missing.' }] });
  }

  // Get public note content
  const publicNoteContent = await getNoteContentByNoteId(seed.publicNoteId);

  // Get the author of the seed
  const author = await getAuthorBySeedId(seed.id);
  // console.log('author', author);

  let privateNoteContent;

  // If author is the same as validSession user, also get the private note content
  // console.log('author.id', author?.userId);
  // console.log('validSession.userId', validSession?.userId);
  if (author?.userId === validSession?.userId) {
    // Get private note content
    privateNoteContent = await getNoteContentByNoteId(seed.privateNoteId);
    // console.log("You're the author! Here's the private content", {
    //   privateNoteContent,
    // });
  } else {
    privateNoteContent = '';
  }

  // Get category name
  // console.log('seed in seed.ts', seed);

  const category = await getCategoryById(seed.categoryId);
  console.log('category', category);
  const categoryName = category.title;
  console.log('categoryName', categoryName);

  if (req.method === 'DELETE') {
    const deletedSeed = await deleteSeedBySeedId(seed.id);
    // console.log('deletedSeed', deletedSeed);
  }

  if (req.method === 'PUT') {
    const updatedSeed = await updateSeedBySeedId(
      seed.id,
      req.body.resourceUrl,
      seed.publicNoteId,
      req.body.publicNoteContent,
      seed.privateNoteId,
      req.body.privateNoteContent,
    );
    // console.log('seed', seed);
    // console.log('seed.id', seed.id);
    // console.log('req.body.resourceUrl', req.body.resourceUrl);
    // console.log('updatedSeed', updatedSeed);
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
