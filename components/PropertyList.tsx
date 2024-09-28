// components/PropertyList.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PropertyCard from './PropertyCard';
import PropertyFilter from './PropertyFilter';
import { Property } from '@/types/propertyTypes';

interface FiltersState {
    searchQuery: string;
    minPrice: string;
    maxPrice: string;
    minBedrooms: string;
    maxBedrooms: string;
}

interface PropertyListProps {
    initialProperties: Property[];
}

export default function PropertyList({ initialProperties }: PropertyListProps) {
    const [properties, setProperties] = useState<Property[]>(initialProperties);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchProperties = async () => {
            const params = Object.fromEntries(searchParams.entries());
            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'rent', ...params }),
            });
            const data = await res.json();
            setProperties(data);
        };

        fetchProperties();
    }, [searchParams]);

    return (
        <>
            <PropertyFilter />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </>
    );
}
