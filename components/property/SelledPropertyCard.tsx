'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PostData } from '@/types/propertyTypes';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Pencil,
    Trash2,
    MapPin,
    Bed,
    Bath,
    Ruler,
    Tag,
    ChevronsRight,
    Heart,
    Home,
    Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PropertyCardProps {
    property: PostData;
    isOwnProperty?: boolean;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
}

const SelledPropertyCard: React.FC<PropertyCardProps> = ({
                                                             property,
                                                             isOwnProperty = true,
                                                             onDelete,
                                                             isDeleting = false
                                                         }) => {
    const formattedPrice = property.price?.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }) || 'Н/Д';
    const imageSrc = property.imageUrls?.[0] || '/images/default-property.jpg';

    const confirmDelete = () => {
        if (property.id) onDelete(property.id);
    };

    const propertyType = {
        APARTMENT: "Квартира",
        HOUSE: "Дом",
        LAND_PLOT: "Земельный участок"
    }[property.property] || "Неизвестная недвижимость";

    const propertyIcon = {
        APARTMENT: <Home className="h-4 w-4" />,
        HOUSE: <Home className="h-4 w-4" />,
        LAND_PLOT: <MapPin className="h-4 w-4" />
    }[property.property];

    const formatDate = (dateString?: Date | string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <motion.div
            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300"
            whileHover={{ y: -3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            layout
        >
            <div className="flex flex-col md:flex-row">
                {/* Property Image Section */}
                <div className="relative w-full md:w-1/3 h-60 md:h-auto overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                    <Image
                        src={imageSrc}
                        alt={property.title || 'Недвижимость'}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-white/90 backdrop-blur-sm text-blue-600 shadow-md font-semibold text-sm py-1.5 px-3">
                            {formattedPrice}
                        </Badge>
                    </div>
                    {!isOwnProperty && (
                        <div className="absolute top-4 right-4 z-20">
                            <Badge className="bg-red-50 text-red-600 flex items-center gap-1">
                                <Heart className="h-3 w-3 fill-current" />
                                <span>В избранном</span>
                            </Badge>
                        </div>
                    )}
                    <div className="absolute bottom-4 left-4 z-20">
                        <Badge className="bg-slate-800/80 text-white flex items-center gap-1.5 backdrop-blur-sm">
                            {propertyIcon}
                            <span>{propertyType}</span>
                        </Badge>
                    </div>
                    {property.createdAt && (
                        <div className="absolute bottom-4 right-4 z-20">
                            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-slate-700 flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(property.createdAt)}</span>
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Property Details Section */}
                <div className="w-full md:w-2/3 p-5 flex flex-col">
                    <div className="mb-auto">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">{property.title}</h3>

                        <div className="flex items-center text-slate-600 mb-3">
                            <MapPin className="h-4 w-4 text-orange-500 mr-1.5 flex-shrink-0" />
                            <span className="text-sm line-clamp-1">{property.address}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-slate-600 text-sm mb-4">
                            {property.property === 'APARTMENT' && (
                                <>
                                    <div className="flex items-center">
                                        <Bed className="h-4 w-4 text-green-500 mr-1.5" />
                                        <span>{property.apartment?.numBedrooms} {property.apartment?.numBedrooms === 1 ? 'Спальня' : 'Спальни'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Bath className="h-4 w-4 text-blue-400 mr-1.5" />
                                        <span>{property.apartment?.numBathrooms} {property.apartment?.numBathrooms === 1 ? 'Ванная' : 'Ванные'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Ruler className="h-4 w-4 text-yellow-500 mr-1.5" />
                                        <span>{property.apartment?.floorNumber} Этаж</span>
                                    </div>
                                </>
                            )}
                            {property.property === 'HOUSE' && (
                                <>
                                    <div className="flex items-center">
                                        <Bed className="h-4 w-4 text-green-500 mr-1.5" />
                                        <span>{property.house?.numberOfRooms} {property.house?.numberOfRooms === 1 ? 'Комната' : 'Комнаты'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Ruler className="h-4 w-4 text-yellow-500 mr-1.5" />
                                        <span>{property.house?.houseArea} кв.м</span>
                                    </div>
                                </>
                            )}
                            {property.property === 'LAND_PLOT' && (
                                <div className="flex items-center">
                                    <Ruler className="h-4 w-4 text-yellow-500 mr-1.5" />
                                    <span>{property.landPlot?.landArea} соток</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center mb-4">
                            <Tag className="h-4 w-4 text-green-600 mr-1.5" />
                            <span className="text-sm font-medium text-green-600">
                                {property.type === 'RENT' ? 'Аренда' : 'Продажа'}
                            </span>
                        </div>

                        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                            {property.description
                                ? `${property.description}`
                                : 'Описание отсутствует'}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center mt-auto">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/properties/${property.id}`} passHref>
                                        <Button variant="default" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                                            <span className="mr-1">Подробнее</span>
                                            <ChevronsRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Посмотреть подробную информацию</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {isOwnProperty && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button asChild variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                                            <Link href={`/properties/${property.id}/update`}>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Редактировать
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Изменить информацию об объекте</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className={`${!isOwnProperty ? 'bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200' : ''}`}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></div>
                                            Удаление...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            {isOwnProperty ? "Удалить" : "Удалить из избранного"}
                                        </>
                                    )}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {isOwnProperty ? "Удалить это объявление?" : "Удалить из избранного?"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {isOwnProperty
                                            ? "Это действие нельзя отменить. Объявление будет удалено навсегда."
                                            : "Объект будет удален из списка избранного. Вы всегда сможете добавить его снова."}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="border-slate-200">Отмена</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={confirmDelete}
                                        className={isOwnProperty ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"}
                                    >
                                        {isOwnProperty ? "Удалить объявление" : "Удалить из избранного"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SelledPropertyCard;