import { User as NextAuthUser } from "next-auth";

export type AppUser = NextAuthUser & {
  id: string;
  email: string;
  image: string ;
  name: string;
};
