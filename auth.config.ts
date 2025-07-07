import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "./lib/prisma";
import { verifyPassword } from "./lib/utils";
import { LoginSchema } from "./schemas/auth-schemas";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("MISSING GOOGLE_CLIENT_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("MISSING GOOGLE_CLIENT_SECRET");
  }

  return {
    clientId,
    clientSecret,
  };
}

export default {
  providers: [
    Google({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
      // authorization: {
      //   params: {
      //     prompt: "consent",
      //   },
      // },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedData = LoginSchema.safeParse(credentials);
        if (!validatedData.success) return null;

        const { email, password } = validatedData.data;

        // find the user in the database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;

        // match the password
        const passwordMatch = await verifyPassword(password, user.password);

        if (passwordMatch) {
          return user;
        }
        return null; // returning null is like throwing "CredentialsSignin" error meaning credentials are invalid
      },
    }),
  ],
} satisfies NextAuthConfig;
