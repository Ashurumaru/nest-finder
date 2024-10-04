import Link from "next/link";
import React from "react";
import { FaBed, FaBath, FaRulerCombined, FaMapMarker, FaMoneyBill } from "react-icons/fa";
import Image from "next/image";
import { Property } from '@/types/propertyTypes';

interface FeaturedPropertyCardProps {
    property: Property;
}

const FeaturedPropertyCard: React.FC<FeaturedPropertyCardProps> = ({ property }) => {
    const formattedPrice = property.price?.toLocaleString() || "N/A";
    const imageSrc = property.imageUrls?.[0] || '/images/default-property.jpg';
    const propertyType = {
        apartment: "Квартира",
        house: "Дом",
        condo: "Кондо",
        townhouse: "Таунхаус",
        commercial: "Коммерческая недвижимость",
        land: "остров"
    }[property.property] || "Неизвестная недвижимость";

    return (
        <div className="bg-white rounded-xl shadow-md relative flex flex-col mx-auto md:flex-row h-full">
            <Image
                src={imageSrc}
                alt={property.title || "Недвижимость"}
                sizes="100vw"
                width={600}
                height={400}
                className="object-cover rounded-t-xl md:rounded-tr-none md:rounded-l-xl w-full md:w-2/5"
            />
            <div className="p-6 flex flex-col flex-grow"> {/* flex-grow для заполнения */}
                <h3 className="text-xl font-bold">{property.title}</h3>
                <div className="text-gray-600 mb-4 capitalize">{propertyType}</div>
                <h3 className="absolute top-[10px] left-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
                    ${formattedPrice}
                </h3>
                <div className="flex justify-center gap-4 text-gray-500 mb-4">
                    {property.numBedrooms && (
                        <p>
                            <FaBed className="inline mr-2" /> {property.numBedrooms}{" "}
                            <span className="md:hidden lg:inline">Спальни</span>
                        </p>
                    )}
                    {property.numBathrooms && (
                        <p>
                            <FaBath className="inline mr-2" /> {property.numBathrooms}{" "}
                            <span className="md:hidden lg:inline">Ванные</span>
                        </p>
                    )}
                    {property?.propertySize && (
                        <p>
                            <FaRulerCombined className="inline mr-2" />
                            {property.propertySize} <span className="md:hidden lg:inline">кв. фут</span>
                        </p>
                    )}
                </div>
                <div className="border border-gray-200 mb-5" />
                <div className="flex flex-col lg:flex-row justify-between mt-auto"> {/* mt-auto для выравнивания кнопки внизу */}
                    <div className="flex align-middle gap-2 mb-4 lg:mb-0">
                        <FaMapMarker className="text-lg text-orange-700" />
                        <span className="text-orange-700">
                            {property.city}
                        </span>
                    </div>
                    <Link
                        href={`/properties/${property.id}`}
                        className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                    >
                        Подробности
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default FeaturedPropertyCard;
