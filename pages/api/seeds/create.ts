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

    // Declare variables for form validation
    const responseErrorObject: ApplicationError[] = [];
    let responseStatusCode: number = 200;

    // Check if valid session is not undefined
    if (!validSession) {
      responseStatusCode = 400;
      responseErrorObject.push({
        field: 'validSession',
        message: 'No valid session. Please log in.',
      });

      // return res.status(403).json({
      //   errors: [{ id: 1, message: 'No valid session. Please log in.' }],
      // });
    }

    // Check if user selected a category
    if (!categoryId) {
      responseStatusCode = 400;
      responseErrorObject.push({
        field: 'categoryId',
        message: 'Please select a category.',
      });
      // return res
      //   .status(403)
      //   .json({ errors: [{ id: 2, message: 'Please select a category.' }] });
    }

    // Create slug from title
    let sluggedTitle = '';
    let slug = '';

    if (!title) {
      responseStatusCode = 400;
      responseErrorObject.push({
        field: 'title',
        message: 'Please enter a title.',
      });
      // return res
      //   .status(403)
      //   .json({ errors: [{ id: 3, message: 'Please enter a title.' }] });
    }

    if (validSession && title) {
      sluggedTitle = generateTitle(title);
      slug = generateSlug(validSession.userId, title);
    }

    // Check if public note was entered
    if (!publicNoteId) {
      responseStatusCode = 403;
      responseErrorObject.push({
        field: 'publicNoteId',
        message: 'Please enter a public note.',
      });
      // return res
      //   .status(403)
      //   .json({ errors: [{ id: 5, message: 'Please enter a public note.' }] });
    }

    console.log('right before early return');

    // Early return any errors and status code to the frontend
    if (responseErrorObject.length > 0) {
      // console.log('responseErrorObject early return', responseErrorObject);
      return res
        .status(responseStatusCode)
        .json({ errors: [responseErrorObject] });
    }

    console.log('right after early return');

    // Check if slug is unique
    const userSlugs = await getSlugsByUserId(validSession.userId);

    const isSlugAlreadyUsed = userSlugs?.some(
      (slugObject) => slugObject.slug === slug,
    );

    if (isSlugAlreadyUsed) {
      responseStatusCode = 400;
      responseErrorObject.push({
        field: 'isSlugAlreadyUsed',
        message: 'Title already used. Please choose another title.',
      });
      // return res.status(409).json({
      //   errors: [
      //     {
      //       id: 4,
      //       message: 'Title already used. Please choose another title.',
      //     },
      //   ],
      // });
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

    console.log('successfully saved info in database');

    const user = await getUserById(seed.userId);
    // console.log('user from create.ts', user);

    console.log('right before sending response to frontend');

    // Send response to frontend
    if (responseErrorObject.length > 0) {
      // If there is/are errors, return status code and errors to the frontend
      console.log('responseErrorObject.length', responseErrorObject.length);
      console.log('responseErrorObject bottom', responseErrorObject);
      return res
        .status(responseStatusCode)
        .json({ errors: [responseErrorObject] });
    } else {
      // Return seed and user response to the frontend
      console.log('I am inside the else - no errors');
      console.log('responseErrorObject.length', responseErrorObject.length);
      return res.status(200).json({
        seed: seed,
        user: user,
        sluggedTitle: sluggedTitle,
        errors: [],
      });
    }
  }
}
