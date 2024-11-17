import dynamic from 'next/dynamic';
import {DataTableBreadcrumbs} from "@/components/ui/data-table-breadcrumbs";
import {UserClient} from "@/components/dashboard/tables/user-table/client";
import {fetchUsers} from "@/services/propertyService";

const PageContainer = dynamic(() => import('@/components/dashboard/layout/PageContainer'));

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
                <DataTableBreadcrumbs items={breadcrumbItems} />
                <UserClient data={users} />
            </div>
        </PageContainer>
    );
}
