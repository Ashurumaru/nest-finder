'use client';

import { useEffect, useState } from 'react';
import { PostData } from '@/types/propertyTypes';
import ProfilePropertyCard from "@/components/property/ProfilePropertyCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
            console.log("Начало загрузки данных о недвижимости");

            try {
                setLoading({ sale: true, lease: true });
                setErrors({ sale: null, lease: null });

                const [saleData, leaseData] = await Promise.all([
                    fetchProperties({ userId, type: 'SALE' }),
                    fetchProperties({ userId, type: 'RENT' }),
                ]);

                console.log("Успешно загружено:", {
                    sale: saleData.length,
                    lease: leaseData.length,
                });

                setSaleProperties(saleData);
                setLeasedProperties(leaseData);
            } catch (error) {
                console.error("Ошибка при загрузке данных о недвижимости:", error);
                if (error instanceof Error) {
                    setErrors({
                        sale: error.message.includes("SALE") ? error.message : errors.sale,
                        lease: error.message.includes("RENT") ? error.message : errors.lease,
                    });
                } else {
                    setErrors({ sale: "Неизвестная ошибка", lease: "Неизвестная ошибка" });
                }
            } finally {
                setLoading({ sale: false, lease: false });
                console.log("Завершение загрузки данных о недвижимости");
            }
        };

        fetchAllProperties();
    }, [userId]);

    const handleDeleteProperty = async (propertyId: string) => {
        try {
            console.log(`Удаление недвижимости с ID: ${propertyId}`);
            const response = await fetch(`/api/properties/${propertyId}`, { method: 'DELETE' });

            if (!response.ok) throw new Error('Ошибка при удалении недвижимости');

            setSaleProperties(prev => prev.filter(property => property.id !== propertyId));
            setLeasedProperties(prev => prev.filter(property => property.id !== propertyId));
            console.log(`Недвижимость с ID ${propertyId} успешно удалена`);
        } catch (error) {
            console.error('Ошибка при удалении недвижимости:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Моя недвижимость</h2>
            <Tabs defaultValue="sale">
                <TabsList className="mb-4">
                    <TabsTrigger value="sale">Продаваемая</TabsTrigger>
                    <TabsTrigger value="rent">Сдаваемая в аренду</TabsTrigger>
                </TabsList>

                {/* Вкладка для продаваемой недвижимости */}
                <TabsContent value="sale">
                    {loading.sale ? (
                        <p>Загрузка продаваемой недвижимости...</p>
                    ) : errors.sale ? (
                        <p className="text-red-500">{errors.sale}</p>
                    ) : saleProperties.length === 0 ? (
                        <p>У вас нет продаваемой недвижимости.</p>
                    ) : (
                        <div className="space-y-4">
                            {saleProperties.map((property) => (
                                <ProfilePropertyCard
                                    key={property.id}
                                    property={property}
                                    isOwnProperty={true}
                                    onDelete={handleDeleteProperty}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Вкладка для сдаваемой в аренду недвижимости */}
                <TabsContent value="rent">
                    {loading.lease ? (
                        <p>Загрузка сдаваемой в аренду недвижимости...</p>
                    ) : errors.lease ? (
                        <p className="text-red-500">{errors.lease}</p>
                    ) : leasedProperties.length === 0 ? (
                        <p>У вас нет сдаваемой в аренду недвижимости.</p>
                    ) : (
                        <div className="space-y-4">
                            {leasedProperties.map((property) => (
                                <LeasedPropertyCard
                                    key={property.id}
                                    property={property}
                                    onDelete={handleDeleteProperty}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
