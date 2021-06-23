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

export type ApplicationError = { message: string };
