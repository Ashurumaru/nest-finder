'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
    editPath: (id: string) => string;
    archiveApiPath: (id: string) => string;
}

export function DataTableRowActions<TData extends { id?: string }>({
                                                                       row,
                                                                       editPath,
                                                                       archiveApiPath,
                                                                   }: DataTableRowActionsProps<TData>) {
    const router = useRouter();
    const item = row.original;

    const handleEdit = () => {
        if (item.id) {
            router.push(editPath(item.id));
        } else {
            console.error('Item ID is undefined');
        }
    };

    const handleArchive = async () => {
        if (!item.id) {
            console.error('Item ID is undefined');
            return;
        }

        try {
            const response = await fetch(archiveApiPath(item.id), {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to archive item');
            }

            router.refresh();
        } catch (error) {
            console.error('Error archiving item:', error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleArchive}>Archive</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
