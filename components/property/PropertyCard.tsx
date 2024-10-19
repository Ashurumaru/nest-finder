'use client';

import React from 'react';
import Link from 'next/link';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import { PostData } from '@/types/propertyTypes';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
    property: PostData;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const formattedPrice = property.price
        ? `${property.price.toLocaleString('ru-RU')} ₽`
        : 'Н/Д';

    const imageSrc = property.imageUrls?.[0] || '/images/default-property.jpg';

    const propertyType = {
        apartment: 'Квартира',
        house: 'Дом',
        condo: 'Кондо',
        townhouse: 'Таунхаус',
        commercial: 'Коммерческая недвижимость',
        land: 'Земельный участок',
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
                <div className="flex justify-start gap-4 text-gray-500 mb-4">
                    <p className="flex items-center">
                        <FaBed className="inline mr-2" /> {property.numBedrooms || 'Н/Д'} Спальни
                    </p>
                    <p className="flex items-center">
                        <FaBath className="inline mr-2" /> {property.numBathrooms || 'Н/Д'} Ванные
                    </p>
                    <p className="flex items-center">
                        <FaRulerCombined className="inline mr-2" /> {property.propertySize || 'Н/Д'} кв.м
                    </p>
                </div>
                <div className="flex items-center text-green-900 text-sm mb-4">
                    <FaTag className="mr-2" />
                    {property.type === 'rent' ? 'Аренда' : 'Продажа'}
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
