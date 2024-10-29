'use client';

import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Type } from '@prisma/client'; // Импорт типа из базы данных

// Функция для определения типа недвижимости по пути
const getPropertyTypeFromPath = (path: string): Type => {
    return path.includes('rent') ? Type.RENT : Type.SALE;
};

export default function PropertyFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Определение типа недвижимости на основе пути
    const propertyType = useMemo(() => {
        if (typeof window !== 'undefined') {
            return getPropertyTypeFromPath(window.location.pathname);
        }
        return Type.RENT; // Значение по умолчанию
    }, []);

    const [filters, setFilters] = useState({
        searchQuery: '',
        minPrice: '',
        maxPrice: '',
        minBedrooms: '',
        maxBedrooms: '',
    });

    // Инициализация состояния из параметров поиска (searchParams)
    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());

        setFilters({
            searchQuery: params.searchQuery || '',
            minPrice: params.minPrice || '',
            maxPrice: params.maxPrice || '',
            minBedrooms: params.minBedrooms || '',
            maxBedrooms: params.maxBedrooms || '',
        });
    }, [searchParams]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        const queryParams = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
        ) as Record<string, string>;

        const query = new URLSearchParams(queryParams).toString();
        router.push(`/${propertyType.toLowerCase()}?${query}`);
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
