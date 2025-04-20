'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ReservationData } from "@/types/propertyTypes";
import {
    Calendar,
    MapPin,
    DollarSign,
    Clock,
    Home,
    User,
    CheckCircle,
    XCircle,
    ChevronsRight,
    Mail,
    Phone
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ReservationStatus } from "@prisma/client";

interface RentedPropertyCardProps {
    reservation: ReservationData;
    getStatusColor: (status: ReservationStatus) => string;
    getStatusIcon: (status: ReservationStatus) => React.ReactNode;
}

export default function RentedPropertyCard({
                                               reservation,
                                               getStatusColor,
                                               getStatusIcon
                                           }: RentedPropertyCardProps) {
    const { post, startDate, endDate, totalPrice, status, createdAt } = reservation;

    if (!post) {
        return (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                <XCircle className="h-5 w-5 mb-2" />
                <p className="font-medium">Информация о недвижимости недоступна</p>
                <p className="text-sm mt-1">Объект мог быть удален владельцем</p>
            </div>
        );
    }

    const formattedStartDate = new Date(startDate).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const formattedEndDate = new Date(endDate).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Ensure totalPrice is treated as a number
    const totalPriceNumber = typeof totalPrice === 'number' ? totalPrice : Number(totalPrice);
    const formattedTotalPrice = totalPriceNumber.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });

    const imageSrc = post.imageUrls && post.imageUrls[0] ? post.imageUrls[0] : "/images/default-property.jpg";

    // Calculate duration in days
    const daysDuration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));

    // Format creation date
    const formattedCreatedAt = createdAt ? new Date(createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) : 'Н/Д';

    // Calculate price per day with type safety
    const pricePerDay = totalPriceNumber / daysDuration;
    const formattedPricePerDay = pricePerDay.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });

    // Is reservation active
    const now = new Date();
    const isActive = new Date(endDate) >= now && status === 'CONFIRMED';
    const isPast = new Date(endDate) < now;

    // Using type guards for optional properties
    const postUser = 'user' in post ? post.user : null;
    const propertyType = 'property' in post ? post.property : null;
    const apartmentDetails = propertyType === 'APARTMENT' && 'apartment' in post ? post.apartment : null;

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
                        alt={post.title || 'Недвижимость'}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-700 hover:scale-110"
                    />

                    <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-white/90 backdrop-blur-sm text-blue-600 shadow-md font-semibold text-sm py-1.5 px-3">
                            {formattedPricePerDay} / день
                        </Badge>
                    </div>

                    {isActive && (
                        <div className="absolute top-4 right-4 z-20">
                            <Badge className="bg-green-100 text-green-700 border border-green-200">
                                Активное бронирование
                            </Badge>
                        </div>
                    )}

                    <div className="absolute bottom-4 left-4 z-20">
                        <Badge className={`text-white flex items-center gap-1.5 backdrop-blur-sm ${getStatusColor(status || 'PENDING')}`}>
                            {getStatusIcon(status || 'PENDING')}
                            <span>
                                {status === 'CONFIRMED' && 'Подтверждено'}
                                {status === 'CANCELLED' && 'Отменено'}
                                {status === 'PENDING' && 'Ожидает подтверждения'}
                            </span>
                        </Badge>
                    </div>

                    {isPast && status === 'CONFIRMED' && (
                        <div className="absolute bottom-4 right-4 z-20">
                            <Badge variant="outline" className="bg-slate-800/80 text-white backdrop-blur-sm">
                                Завершено
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Property Details Section */}
                <div className="w-full md:w-2/3 p-5 flex flex-col">
                    <div className="mb-auto">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">{post.title}</h3>

                        <div className="flex items-center text-slate-600 mb-3">
                            <MapPin className="h-4 w-4 text-orange-500 mr-1.5 flex-shrink-0" />
                            <span className="text-sm line-clamp-1">{post.city}, {post.address}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 mb-4">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-blue-500 mr-1.5" />
                                <span>Период: <span className="font-medium">{formattedStartDate} - {formattedEndDate}</span></span>
                            </div>

                            <div className="flex items-center">
                                <Clock className="h-4 w-4 text-blue-500 mr-1.5" />
                                <span>Длительность: <span className="font-medium">{daysDuration} {daysDuration === 1 ? 'день' : daysDuration < 5 ? 'дня' : 'дней'}</span></span>
                            </div>

                            <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-green-500 mr-1.5" />
                                <span>Стоимость: <span className="font-medium">{formattedTotalPrice}</span></span>
                            </div>

                            <div className="flex items-center">
                                <Clock className="h-4 w-4 text-amber-500 mr-1.5" />
                                <span>Дата бронирования: <span className="font-medium">{formattedCreatedAt}</span></span>
                            </div>
                        </div>

                        {postUser && (
                            <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3 border border-slate-100 mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-medium text-slate-800">{postUser.name}</h4>
                                    <div className="flex items-center text-xs text-slate-500">
                                        <Mail className="h-3 w-3 mr-1" />
                                        <span>{postUser.email}</span>
                                        {postUser.phoneNumber && (
                                            <>
                                                <span className="mx-1">•</span>
                                                <Phone className="h-3 w-3 mr-1" />
                                                <span>{postUser.phoneNumber}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Additional property features - only render if data is available */}
                        {apartmentDetails && (
                            <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
                                {apartmentDetails.numBedrooms && (
                                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                        {apartmentDetails.numBedrooms} {apartmentDetails.numBedrooms === 1 ? 'спальня' : 'спальни'}
                                    </span>
                                )}
                                {apartmentDetails.numBathrooms && (
                                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                        {apartmentDetails.numBathrooms} {apartmentDetails.numBathrooms === 1 ? 'ванная' : 'ванные'}
                                    </span>
                                )}
                                {apartmentDetails.apartmentArea && (
                                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                        {apartmentDetails.apartmentArea} м²
                                    </span>
                                )}
                                {apartmentDetails.floorNumber && (
                                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                        {apartmentDetails.floorNumber} этаж
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 items-center mt-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/properties/${post.id}`} passHref>
                                        <Button variant="default" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                                            <span className="mr-1">Подробнее</span>
                                            <ChevronsRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Посмотреть подробную информацию об объекте</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {status === 'CONFIRMED' && isActive && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Активное бронирование
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Бронирование подтверждено и действует в настоящий момент</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        {status === 'PENDING' && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100">
                                            <Clock className="h-4 w-4 mr-2" />
                                            Ожидает подтверждения
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Владелец еще не подтвердил ваше бронирование</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        {postUser && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button asChild variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                                            <Link href={`/chat/${postUser.id}`}>
                                                <Mail className="h-4 w-4 mr-2" />
                                                Связаться с владельцем
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Написать владельцу недвижимости</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}