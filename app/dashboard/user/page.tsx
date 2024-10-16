import dynamic from 'next/dynamic';
import { User } from '@/types/userTypes';
import {Breadcrumbs} from "@/components/dashboard/Breadcrumbs";
import {UserClient} from "@/components/dashboard/tables/user-tables/Client";

const PageContainer = dynamic(() => import('@/components/dashboard/layout/PageContainer'));

async function fetchUsers(): Promise<User[]> {
    try {
        const res = await fetch(`${process.env.API_URL}/api/user`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error('Ошибка при получении данных пользователей');
        }

        const users = await res.json();
        return users;
    } catch (error) {
        console.error(error);
        return [];
    }
}


export default async function UserPage() {
    const users = await fetchUsers();

    if (users.length === 0) {
        return (
            <PageContainer>
                <div className="text-center text-red-500">Пользователи не найдены</div>
            </PageContainer>
        );
    }

    const breadcrumbItems = [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'User', link: '/dashboard/user' },
    ];

    return (
        <PageContainer>
            <div className="space-y-2">
                <Breadcrumbs items={breadcrumbItems} />
                <UserClient data={users} />
            </div>
        </PageContainer>
    );
}
