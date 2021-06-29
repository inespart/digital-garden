export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

export type Session = {
  id: number;
  token: string;
  expiry: Date;
  userId: number;
};

export type Seed = {
  title: string;
  publicNoteId: number;
  userId: number;
  categoryId: number;
  isPublished: boolean;
  privateNoteId: number;
  imageUrl: string;
  resourceUrl: string;
  slug: string;
};

export type Category = {
  id: number;
  title: string;
};

export type ApplicationError = { message: string };
