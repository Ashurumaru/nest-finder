import dynamic from 'next/dynamic';
import NextTopLoader from "nextjs-toploader";
import type { Metadata } from 'next';
import React from "react";

const Sidebar = dynamic(() => import('@/components/dashboard/Sidebar'), {
    ssr: false,
});

const AdminGuard = dynamic(() => import('@/components/admin/AdminGuard'), {
    ssr: false,
});

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Not for users',
};

export default function DashboardLayout({
                                            children,
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
