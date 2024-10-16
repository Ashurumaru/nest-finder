"use client"

import dynamic from 'next/dynamic';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/components/dashboard/Breadcrumbs';
import { UserForm } from '@/components/dashboard/form/UserForm';
import { User } from '@/types/userTypes';

const PageContainer = dynamic(() => import('@/components/dashboard/layout/PageContainer'));

async function fetchUser(userId: string): Promise<User | null> {
    try {
        const res = await fetch(`/api/user/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            throw new Error('User not found');
        }

        const user = await res.json();
        return user;
    } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error);
        return null;
    }
}

export default function Page({ params }: { params: { userId: string } }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function loadUser() {
            const fetchedUser = await fetchUser(params.userId);
            if (!fetchedUser) {
                router.push('/dashboard/user');
            } else {
                setUser(fetchedUser);
            }
        }

        loadUser();
    }, [params.userId, router]);

    const breadcrumbItems = useMemo(() => [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'User', link: '/dashboard/user' },
        { title: user ? `Edit: ${user.name}` : 'Create New User' },
    ], [user]);

    if (!user) {
        return <div>Loading...</div>;  // Спиннер или сообщение о загрузке
    }

    return (
        <PageContainer scrollable={true}>
            <div className="space-y-4">
                <Breadcrumbs items={breadcrumbItems} />
                <UserForm initialData={user} />
            </div>
        </PageContainer>
    );
}
