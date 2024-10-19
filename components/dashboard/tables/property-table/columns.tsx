'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyDB } from '@/types/propertyTypes';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DataTableRowActions } from '@/components/ui/data-table-row-actions';
import Image from 'next/image';

export const columns: ColumnDef<PropertyDB>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => <span>{row.getValue('title')}</span>,
    },
    {
        accessorKey: 'price',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => `${row.getValue('price')} ₽`,
    },
    {
        accessorKey: 'city',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="City" />
        ),
        cell: ({ row }) => row.original.city || 'N/A',
    },
    {
        accessorKey: 'address',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Address" />
        ),
        cell: ({ row }) => row.original.address || 'N/A',
    },
    {
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => row.original.description || 'N/A',
    },
    {
        accessorKey: 'imageUrls',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Image" />
        ),
        cell: ({ row }) =>
            row.original.imageUrls && row.original.imageUrls.length ? (
                <Image
                    src={row.original.imageUrls[0]}
                    alt="Property image"
                    width={64}  // 16 * 4 = 64px
                    height={64}  // 16 * 4 = 64px
                    className="w-16 h-16 object-cover rounded-md"
                />
            ) : (
                'N/A'
            ),
    },
    {
        accessorKey: 'createdAt',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Created At"/>
        ),
        cell: ({row}) => {
            const createdAt = row.original.createdAt;
            return createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A';
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <DataTableRowActions
                row={row}
                editPath={(id) => `/dashboard/property/${id}`}
                deleteApiPath={(id) => `/api/properties/${id}`}
            />
        ),
    }

];
