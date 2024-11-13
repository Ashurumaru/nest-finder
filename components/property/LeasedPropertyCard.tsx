'use client';

import React from 'react';
import { PostData } from "@/types/propertyTypes";
import { FaMapMarkerAlt, FaBed, FaBath, FaDollarSign } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface LeasedPropertyCardProps {
    property: PostData;
    onDelete: (id: string) => void;
}

export default function LeasedPropertyCard({ property, onDelete }: LeasedPropertyCardProps) {
    const imageSrc = property.imageUrls && property.imageUrls[0] ? property.imageUrls[0] : "/images/default-property.jpg";
    const formattedPrice = property.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative w-full md:w-1/3">
                <Image
                    src={imageSrc}
                    alt={property.title || "Недвижимость"}
                    width={400}
                    height={300}
                    className="w-full h-60 object-cover rounded-lg"
                />
            </div>

            <div className="w-full md:w-2/3 flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-2">{property.title}</h3>

                    <div className="flex items-center text-gray-700 mb-2">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{property.city}, {property.address}</span>
                    </div>

                    {property.apartment && (
                        <div className="flex items-center text-gray-700 mb-2">
                            <FaBed className="mr-2" /> {property.apartment.numBedrooms} Спальни
                            <FaBath className="ml-4 mr-2" /> {property.apartment.numBathrooms} Ванные
                        </div>
                    )}

                    <div className="flex items-center text-gray-700 mb-2">
                        <FaDollarSign className="mr-2" />
                        <span>Цена: {formattedPrice}</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <Link href={`/properties/${property.id}`}>
                        <a className="text-blue-500 hover:underline">Подробнее о недвижимости</a>
                    </Link>
                    <button
                        onClick={() => onDelete(property.id!)}
                        className="text-red-500 hover:underline"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
}
