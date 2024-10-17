'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import { Breadcrumbs } from '@/components/dashboard/Breadcrumbs';
import { UserForm } from '@/components/dashboard/form/UserForm';

const PageContainer = dynamic(() => import('@/components/dashboard/PageContainer'));

export default function CreateUserPage() {
    const breadcrumbItems = useMemo(() => [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'User', link: '/dashboard/user' },
        { title: 'Create New User', link: '/dashboard/user/new' }
    ], []);

    return (
        <PageContainer scrollable={true}>
            <div className="space-y-4">
                <Breadcrumbs items={breadcrumbItems} />
                <UserForm initialData={null} />  {/* Передаем null для создания нового пользователя */}
            </div>
        </PageContainer>
    );
}
