'use client';

import React from 'react';
import Link from 'next/link';
import { FaBed, FaBath, FaRulerCombined, FaMapMarker, FaMoneyBill } from "react-icons/fa";
import { Property } from '@/types/propertyTypes';
import Image from 'next/image';

interface PropertyCardProps {
    property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const formattedPrice = property.price?.toLocaleString() || "Н/Д"; // "Н/Д" вместо "N/A"
    const imageSrc = property.imageUrls?.[0] || '/images/default-property.jpg';

    return (
        <div className="rounded-xl shadow-md relative">
            <Image
                width={600}
                height={400}
                src={imageSrc}
                alt={property.title || "Недвижимость"}
                className="w-full h-auto rounded-t-xl"
            />
            <div className="p-4">
                <div className="text-left md:text-center lg:text-left mb-6">
                    <div className="text-gray-600 capitalize">{property.property}</div>
                    <h3 className="text-xl font-bold">{property.title}</h3>
                </div>
                <h3 className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right">
                    {formattedPrice} ₽
                </h3>
                <div className="flex justify-center gap-4 text-gray-500 mb-4">
                    {property.numBedrooms && (
                        <p>
                            <FaBed className="inline mr-2" /> {property.numBedrooms}
                            <span className="md:hidden lg:inline"> Спальни</span>
                        </p>
                    )}
                    {property.numBathrooms && (
                        <p>
                            <FaBath className="inline mr-2" /> {property.numBathrooms}
                            <span className="md:hidden lg:inline"> Ванные</span>
                        </p>
                    )}
                    {property.postDetail?.propertySize && (
                        <p>
                            <FaRulerCombined className="inline mr-2" />
                            {property.postDetail.propertySize} <span className="md:hidden lg:inline"> кв. м</span>
                        </p>
                    )}
                </div>
                <div className="flex justify-center gap-4 text-green-900 text-sm mb-4">
                    {property.type === 'rent' && (
                        <p>
                            <FaMoneyBill className="inline mr-2" /> Аренда
                        </p>
                    )}
                    {property.type === 'sale' && (
                        <p>
                            <FaMoneyBill className="inline mr-2" /> Продажа
                        </p>
                    )}
                </div>
                <div className="border border-gray-100 mb-5" />
                <div className="flex flex-col lg:flex-row justify-between mb-4">
                    <div className="flex align-middle gap-2 mb-4 lg:mb-0">
                        <FaMapMarker className="text-lg text-orange-700" />
                        <span className="text-orange-700">
                            {property.city}, {property.address}
                        </span>
                    </div>
                    <Link
                        href={`/properties/${property.id}`}
                        className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                    >
                        Подробнее
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
