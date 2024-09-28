// components/PropertyFilter.tsx

'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PropertyFilter() {
    const router = useRouter();
    const [filters, setFilters] = useState({
        searchQuery: '',
        minPrice: '',
        maxPrice: '',
        minBedrooms: '',
        maxBedrooms: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const applyFilters = () => {
        const query = new URLSearchParams(filters).toString();
        router.push(`/rent?${query}`);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    name="searchQuery"
                    placeholder="Поиск по ключевым словам"
                    value={filters.searchQuery}
                    onChange={handleChange}
                />
                <Input
                    name="minPrice"
                    placeholder="Минимальная цена"
                    type="number"
                    value={filters.minPrice}
                    onChange={handleChange}
                />
                <Input
                    name="maxPrice"
                    placeholder="Максимальная цена"
                    type="number"
                    value={filters.maxPrice}
                    onChange={handleChange}
                />
                <Input
                    name="minBedrooms"
                    placeholder="Минимум спален"
                    type="number"
                    value={filters.minBedrooms}
                    onChange={handleChange}
                />
                <Input
                    name="maxBedrooms"
                    placeholder="Максимум спален"
                    type="number"
                    value={filters.maxBedrooms}
                    onChange={handleChange}
                />
            </div>
            <Button className="mt-4 w-full" onClick={applyFilters}>
                Применить фильтры
            </Button>
        </div>
    );
}