'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from './data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { PropertyDB } from '@/types/propertyTypes';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';

interface PropertyClientProps {
    data: PropertyDB[];
}

export const PropertyClient: React.FC<PropertyClientProps> = ({ data }) => {
    const router = useRouter();

    return (
        <>
            <div className="flex items-start justify-between">
                <Heading
                    title={`Properties (${data.length})`}
                    description="Manage properties"
                />
                <Button
                    className="text-xs md:text-sm"
                    onClick={() => router.push(`/dashboard/property/new`)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Add New Property
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} />
        </>
    );
};
