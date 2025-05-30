'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import { DataTableBreadcrumbs } from '@/components/ui/data-table-breadcrumbs';
import { UserForm } from '@/components/dashboard/form/UserForm';

const PageContainer = dynamic(() => import('@/components/dashboard/layout/PageContainer'));

export default function CreateUserPage() {
    const breadcrumbItems = useMemo(() => [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'User', link: '/dashboard/user' },
        { title: 'Create New User', link: '/dashboard/user/new' }
    ], []);

    return (
        <PageContainer scrollable={true}>
            <div className="space-y-4">
                <DataTableBreadcrumbs items={breadcrumbItems} />
                <UserForm initialData={null} />  {/* Передаем null для создания нового пользователя */}
            </div>
        </PageContainer>
    );
}
