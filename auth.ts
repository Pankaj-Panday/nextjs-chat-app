import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    signOut: "/register",
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      // all other parameters of this callbacks are available only if this is the first time user is signing in, for subsequent calls only token is available

      if (user) {
        token.id = user.id;
      }

      const userId = token.id ? token.id : token.sub ? token.sub : null;
      if (!userId) return token;

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) return token;

      const existingAccount = await prisma.account.findFirst({
        where: {
          userId: userId,
        },
      });

      // update the properties just in case it was modified in database
      token.name = existingUser.name;

      // add custom fields
      token.isOauth = !!existingAccount;
      token.image = existingUser.image;

      return token;
    },
    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          isOauth: token.isOauth,
          name: token.name,
        },
      };
    },

    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      if (account?.provider === "credentials") {
        // Reject if user doesn't exist
        if (!user) return false;
      }
      return true;
    },
  },
});
