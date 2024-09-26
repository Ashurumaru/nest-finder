import Link from "next/link";
import React from "react";
import {
    FaBed,
    FaBath,
    FaRulerCombined,
    FaMapMarker,
    FaMoneyBill,
} from "react-icons/fa";
import Image from "next/image";

interface Property {
    id: string;
    title: string;
    price: number;
    imageUrls: string[];
    address: string;
    city: string;
    numBedrooms: number;
    numBathrooms: number;
    square_feet?: number;
    type: "sale" | "rent";
    property: "apartment" | "house" | "condo" | "townhouse" | "commercial" | "land";
}

interface FeaturedPropertyCardProps {
    property: Property;
}

const FeaturedPropertyCard: React.FC<FeaturedPropertyCardProps> = ({ property }) => {
    const getPriceDisplay = () => {
        // Форматирование цены
        return property.price.toLocaleString();
    };

    return (
        <div className="bg-white rounded-xl shadow-md relative flex flex-col md:flex-row">
            <Image
                src={property.imageUrls[0]}
                alt={property.title}
                sizes="100vw"
                width={0}
                height={0}
                className="object-cover rounded-t-xl md:rounded-tr-none md:rounded-l-xl w-full md:w-2/5"
            />
            <div className="p-6">
                <h3 className="text-xl font-bold">{property.title}</h3>
                <div className="text-gray-600 mb-4 capitalize">
                    {property.property === "apartment"
                        ? "Квартира"
                        : property.property === "house"
                            ? "Дом"
                            : property.property === "condo"
                                ? "Кондо"
                                : property.property === "townhouse"
                                    ? "Таунхаус"
                                    : "Коммерческая недвижимость"}
                </div>
                <h3 className="absolute top-[10px] left-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
                    ${getPriceDisplay()}
                </h3>
                <div className="flex justify-center gap-4 text-gray-500 mb-4">
                    <p>
                        <FaBed className="inline mr-2" /> {property.numBedrooms}{" "}
                        <span className="md:hidden lg:inline">Спальни</span>
                    </p>
                    <p>
                        <FaBath className="inline mr-2" /> {property.numBathrooms}{" "}
                        <span className="md:hidden lg:inline">Ванные</span>
                    </p>
                    {property.square_feet && (
                        <p>
                            <FaRulerCombined className="inline mr-2" />
                            {property.square_feet} <span className="md:hidden lg:inline">кв. фут</span>
                        </p>
                    )}
                </div>
                <div className="border border-gray-200 mb-5" />
                <div className="flex flex-col lg:flex-row justify-between">
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
                        Подробности
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturedPropertyCard;
