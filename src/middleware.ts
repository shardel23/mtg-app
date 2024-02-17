import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

const whitelist = [
  "/api/cron",
  "/api/inngest",
  "/.netlify/functions/inngest",
  "/.redwood/functions/inngest",
];

const authMiddleware = withAuth((req: NextRequest) => {}, {
  callbacks: {
    authorized: ({ req: { cookies, nextUrl } }) => {
      if (whitelist.includes(nextUrl.pathname)) {
        return true;
      }
      const sessionToken = cookies.get(
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      );
      return sessionToken != null;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export default function middleware(req: NextRequest) {
  return (authMiddleware as any)(req);
}
