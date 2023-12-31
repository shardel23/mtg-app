import Header from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { AxiomWebVitals } from "next-axiom";
import { Inter } from "next/font/google";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MTG Collection App",
  description: "Your place to manage your MTG collection",
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
        <AxiomWebVitals />
        {isLogged && (
          <div className="w-full flex-1 space-y-4">
            <Header />
            <div className="flex w-full flex-col pt-16 md:pl-72 md:pt-20">
              <Sidebar />
              <div className="w-full px-4 py-8 md:px-8 ">
                {children}
                <Analytics />
              </div>
            </div>
          </div>
        )}
        {!isLogged && (
          <div className="flex h-screen items-center justify-center">
            {children}
            <Analytics />
          </div>
        )}
      </body>
    </html>
  );
}
