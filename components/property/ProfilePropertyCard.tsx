'use client';

import React from 'react';
import Link from 'next/link';
import {
    FaBed,
    FaBath,
    FaRulerCombined,
    FaMapMarkerAlt,
    FaTag,
    FaEdit,
    FaTrash,
} from 'react-icons/fa';
import { PostData } from '@/types/propertyTypes';
import Image from 'next/image';
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

interface PropertyCardProps {
    property: PostData;
    isOwnProperty?: boolean; // Флаг, указывающий, своя ли это недвижимость или избранное
    onDelete: (id: string) => void; // Логика удаления
}

const ProfilePropertyCard: React.FC<PropertyCardProps> = ({ property, isOwnProperty = true, onDelete }) => {
    const formattedPrice = property.price?.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }) || 'Н/Д';
    const imageSrc = property.imageUrls?.[0] || '/images/default-property.jpg';

    const confirmDelete = () => {
        if (property.id != null) {
            onDelete(property.id);
        }
    };

    const propertyType = {
        APARTMENT: "Квартира",
        HOUSE: "Дом",
        LAND_PLOT: "Земельный участок"
    }[property.property] || "Неизвестная недвижимость";

    return (
        <div className="relative bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Изображение недвижимости */}
            <div className="relative w-full md:w-2/3">
                <Image
                    width={900}
                    height={600}
                    src={imageSrc}
                    alt={property.title || 'Недвижимость'}
                    className="w-full h-60 md:h-80 object-cover rounded-lg"
                />

                {/* Цена в правом верхнем углу изображения */}
                <div className="absolute top-4 left-4 bg-white text-blue-500 font-bold px-4 py-2 rounded-lg shadow-md">
                    {formattedPrice}
                </div>
            </div>

            {/* Информация о недвижимости */}
            <div className="w-full md:w-1/3">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">{property.title}</h3>
                    <div className="flex space-x-2">
                        {/* Если это своя недвижимость, показываем иконку редактирования */}
                        {isOwnProperty && (
                            <Link href={`/properties/${property.id}/update`}>
                                <FaEdit className="text-gray-600 hover:text-blue-500 cursor-pointer" size={20} />
                            </Link>
                        )}

                        {/* Удалить (доступно как для своей недвижимости, так и для избранного) */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <FaTrash className="text-gray-600 hover:text-red-500 cursor-pointer" size={20} />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {isOwnProperty
                                            ? "Вы уверены, что хотите удалить это объявление?"
                                            : "Вы уверены, что хотите удалить это из избранного?"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {isOwnProperty
                                            ? "Это действие нельзя будет отменить. Объявление будет удалено навсегда."
                                            : "Это действие нельзя будет отменить. Недвижимость будет удалена из избранного."}
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

                <div className="text-gray-600 capitalize mb-2">
                    {propertyType}
                </div>

                {/* Основные параметры */}
                <div className="flex space-x-4 text-gray-500 mb-4">
                    {/* Параметры для квартиры */}
                    {property.property === 'APARTMENT' && (
                        <>
                            {property.apartment?.numBedrooms && (
                                <p className="flex items-center">
                                    <FaBed className="inline mr-2" /> {property.apartment.numBedrooms} Спальни
                                </p>
                            )}
                            {property.apartment?.numBathrooms && (
                                <p className="flex items-center">
                                    <FaBath className="inline mr-2" /> {property.apartment.numBathrooms} Ванные
                                </p>
                            )}
                            {property.apartment?.floorNumber && (
                                <p className="flex items-center">
                                    <FaRulerCombined className="inline mr-2" /> {property.apartment.floorNumber} этаж
                                </p>
                            )}
                        </>
                    )}

                    {/* Параметры для дома */}
                    {property.property === 'HOUSE' && (
                        <>
                            {property.house?.numberOfRooms && (
                                <p className="flex items-center">
                                    <FaBed className="inline mr-2" /> {property.house.numberOfRooms} Комнаты
                                </p>
                            )}
                            {property.house?.houseArea && (
                                <p className="flex items-center">
                                    <FaRulerCombined className="inline mr-2" /> {property.house.houseArea} кв.м
                                </p>
                            )}
                        </>
                    )}

                    {/* Параметры для земельного участка */}
                    {property.property === 'LAND_PLOT' && (
                        <>
                            {property.landPlot?.landArea && (
                                <p className="flex items-center">
                                    <FaRulerCombined className="inline mr-2" /> {property.landPlot.landArea} соток
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Тип и адрес */}
                <div className="flex items-center text-green-900 text-sm mb-4">
                    <FaTag className="mr-2" />
                    {property.type === 'RENT' ? 'Аренда' : 'Продажа'}
                </div>

                <div className="flex items-center text-orange-700 mb-2">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{property.city}, {property.address}</span>
                </div>

                <p className="text-gray-700 mb-4">
                    {property.description
                        ? `${property.description.substring(0, 100)}${property.description.length > 100 ? '...' : ''}`
                        : 'Описание отсутствует'}
                </p>

                <div className="flex justify-between items-center">
                    <Link href={`/properties/${property.id}`}>
                        <Button>Подробнее</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfilePropertyCard;
