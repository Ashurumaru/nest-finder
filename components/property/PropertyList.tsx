'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from './PropertyCard';
import PropertyFilter from './PropertyFilter';
import { PostData } from '@/types/propertyTypes';
import { toNumber } from '@/utils/toNumber';
import {Type} from "@prisma/client";

interface PropertyListProps {
    initialProperties: PostData[];
    propertyType: Type;
}

export default function PropertyList({ initialProperties, propertyType }: PropertyListProps) {
    const searchParams = useSearchParams();

    const filteredProperties = useMemo(() => {
        const params = Object.fromEntries(searchParams.entries());

        return initialProperties.filter((property) => {
            const matchesType = property.type === propertyType;
            const matchesMinBedrooms = params.minBedrooms
                ? property.apartment?.numBedrooms >= Number(params.minBedrooms)
                : true;
            const matchesMaxBedrooms = params.maxBedrooms
                ? property.apartment?.numBedrooms <= Number(params.maxBedrooms)
                : true;
            const matchesMinPrice = params.minPrice
                ? toNumber(property.price) >= Number(params.minPrice)
                : true;
            const matchesMaxPrice = params.maxPrice
                ? toNumber(property.price) <= Number(params.maxPrice)
                : true;
            const matchesLocation = params.searchQuery
                ? property.city.toLowerCase().includes(params.searchQuery.toLowerCase())
                : true;

            return (
                matchesType &&
                matchesMinBedrooms &&
                matchesMaxBedrooms &&
                matchesMinPrice &&
                matchesMaxPrice &&
                matchesLocation
            );
        });
    }, [initialProperties, searchParams, propertyType]);

    return (
        <>
            <PropertyFilter />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </>
    );
}