import { NextApiRequest, NextApiResponse } from 'next';
import {
  createSeed,
  getUserById,
  getValidSessionByToken,
} from '../../../util/database';
import { generateSlug } from '../../../util/generateSlug';
import { ApplicationError, Seed, User } from '../../../util/types';

export type CreateSeedResponse =
  | {
      seed: Seed;
      user?: User;
    }
  | { errors: ApplicationError[] };

export default async function createSeedHandler(
  req: NextApiRequest,
  res: NextApiResponse<CreateSeedResponse>,
) {
  if (req.method === 'POST') {
    const validSession = await getValidSessionByToken(req.cookies.sessionToken);

    // console.log('getCategory', await getCategory());

    // Retrieve title, etc. from the request body from the frontend
    // Destructure relevant information from the req body - all are const
    const {
      title,
      publicNoteId,
      privateNoteId,
      resourceUrl,
      categoryId,
      imageUrl,
      isPublished,
    } = req.body;

    console.log('isPublished', isPublished);

    // Check if userId, etc. is not undefined
    if (!validSession) {
      return res
        .status(403)
        .json({ errors: [{ message: 'No valid session.' }] });
    }

    // Create slug from title
    // Check if title is not undefined
    let slug;
    if (!title) {
      return res.status(403).json({ errors: [{ message: 'No valid title.' }] });
    } else {
      slug = generateSlug(title);
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

    return res.status(200).json({ seed: seed, user: user });
  }
}
