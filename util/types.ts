export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};

export type Author = {
  userId: number;
  username: string;
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

export type Note = {
  id: number;
  content: string;
  isPrivate: boolean;
};

export type Seed = {
  id: number;
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

export type Slug = {
  slug: string;
};

export type Content = {
  content: string;
};

export type Category = {
  id: number;
  title: string;
};

export type ApplicationError = { message: string };
