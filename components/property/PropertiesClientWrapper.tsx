'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Type } from '@prisma/client';

interface PropertiesClientWrapperProps {
    children: ReactNode;
    selectedType: Type;
    searchParams: Record<string, string | string[] | undefined>;
}

export function PropertiesClientWrapper({
                                            children,
                                            selectedType,
                                            searchParams
                                        }: PropertiesClientWrapperProps) {
    const router = useRouter();

    // Handle tab change by preserving existing search params
    const handleTabChange = (value: string) => {
        const params = new URLSearchParams();

        // Preserve all current search params
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value && key !== 'type') {
                params.set(key, value.toString());
            }
        });

        // Set the new type
        params.set('type', value);

        // Navigate to the new URL
        router.push(`/properties?${params.toString()}`);
    };

    return (
        <Tabs
            defaultValue={selectedType}
            className="w-full mb-8"
            onValueChange={handleTabChange}
        >
            <div className="flex justify-center mb-6">
                <TabsList className="w-[400px] grid grid-cols-2 p-1.5">
                    <TabsTrigger
                        value={Type.SALE}
                        className="text-base font-medium py-3 data-[state=active]:font-semibold relative"
                    >
                        Купить
                    </TabsTrigger>
                    <TabsTrigger
                        value={Type.RENT}
                        className="text-base font-medium py-3 data-[state=active]:font-semibold relative"
                    >
                        Арендовать
                    </TabsTrigger>
                </TabsList>
            </div>

            {children}
        </Tabs>
    );
}