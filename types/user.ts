import { User as NextAuthUser } from "next-auth";

export type AppUser = NextAuthUser & {
  id: string;
};
