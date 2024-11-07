// app/dashboard/property/[propertyId]/page.tsx

'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { DataTableBreadcrumbs } from '@/components/ui/data-table-breadcrumbs';
import CreateUpdateProperty from '@/components/property/create-property/CreateUpdateProperty';

const PageContainer = dynamic(() =>
    import('@/components/dashboard/layout/PageContainer')
);

export default function EditPropertyPage() {
    const pathname = usePathname();
    const propertyId = pathname.split('/').pop();

    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (propertyId) {
            console.log(`Fetching property with ID: ${propertyId}`);

            fetch(`/api/properties/${propertyId}`)
                .then(async (res) => {
                    if (!res.ok) {
                        const { message } = await res.json();
                        throw new Error(message || 'Failed to fetch property.');
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log('Property data:', data);
                    setProperty(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error fetching property:', err);
                    setError(err.message || 'Failed to fetch property.');
                    setLoading(false);
                });
        } else {
            console.warn('Property ID is missing from the URL.');
            setError('Invalid property ID.');
            setLoading(false);
        }
    }, [propertyId]);

    const breadcrumbItems = useMemo(
        () => [
            { title: 'Dashboard', link: '/dashboard' },
            { title: 'Property', link: '/dashboard/property' },
            { title: property ? `Edit: ${property.title}` : 'Create New Property' },
        ],
        [property]
    );

    if (loading) return <div>Loading...</div>;

    if (error) return <div>{error}</div>;

    if (!property) return <div>Property not found</div>;

    return (
        <PageContainer scrollable={true}>
            <div className="space-y-4">
                <DataTableBreadcrumbs items={breadcrumbItems} />
                <CreateUpdateProperty initialData={property} />
            </div>
        </PageContainer>
    );
}
