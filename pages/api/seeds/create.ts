import { NextApiRequest, NextApiResponse } from 'next';
import {
  createSeed,
  getSlugsByUserId,
  getUserById,
  getValidSessionByToken,
} from '../../../util/database';
import { generateSlug } from '../../../util/generateSlug';
import { generateTitle } from '../../../util/generateTitle';
import { ApplicationError, Seed, User } from '../../../util/types';

export type CreateSeedResponse =
  | {
      seed: Seed;
      user?: User;
      sluggedTitle: string;
    }
  | { errors: ApplicationError[] };

export default async function createSeedHandler(
  req: NextApiRequest,
  res: NextApiResponse<CreateSeedResponse>,
) {
  if (req.method === 'POST') {
    const validSession = await getValidSessionByToken(req.cookies.sessionToken);

    // console.log('validSession', validSession);

    // Retrieve title, etc. from the request body from the frontend
    const {
      title,
      publicNoteId,
      privateNoteId,
      resourceUrl,
      categoryId,
      imageUrl,
      isPublished,
    } = req.body;

    // Check if userId, etc. is not undefined
    if (!validSession) {
      return res
        .status(403)
        .json({ errors: [{ message: 'No valid session. Please log in.' }] });
    }
    // console.log('validSession', validSession);

    // Check if category is selected
    if (!categoryId) {
      return res
        .status(403)
        .json({ errors: [{ message: 'Please select a category.' }] });
    }

    // Create slug from title
    let sluggedTitle = '';
    let slug = '';
    if (!title) {
      return res
        .status(403)
        .json({ errors: [{ message: 'Please enter a title.' }] });
    } else {
      sluggedTitle = generateTitle(title);
      slug = generateSlug(validSession.userId, title);
    }

    // Check if slug is unique
    const userSlugs = await getSlugsByUserId(validSession.userId);

    const isSlugAlreadyUsed = userSlugs?.some(
      (slugObject) => slugObject.slug === slug,
    );

    if (isSlugAlreadyUsed) {
      return res.status(409).json({
        errors: [
          { message: 'Title already used. Please choose another title.' },
        ],
      });
    }

    // Check if public note was entered
    if (!publicNoteId) {
      return res
        .status(403)
        .json({ errors: [{ message: 'Please enter a public note.' }] });
    }

    // Save the seed information to the database
    const seed = await createSeed(
      title,
      publicNoteId,
      validSession.userId,
      categoryId,
      isPublished,
      privateNoteId,
      imageUrl,
      resourceUrl,
      slug,
    );

    const user = await getUserById(seed.userId);
    // console.log('user from create.ts', user);

    // Return seed and user response to the frontend
    return res
      .status(200)
      .json({ seed: seed, user: user, sluggedTitle: sluggedTitle });
  }
}
