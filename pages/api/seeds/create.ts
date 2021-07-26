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
  | { errors: ApplicationError[][] };

export default async function createSeedHandler(
  req: NextApiRequest,
  res: NextApiResponse<CreateSeedResponse>,
) {
  if (req.method === 'POST') {
    const validSession = await getValidSessionByToken(req.cookies.sessionToken);

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

    // Declare variables for form validation
    const responseErrorObject: ApplicationError[] = [];
    let responseStatusCode: number = 200;

    // Check if valid session is not undefined
    if (!validSession) {
      responseStatusCode = 400;
      responseErrorObject.push({
        field: 'validSession',
        message: 'It seems like you are not logged in. Please log in.',
      });
    }

    // Check if user has selected a category
    if (!categoryId) {
      responseStatusCode = 400;
      responseErrorObject.push({
        field: 'categoryId',
        message: 'Please select a category.',
      });
    }

    // Check if user has entered a title
    if (!title) {
      responseStatusCode = 400;
      responseErrorObject.push({
        field: 'title',
        message: 'Please enter a title.',
      });
    }

    // Create slug from title
    let sluggedTitle = '';
    let slug = '';

    if (validSession && title) {
      sluggedTitle = generateTitle(title);
      slug = generateSlug(validSession.userId, title);
    }

    // Check if public note has been entered
    if (!publicNoteId) {
      responseStatusCode = 403;
      responseErrorObject.push({
        field: 'publicNoteId',
        message: 'Please enter a public note.',
      });
    }

    // Early return any errors and status code to the frontend
    if (responseErrorObject.length > 0) {
      return res
        .status(responseStatusCode)
        .json({ errors: [responseErrorObject] });
    }

    // Check if slug is unique
    let userSlugs;
    let isSlugAlreadyUsed;

    if (validSession) {
      userSlugs = await getSlugsByUserId(validSession.userId);

      isSlugAlreadyUsed = userSlugs?.some(
        (slugObject) => slugObject.slug === slug,
      );
    }

    if (isSlugAlreadyUsed) {
      responseStatusCode = 400;
      responseErrorObject.push({
        field: 'isSlugAlreadyUsed',
        message: 'Title already used. Please choose another title.',
      });
    }

    // Save the seed information to the database
    let seed;

    if (validSession) {
      seed = await createSeed(
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
    }

    const user = await getUserById(seed?.userId);

    // Send response to frontend
    if (responseErrorObject.length > 0) {
      // If there is/are errors, return status code and errors to the frontend
      return res
        .status(responseStatusCode)
        .json({ errors: [responseErrorObject] });
    } else {
      // Return seed and user response to the frontend
      return res.status(200).json({
        seed: seed,
        user: user,
        sluggedTitle: sluggedTitle,
        errors: [],
      });
    }
  }
}
