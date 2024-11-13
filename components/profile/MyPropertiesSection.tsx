// MyPropertiesSection.tsx

'use client';

import { useEffect, useState } from 'react';
import { PostData } from '@/types/propertyTypes';
import SelledPropertyCard from "@/components/property/SelledPropertyCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProperties } from "@/services/propertyService";
import LeasedPropertyCard from "@/components/property/LeasedPropertyCard";

interface MyPropertiesSectionProps {
    userId: string;
}

export default function MyPropertiesSection({ userId }: MyPropertiesSectionProps) {
    const [saleProperties, setSaleProperties] = useState<PostData[]>([]);
    const [leasedProperties, setLeasedProperties] = useState<PostData[]>([]);
    const [loading, setLoading] = useState({ sale: true, lease: true });
    const [errors, setErrors] = useState<{ sale: string | null; lease: string | null }>({ sale: null, lease: null });

    useEffect(() => {
        const fetchAllProperties = async () => {
            try {
                setLoading({ sale: true, lease: true });
                setErrors({ sale: null, lease: null });

                const [saleData, leaseData] = await Promise.all([
                    fetchProperties({ userId, type: 'SALE' }),
                    fetchProperties({ userId, type: 'RENT' }),
                ]);

                setSaleProperties(saleData);
                setLeasedProperties(leaseData);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
                setErrors({
                    sale: errorMessage.includes("SALE") ? errorMessage : null,
                    lease: errorMessage.includes("RENT") ? errorMessage : null,
                });
            } finally {
                setLoading({ sale: false, lease: false });
            }
        };

        fetchAllProperties();
    }, [userId]);

    const handleDeleteProperty = async (propertyId: string) => {
        try {
            const response = await fetch(`/api/properties/${propertyId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Ошибка при удалении недвижимости');

            setSaleProperties((prev) => prev.filter((property) => property.id !== propertyId));
            setLeasedProperties((prev) => prev.filter((property) => property.id !== propertyId));
        } catch (error) {
            console.error('Ошибка при удалении недвижимости:', error);
        }
    };

    const renderProperties = (properties: PostData[], isSale: boolean) => (
        <div className="space-y-4">
            {properties.map((property) => (
                isSale ? (
                    <SelledPropertyCard
                        key={property.id}
                        property={property}
                        isOwnProperty={true}
                        onDelete={handleDeleteProperty}
                    />
                ) : (
                    <LeasedPropertyCard
                        key={property.id}
                        property={property}
                        onDelete={handleDeleteProperty}
                    />
                )
            ))}
        </div>
    );

    return (
        <section>
            <h2 className="text-2xl font-bold mb-4">Моя недвижимость</h2>
            <Tabs defaultValue="sale">
                <TabsList className="mb-4">
                    <TabsTrigger value="sale">Продаваемая</TabsTrigger>
                    <TabsTrigger value="rent">Сдаваемая в аренду</TabsTrigger>
                </TabsList>

                <TabsContent value="sale">
                    {loading.sale ? (
                        <Skeleton className="h-24 w-full" />
                    ) : errors.sale ? (
                        <p className="text-red-500">{errors.sale}</p>
                    ) : saleProperties.length === 0 ? (
                        <p>У вас нет продаваемой недвижимости.</p>
                    ) : (
                        renderProperties(saleProperties, true)
                    )}
                </TabsContent>

                <TabsContent value="rent">
                    {loading.lease ? (
                        <Skeleton className="h-24 w-full" />
                    ) : errors.lease ? (
                        <p className="text-red-500">{errors.lease}</p>
                    ) : leasedProperties.length === 0 ? (
                        <p>У вас нет сдаваемой в аренду недвижимости.</p>
                    ) : (
                        renderProperties(leasedProperties, false)
                    )}
                </TabsContent>
            </Tabs>
        </section>
    );
}
