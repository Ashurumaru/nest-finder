import Image from "next/image";
import Link from "next/link";
import { PostData } from "@/types/propertyTypes";
import { FaBed, FaBath, FaRulerCombined, FaRegClock, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { formatDate } from "@/utils/formatDate";
import { useState } from "react";

interface PropertyCardProps {
    property: PostData;
    compact?: boolean;
    onSelect?: () => void;
}

const PropertyCard = ({ property, compact = false, onSelect }: PropertyCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Format property features for display
    const getPropertyFeatures = () => {
        if (property.apartment) {
            return {
                bedrooms: property.apartment.numBedrooms || 0,
                bathrooms: property.apartment.numBathrooms || 0,
                area: property.apartment.apartmentArea || 0,
            };
        } else if (property.house) {
            return {
                bedrooms: property.house.numberOfRooms || 0,
                bathrooms: property.house.numberOfRooms || 0,
                area: property.house.houseArea || 0,
            };
        } else if (property.landPlot) {
            return {
                bedrooms: 0,
                bathrooms: 0,
                area: property.landPlot.landArea || 0,
            };
        }
        return {
            bedrooms: 0,
            bathrooms: 0,
            area: 0,
        };
    };

    const features = getPropertyFeatures();
    const propertyType = property.property === "APARTMENT"
        ? "Квартира"
        : property.property === "HOUSE"
            ? "Дом"
            : "Участок";

    const dealType = property.type === "SALE" ? "Продажа" : "Аренда";
    const formattedPrice = Number(property.price).toLocaleString() + " ₽";

    // Использование первого изображения из массива или fallback
    const imageSrc = property.imageUrls?.[0] || '/images/default-property.jpg';

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    return (
        <div
            className={`bg-white rounded-lg shadow-md overflow-hidden ${compact ? "" : "hover:shadow-lg transition-shadow duration-300"}`}
            onClick={onSelect}
        >
            <div className="relative">
                <div className={`relative ${compact ? "h-40" : "h-56"}`}>
                    <Image
                        src={imageSrc}
                        alt={property.title || "Объект недвижимости"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        onError={() => setImageError(true)}
                    />

                    <button
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md z-10 transition-transform hover:scale-110"
                        onClick={handleFavoriteClick}
                    >
                        <FaHeart
                            className={`${isFavorite ? "text-red-500" : "text-gray-400"} transition-colors`}
                            size={16}
                        />
                    </button>
                </div>
                <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 text-xs rounded-md shadow-sm">
                    {dealType}
                </div>
                <div className="absolute bottom-3 left-3 bg-white text-primary px-2 py-1 text-xs rounded-md shadow-sm">
                    {propertyType}
                </div>
            </div>

            <div className={`p-4 ${compact ? "space-y-2" : "space-y-3"}`}>
                <div className="flex justify-between items-start">
                    <h3 className={`font-semibold ${compact ? "text-base" : "text-lg"} line-clamp-1`}>
                        {property.title || "Без названия"}
                    </h3>
                </div>

                <p className="font-bold text-primary text-lg">{formattedPrice}</p>

                {property.address && (
                    <div className="flex items-center text-sm text-gray-600">
                        <FaMapMarkerAlt className="mr-1 text-gray-400 flex-shrink-0" />
                        <span className="line-clamp-1">{property.address}</span>
                    </div>
                )}

                {!compact && property.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>
                )}

                <div className="flex justify-between text-sm text-gray-600">
                    {features.bedrooms > 0 && (
                        <div className="flex items-center">
                            <FaBed className="mr-1 text-gray-500" />
                            <span>{features.bedrooms}</span>
                        </div>
                    )}

                    {features.bathrooms > 0 && (
                        <div className="flex items-center">
                            <FaBath className="mr-1 text-gray-500" />
                            <span>{features.bathrooms}</span>
                        </div>
                    )}

                    {features.area > 0 && (
                        <div className="flex items-center">
                            <FaRulerCombined className="mr-1 text-gray-500" />
                            <span>{features.area} м²</span>
                        </div>
                    )}

                    {!compact && (
                        <div className="flex items-center">
                            <FaRegClock className="mr-1 text-gray-500" />
                            <span>{formatDate(property.createdAt)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;