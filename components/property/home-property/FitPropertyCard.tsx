import Link from "next/link";
import React from "react";
import { FaBed, FaBath, FaRulerCombined, FaMapMarker, FaTag } from "react-icons/fa";
import Image from "next/image";
import { PostData } from '@/types/propertyTypes';

interface FeaturedPropertyCardProps {
    property: PostData;
}

const FitPropertyCard: React.FC<FeaturedPropertyCardProps> = ({ property }) => {
    const formattedPrice = property.price
        ? `${property.price.toLocaleString('ru-RU')} ₽`
        : "Н/Д";

    const imageSrc = property.imageUrls?.[0] || '/images/default-property.jpg';

    const propertyType = {
        apartment: "Квартира",
        house: "Дом",
        condo: "Кондо",
        townhouse: "Таунхаус",
        commercial: "Коммерческая недвижимость",
        land: "Земельный участок"
    }[property.property] || "Неизвестная недвижимость";

    return (
        <div className="bg-white rounded-xl shadow-md relative flex flex-col mx-auto md:flex-row h-full">
            <div className="w-full md:w-2/5 h-[300px] md:h-auto">
                <Image
                    src={imageSrc}
                    alt={property.title || "Недвижимость"}
                    sizes="100vw"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full rounded-t-xl md:rounded-tr-none md:rounded-l-xl"
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold">{property.title || 'Н/Д'}</h3>
                <div className="text-gray-600 mb-4 capitalize flex items-center">
                    <FaTag className="mr-2" />
                    {propertyType}
                </div>
                <h3 className="absolute top-[10px] left-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
                    {formattedPrice}
                </h3>
                <div className="flex justify-center gap-4 text-gray-500 mb-4">
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
                <div className="border border-gray-200 mb-5" />
                <div className="flex flex-col lg:flex-row justify-between mt-auto">
                    <div className="flex align-middle gap-2 mb-4 lg:mb-0">
                        <FaMapMarker className="text-lg text-orange-700" />
                        <span className="text-orange-700">
                            {property.city || 'Н/Д'}
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

export default FitPropertyCard;
