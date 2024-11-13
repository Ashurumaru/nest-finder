// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NextTopLoader from 'nextjs-toploader';
import { SessionProvider } from "next-auth/react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import React from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Nest-finder",
  description: "Find your dream home",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="ru" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <NextTopLoader showSpinner={true} />
      <SessionProvider>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </SessionProvider>
      <Toaster />
      </body>
      </html>
  );
}
