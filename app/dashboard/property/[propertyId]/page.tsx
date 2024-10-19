'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DataTableBreadcrumbs } from '@/components/ui/data-table-breadcrumbs';
import { PropertyForm } from '@/components/dashboard/form/PropertyForm';
import { PropertyDB } from '@/types/propertyTypes';

const PageContainer = dynamic(() => import('@/components/dashboard/layout/PageContainer'));

async function fetchProperty(id: string): Promise<PropertyDB | null> {
    try {
        const res = await fetch(` /api/properties/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            return null;
        }

        return await res.json();
    } catch {
        return null;
    }
}

export default function EditPropertyPage({ params }: { params: { propertyId: string } }) {
    const [property, setProperty] = useState<PropertyDB | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function loadProperty() {
            const fetchedProperty = await fetchProperty(params.propertyId);
            if (!fetchedProperty) {
                router.push('/dashboard/property');
            } else {
                setProperty(fetchedProperty);
            }
        }

        loadProperty();
    }, [params.propertyId, router]);

    const breadcrumbItems = useMemo(() => [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Property', link: '/dashboard/property' },
        { title: property ? `Edit: ${property.title}` : 'Create New Property' },
    ], [property]);

    if (!property) {
        return <div>Loading...</div>;
    }

    return (
        <PageContainer scrollable={true}>
            <div className="space-y-4">
                <DataTableBreadcrumbs items={breadcrumbItems} />
                <PropertyForm initialData={property} />
            </div>
        </PageContainer>
    );
}
