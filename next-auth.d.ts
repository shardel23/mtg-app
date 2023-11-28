import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}
