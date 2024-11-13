// SelledPropertyCard.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PostData } from '@/types/propertyTypes';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaTag } from 'react-icons/fa';

interface PropertyCardProps {
    property: PostData;
    isOwnProperty?: boolean;
    onDelete: (id: string) => void;
}

const SelledPropertyCard: React.FC<PropertyCardProps> = ({ property, isOwnProperty = true, onDelete }) => {
    const formattedPrice = property.price?.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }) || 'Н/Д';
    const imageSrc = property.imageUrls?.[0] || '/images/default-property.jpg';

    const confirmDelete = () => {
        if (property.id) onDelete(property.id);
    };

    const propertyType = {
        APARTMENT: "Квартира",
        HOUSE: "Дом",
        LAND_PLOT: "Земельный участок"
    }[property.property] || "Неизвестная недвижимость";

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                <Image
                    src={imageSrc}
                    alt={property.title || 'Недвижимость'}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />
                <div className="absolute top-4 left-4 bg-white text-blue-500 font-bold px-4 py-2 rounded-lg shadow-md">
                    {formattedPrice}
                </div>
            </div>

            <div className="w-full md:w-2/3 space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">{property.title}</h3>
                <div className="text-sm font-medium text-gray-600 capitalize">
                    {propertyType}
                </div>

                <div className="flex space-x-4 text-gray-500 mt-2">
                    {property.property === 'APARTMENT' && (
                        <>
                            <p className="flex items-center">
                                <FaBed className="text-green-500 mr-2" /> {property.apartment?.numBedrooms} Спальни
                            </p>
                            <p className="flex items-center">
                                <FaBath className="text-blue-400 mr-2" /> {property.apartment?.numBathrooms} Ванные
                            </p>
                            <p className="flex items-center">
                                <FaRulerCombined className="text-yellow-500 mr-2" /> {property.apartment?.floorNumber} этаж
                            </p>
                        </>
                    )}
                    {property.property === 'HOUSE' && (
                        <>
                            <p className="flex items-center">
                                <FaBed className="text-green-500 mr-2" /> {property.house?.numberOfRooms} Комнаты
                            </p>
                            <p className="flex items-center">
                                <FaRulerCombined className="text-yellow-500 mr-2" /> {property.house?.houseArea} кв.м
                            </p>
                        </>
                    )}
                    {property.property === 'LAND_PLOT' && (
                        <>
                            <p className="flex items-center">
                                <FaRulerCombined className="text-yellow-500 mr-2" /> {property.landPlot?.landArea} соток
                            </p>
                        </>
                    )}
                </div>

                <div className="text-sm text-gray-600 mt-2">
                    <div className="flex items-center">
                        <FaMapMarkerAlt className="text-orange-600 mr-2" />
                        <span>{property.address}</span>
                    </div>
                    <div className="flex items-center mt-2 text-green-800">
                        <FaTag className="mr-2" />
                        <span>{property.type === 'RENT' ? 'Аренда' : 'Продажа'}</span>
                    </div>
                </div>

                <p className="text-gray-700 mt-2">
                    {property.description
                        ? `${property.description.substring(0, 100)}${property.description.length > 100 ? '...' : ''}`
                        : 'Описание отсутствует'}
                </p>

                <div className="flex justify-between items-center mt-6 space-x-4">
                    <Link href={`/properties/${property.id}`}>
                        <Button variant="primary">Подробнее</Button>
                    </Link>

                    {isOwnProperty && (
                        <Button asChild variant="secondary">
                            <Link href={`/properties/${property.id}/update`}><FaEdit className="mr-2" />Редактировать</Link>
                        </Button>
                    )}

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><FaTrash className="mr-2" />Удалить</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{isOwnProperty ? "Удалить это объявление?" : "Удалить из избранного?"}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {isOwnProperty
                                        ? "Это действие нельзя отменить. Объявление будет удалено навсегда."
                                        : "Это действие нельзя отменить. Недвижимость будет удалена из избранного."}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmDelete}>Удалить</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
};

export default SelledPropertyCard;
