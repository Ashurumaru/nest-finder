// components/PropertyCard.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import {
    FaBed,
    FaBath,
    FaRulerCombined,
    FaMapMarkerAlt,
    FaTag,
} from 'react-icons/fa';
import { Property } from '@/types/propertyTypes';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
    property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const formattedPrice = property.price?.toLocaleString() || 'Н/Д';
    const imageSrc = property.imageUrls?.[0] || '/images/default-property.jpg';

    return (
        <div className="rounded-xl shadow-md relative bg-white">
            <Image
                width={600}
                height={400}
                src={imageSrc}
                alt={property.title || 'Недвижимость'}
                className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4">
                <div className="text-left mb-4">
                    <div className="text-gray-600 capitalize">{property.property}</div>
                    <h3 className="text-xl font-bold">{property.title}</h3>
                </div>
                <h3 className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg text-blue-500 font-bold">
                    {formattedPrice} ₽
                </h3>
                <div className="flex justify-start gap-4 text-gray-500 mb-4">
                    {property.numBedrooms && (
                        <p className="flex items-center">
                            <FaBed className="inline mr-2" /> {property.numBedrooms}
                        </p>
                    )}
                    {property.numBathrooms && (
                        <p className="flex items-center">
                            <FaBath className="inline mr-2" /> {property.numBathrooms}
                        </p>
                    )}
                    {property.propertySize && (
                        <p className="flex items-center">
                            <FaRulerCombined className="inline mr-2" />
                            {property.propertySize} кв.м
                        </p>
                    )}
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
              {property.city}, {property.address}
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
