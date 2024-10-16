import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import {Breadcrumbs} from "@/components/dashboard/Breadcrumbs";
import {UserForm} from "@/components/dashboard/form/UserForm";

const PageContainer = dynamic(() => import('@/components/dashboard/layout/PageContainer'));

export default function Page() {
    const breadcrumbItems = useMemo(() => [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'User', link: '/dashboard/user' },
        { title: 'Create', link: '/dashboard/user/create' }
    ], []);

    return (
        <PageContainer scrollable={true}>
            <div className="space-y-4">
                <Breadcrumbs items={breadcrumbItems} />
                <UserForm initialData={null} />
            </div>
        </PageContainer>
    );
}
