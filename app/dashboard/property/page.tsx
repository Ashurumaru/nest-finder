import dynamic from 'next/dynamic';
import {PropertyDB} from '@/types/propertyTypes';
import {DataTableBreadcrumbs} from '@/components/ui/data-table-breadcrumbs';
import {PropertyClient} from '@/components/dashboard/tables/property-table/client';

const PageContainer = dynamic(() => import('@/components/dashboard/layout/PageContainer'));

async function fetchProperties(): Promise<PropertyDB[]> {
    try {
        const res = await fetch(`${process.env.API_URL}/api/properties`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error('Ошибка при получении данных недвижимости');
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function PropertyPage() {
    const properties = await fetchProperties();

    if (properties.length === 0) {
        return (
            <PageContainer>
                <div className="text-center text-red-500">Недвижимость не найдена</div>
            </PageContainer>
        );
    }

    const breadcrumbItems = [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Property', link: '/dashboard/property' },
    ];

    return (
        <PageContainer>
            <div className="space-y-2">
                <DataTableBreadcrumbs items={breadcrumbItems} />
                <PropertyClient data={properties} />
            </div>
        </PageContainer>
    );
}
