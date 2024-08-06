import { UserType } from "@prisma/client";

export interface IUser {
    name: string;
    phone: string;
    email: string;
    password: string;
    type?: UserType;
    firstName?: string;
    lastName?: string;
    address?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    profilePict?: string;
  }