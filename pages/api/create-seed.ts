import { NextApiRequest, NextApiResponse } from 'next';
import { createSeed, getValidSessionByToken } from '../../util/database';
import { ApplicationError, Seed } from '../../util/types';

export type CreateSeedResponse =
  | {
      seed: Seed;
    }
  | { errors: ApplicationError[] };

export default async function createSeedHandler(
  req: NextApiRequest,
  res: NextApiResponse<CreateSeedResponse>,
) {
  // console.log('token from create-seed.ts', req.cookies.sessionToken);

  if (req.method === 'POST') {
    const validSession = await getValidSessionByToken(req.cookies.sessionToken);

    // Retrieve title, etc. from the request body from the frontend
    const {
      title,
      publicNoteId,
      privateNoteId,
      resourceUrl,
      categoryId,
      isPublished,
    } = req.body;

    // TODO: check if userId, etc. is not undefined
    if (!validSession) {
      return res
        .status(403)
        .json({ errors: [{ message: 'No valid session.' }] });
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
    return seed;
  }
}
