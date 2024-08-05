import { UserType } from '@prisma/client';

interface IUser {
  user: number;
  email: string;
  type: UserType;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
