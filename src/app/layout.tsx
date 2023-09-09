import Header from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { Inter } from "next/font/google";
import { authOptions } from "./api/auth/[...nextauth]/route";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MTG Collection App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isLogged = session?.user != null;

  return (
    <html lang="en" className="dark w-full">
      <body className={inter.className + " w-full"}>
        {isLogged && (
          <div className="flex-1 space-y-4 p-3 md:p-8 md:pt-6 w-full">
            <Header />
            <div className="flex w-full flex-col md:flex-row">
              <Sidebar />
              <div className="w-full">{children}</div>
            </div>
          </div>
        )}
        {!isLogged && (
          <div className="flex justify-center items-center h-screen">
            {children}
          </div>
        )}
      </body>
    </html>
  );
}
