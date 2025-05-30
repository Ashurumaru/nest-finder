'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PostData } from '@/types/propertyTypes';
import { Button } from '@/components/ui/button';
import { FaBath, FaBed, FaMapMarkerAlt, FaRulerCombined, FaTag } from "react-icons/fa";

interface PropertyCardProps {
    property: PostData;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const formattedPrice = property.price
        ? `${property.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}`
        : 'Н/Д';

    const imageSrc = property.imageUrls?.[0] || '/images/default-property.jpg';

    const propertyType = {
        APARTMENT: 'Квартира',
        HOUSE: 'Дом',
        LAND_PLOT: 'Земельный участок',
    }[property.property] || 'Неизвестная недвижимость';

    return (
        <div className="rounded-xl shadow-md relative bg-white flex flex-col h-full">
            <div className="w-full h-[200px]">
                <Image
                    width={600}
                    height={400}
                    src={imageSrc}
                    alt={property.title || 'Недвижимость'}
                    className="object-cover w-full h-full rounded-t-xl"
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold">{property.title || 'Н/Д'}</h3>
                <div className="text-gray-600 mb-4 capitalize flex items-center">
                    <FaTag className="mr-2" />
                    {propertyType}
                </div>
                <h3 className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg text-blue-500 font-bold">
                    {formattedPrice}
                </h3>

                {property.property === 'APARTMENT' && (
                    <div className="flex justify-start gap-4 text-gray-500 mb-4">
                        <p className="flex items-center">
                            <FaBed className="inline mr-2" /> {property.apartment?.numBedrooms || 'Н/Д'} Комнат
                        </p>
                        <p className="flex items-center">
                            <FaBath className="inline mr-2" /> {property.apartment?.numBathrooms || 'Н/Д'} Ванные
                        </p>
                        <p className="flex items-center">
                            <FaRulerCombined className="inline mr-2" /> {property.apartment?.apartmentArea || 'Н/Д'} кв.м
                        </p>
                    </div>
                )}

                {property.property === 'HOUSE' && (
                    <div className="flex justify-start gap-4 text-gray-500 mb-4">
                        <p className="flex items-center">
                            <FaBed className="inline mr-2" /> {property.house?.numberOfRooms || 'Н/Д'} Комнат
                        </p>
                        <p className="flex items-center">
                            <FaRulerCombined className="inline mr-2" /> {property.house?.houseArea || 'Н/Д'} кв.м
                        </p>
                        <p className="flex items-center">
                            <FaRulerCombined className="inline mr-2" /> {property.house?.landArea || 'Н/Д'} соток
                        </p>
                    </div>
                )}

                {property.property === 'LAND_PLOT' && (
                    <div className="flex justify-start gap-4 text-gray-500 mb-4">
                        <p className="flex items-center">
                            <FaRulerCombined className="inline mr-2" /> {property.landPlot?.landArea || 'Н/Д'} соток
                        </p>
                    </div>
                )}

                <div className="flex items-center text-green-900 text-sm mb-4">
                    <FaTag className="mr-2" />
                    {property.type === 'RENT' ? 'Аренда' : 'Продажа'}
                </div>
                <div className="border border-gray-100 mb-5" />
                <div className="flex flex-col lg:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 lg:mb-0">
                        <FaMapMarkerAlt className="text-lg text-orange-700" />
                        <span className="text-orange-700">
              {property.city || 'Н/Д'}, {property.address || 'Н/Д'}
            </span>
                    </div>
                    <Link href={`/properties/${property.id}`}>
                        <Button>Подробнее</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;