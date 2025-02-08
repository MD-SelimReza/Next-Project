import { DefaultSession } from "next-auth";

// Extend the NextAuth Session and User types
declare module "next-auth" {
  interface User {
    id: string;
    image?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  }
}
