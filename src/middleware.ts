import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

const authMiddleware = withAuth((req: NextRequest) => {}, {
  callbacks: {
    authorized: ({ req: { cookies } }) => {
      const sessionToken = cookies.get("next-auth.session-token");
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
