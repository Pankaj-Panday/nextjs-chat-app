import { NextResponse } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

const privateRoutes = ["/chat"];
const authRoutes = ["/login", "/register"];

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isPrivateRoute = privateRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isLoggedIn && isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: [
    // This ensures middleware skips:
    // Static assets
    // Auth callbacks
    // .well-known/ (security/SSL)
    // Chrome DevTools files (dev-only)

    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|images/|api/auth/|\\.well-known/|com\\.chrome\\.devtools\\.json).*)",
  ],
};
