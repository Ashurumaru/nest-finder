//components/map/PropertyCard.tsx
import Image from "next/image";
import Link from "next/link";
import { PostData } from "@/types/propertyTypes";
import { FaBed, FaBath, FaRulerCombined, FaRegClock } from "react-icons/fa";
import { formatDate } from "@/utils/formatDate";

interface PropertyCardProps {
    property: PostData;
    compact?: boolean;
}

const PropertyCard = ({ property, compact = false }: PropertyCardProps) => {
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
                bathrooms: 0, // Assume no bathroom info for houses
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

    // Get main image or fallback
    const mainImage = "/placeholder-property.jpg"; // Replace with actual image from property when available

    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden ${compact ? "" : "hover:shadow-lg transition-shadow"}`}>
            <Link href={`/property/${property.id}`}>
                <div className="relative">
                    <div className={`relative ${compact ? "h-40" : "h-56"}`}>
                        <Image
                            src={mainImage}
                            alt={property.title || "Объект недвижимости"}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs rounded">
                        {dealType}
                    </div>
                    <div className="absolute top-2 right-2 bg-white text-primary px-2 py-1 text-xs rounded shadow">
                        {propertyType}
                    </div>
                </div>

                <div className={`p-4 ${compact ? "space-y-1" : "space-y-3"}`}>
                    <div className="flex justify-between items-start">
                        <h3 className={`font-semibold ${compact ? "text-base" : "text-lg"} line-clamp-1`}>
                            {property.title || property.address}
                        </h3>
                    </div>

                    <p className="font-bold text-primary text-lg">{formattedPrice}</p>

                    {!compact && property.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>
                    )}

                    <div className="flex justify-between text-sm text-gray-600">
                        {features.bedrooms > 0 && (
                            <div className="flex items-center">
                                <FaBed className="mr-1" />
                                <span>{features.bedrooms}</span>
                            </div>
                        )}

                        {features.bathrooms > 0 && (
                            <div className="flex items-center">
                                <FaBath className="mr-1" />
                                <span>{features.bathrooms}</span>
                            </div>
                        )}

                        {features.area > 0 && (
                            <div className="flex items-center">
                                <FaRulerCombined className="mr-1" />
                                <span>{features.area} м²</span>
                            </div>
                        )}

                        {!compact && (
                            <div className="flex items-center">
                                <FaRegClock className="mr-1" />
                                <span>{formatDate(property.createdAt)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PropertyCard;