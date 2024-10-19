'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import { DataTableBreadcrumbs } from '@/components/ui/data-table-breadcrumbs';
import { PropertyForm } from '@/components/dashboard/form/PropertyForm';

const PageContainer = dynamic(() => import('@/components/dashboard/layout/PageContainer'));

export default function CreatePropertyPage() {
    const breadcrumbItems = useMemo(() => [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Property', link: '/dashboard/property' },
        { title: 'Create New Property', link: '/dashboard/property/new' }
    ], []);

    return (
        <PageContainer scrollable={true}>
            <div className="space-y-4">
                <DataTableBreadcrumbs items={breadcrumbItems} />
                <PropertyForm initialData={null} />
            </div>
        </PageContainer>
    );
}
