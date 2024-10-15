import Header from '@/components/Dashboard/layout/header';
import Sidebar from '@/components/Dashboard/layout/sidebar';
import type { Metadata } from 'next';

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
            <Sidebar />
            <main className="w-full flex-1 overflow-hidden">
                <Header />
                {children}
            </main>
        </div>
    );
}
