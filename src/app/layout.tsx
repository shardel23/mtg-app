import { Sidebar } from "@/components/sidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MTG Collection App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark w-full">
      <body className={inter.className + " w-full"}>
        <div className="flex-1 space-y-4 p-8 pt-6 w-full">
          <div className="font-bold text-4xl">
            <Link href={`/`}>MTG Collection</Link>
          </div>
          <div className="flex w-full">
            <Sidebar />
            <div className="w-full">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
