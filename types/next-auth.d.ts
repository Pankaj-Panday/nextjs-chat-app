import type { User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth" {
  interface User {
    id: UserId;
  }

  interface Session {
    user: User & {
      id: userId;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
