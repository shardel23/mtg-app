import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";

import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const prismaAdapter = PrismaAdapter(prisma);
// @ts-ignore
prismaAdapter.createUser = async (userData) => {
  const user = await prisma.user.create({
    data: {
      ...userData,
      username: userData.email.split("@")[0],
    },
  });
  await prisma.collection.create({
    data: {
      name: "Default",
      User: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  return user;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
            username: user.username,
          },
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  adapter: prismaAdapter,
};
