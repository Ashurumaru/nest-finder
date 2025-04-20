'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PostData } from '@/types/propertyTypes';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    Share2,
    MapPin,
    Home,
    Bed,
    Bath,
    ArrowRight,
    Ruler,
    Tag,
    Trees
} from "lucide-react";

interface PropertyCardProps {
    property: PostData;
}

const EnhancedPropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const formattedPrice = property.price
        ? `${property.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}`
        : 'Цена по запросу';

    const imageSrc = property.imageUrls?.[0] || '/images/default-property.jpg';

    const propertyTypeMap = {
        'APARTMENT': { name: 'Квартира', icon: <Home className="h-4 w-4" /> },
        'HOUSE': { name: 'Дом', icon: <Home className="h-4 w-4" /> },
        'LAND_PLOT': { name: 'Земельный участок', icon: <Trees className="h-4 w-4" /> },
    };

    const propertyTypeInfo = property.property ? propertyTypeMap[property.property] : { name: 'Недвижимость', icon: <Home className="h-4 w-4" /> };

    const getPropertyDetails = () => {
        switch(property.property) {
            case 'APARTMENT':
                return (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        {property.apartment?.numBedrooms && (
                            <div className="flex items-center text-gray-600">
                                <Bed className="h-4 w-4 mr-1" />
                                <span>{property.apartment.numBedrooms} комн.</span>
                            </div>
                        )}
                        {property.apartment?.numBathrooms && (
                            <div className="flex items-center text-gray-600">
                                <Bath className="h-4 w-4 mr-1" />
                                <span>{property.apartment.numBathrooms} ванн.</span>
                            </div>
                        )}
                        {property.apartment?.apartmentArea && (
                            <div className="flex items-center text-gray-600">
                                <Ruler className="h-4 w-4 mr-1" />
                                <span>{property.apartment.apartmentArea} м²</span>
                            </div>
                        )}
                    </div>
                );
            case 'HOUSE':
                return (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        {property.house?.numberOfRooms && (
                            <div className="flex items-center text-gray-600">
                                <Bed className="h-4 w-4 mr-1" />
                                <span>{property.house.numberOfRooms} комн.</span>
                            </div>
                        )}
                        {property.house?.houseArea && (
                            <div className="flex items-center text-gray-600">
                                <Home className="h-4 w-4 mr-1" />
                                <span>{property.house.houseArea} м²</span>
                            </div>
                        )}
                        {property.house?.landArea && (
                            <div className="flex items-center text-gray-600">
                                <Trees className="h-4 w-4 mr-1" />
                                <span>{property.house.landArea} сот.</span>
                            </div>
                        )}
                    </div>
                );
            case 'LAND_PLOT':
                return (
                    <div className="flex items-center text-gray-600 mt-3">
                        <Trees className="h-4 w-4 mr-1" />
                        <span>{property.landPlot?.landArea || 'Н/Д'} соток</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-white h-full flex flex-col">
            <div className="relative w-full h-[220px] overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={property.title || 'Недвижимость'}
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-0 left-0 w-full p-3 flex justify-between">
                    <Badge
                        className={`${property.type === 'RENT' ? 'bg-amber-500' : 'bg-blue-600'} hover:${property.type === 'RENT' ? 'bg-amber-600' : 'bg-blue-700'}`}
                    >
                        {property.type === 'RENT' ? 'Аренда' : 'Продажа'}
                    </Badge>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                            aria-label="Добавить в избранное"
                        >
                            <Heart className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                            aria-label="Поделиться"
                        >
                            <Share2 className="h-4 w-4 text-gray-600" />
                        </Button>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 p-3">
                    <Badge variant="secondary" className="bg-white text-blue-700 font-bold text-lg shadow-md">
                        {formattedPrice}
                    </Badge>
                </div>
            </div>

            <CardContent className="pt-5 flex-grow">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="flex items-center gap-1 border-gray-200 text-gray-600 font-normal">
                        {propertyTypeInfo.icon}
                        {propertyTypeInfo.name}
                    </Badge>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {property.title || 'Недвижимость без названия'}
                </h3>

                <div className="flex items-center text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-sm">
            {property.city || 'Город'}{property.address ? `, ${property.address}` : ''}
          </span>
                </div>

                {getPropertyDetails()}

                {property.description && (
                    <p className="text-gray-600 mt-3 line-clamp-2 text-sm">
                        {property.description}
                    </p>
                )}
            </CardContent>

            <CardFooter className="pt-0 pb-4">
                <Link href={`/properties/${property.id}`} className="w-full">
                    <Button
                        variant="outline"
                        className="w-full border-blue-100 text-blue-700 hover:bg-blue-50 font-medium"
                    >
                        Подробнее
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default EnhancedPropertyCard;