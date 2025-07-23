import { User as NextAuthUser } from "next-auth";

export type AppUser = NextAuthUser & {
  id: string;
  email: string;
  image?: string | Blob | null;
  name?: string | null;
};
