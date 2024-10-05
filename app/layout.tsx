// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Real Estate App",
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
