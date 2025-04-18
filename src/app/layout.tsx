import Header from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { AxiomWebVitals } from "next-axiom";
import { Inter } from "next/font/google";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SuperMTG - Your MTG Collection Manager",
  description:
    "Manage your Magic: The Gathering collection with ease. Track cards, values, and build better decks with SuperMTG.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isLogged = session?.user != null;

  return (
    <html lang="en" className="dark w-full h-full">
      <body className={inter.className + " h-full"}>
        <AxiomWebVitals />
        {isLogged && (
          <div className="flex h-full space-y-4">
            <Header />
            <div className="flex w-full flex-auto flex-col pt-6 md:pl-72 md:pt-20">
              <Sidebar />
              <div className="w-full h-full px-4 py-8 md:px-8 ">
                {children}
                <Analytics />
                <SpeedInsights />
              </div>
            </div>
          </div>
        )}
        {!isLogged && (
          <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            {children}
            <Analytics />
            <SpeedInsights />
          </div>
        )}
      </body>
    </html>
  );
}
