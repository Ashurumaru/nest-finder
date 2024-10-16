import Header from '@/components/Dashboard/layout/Header';
import Sidebar from '@/components/Dashboard/layout/Sidebar';
import NextTopLoader from "nextjs-toploader";
import { SessionProvider } from "next-auth/react";
import type { Metadata } from 'next';
import AdminGuard from '@/components/AdminGuard';
import React from "react";

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Not for users'
};

export default function DashboardLayout({
                                            children
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            <NextTopLoader showSpinner={true} />
            <AdminGuard>
                <Sidebar />
                <main className="w-full flex-1 overflow-hidden">
                        {children}
                </main>
            </AdminGuard>
        </div>
    );
}
