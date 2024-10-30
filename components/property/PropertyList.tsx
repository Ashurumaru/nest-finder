'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from './PropertyCard';
import PropertyFilter from './PropertyFilter';
import { PostData } from '@/types/propertyTypes';
import { Type } from '@prisma/client';

interface PropertyListProps {
    initialProperties: PostData[];
    propertyType: Type;
}

export default function PropertyList({ initialProperties, propertyType }: PropertyListProps) {
    return (
        <>
            <PropertyFilter propertyType={propertyType} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialProperties.length > 0 ? (
                    initialProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))
                ) : (
                    <p className="col-span-3 text-center">Ничего не найдено</p>
                )}
            </div>
        </>
    );
}
