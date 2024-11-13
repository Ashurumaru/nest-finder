'use client';

import React from 'react';
import { ReservationData } from "@/types/propertyTypes";
import { FaMapMarkerAlt, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { ReservationStatus } from "@prisma/client";

interface RentedPropertyCardProps {
    reservation: ReservationData;
}

export default function RentedPropertyCard({ reservation }: RentedPropertyCardProps) {
    const { post, startDate, endDate, totalPrice, status } = reservation;

    if (!post) {
        return <div className="text-red-500">Информация о недвижимости недоступна</div>;
    }

    const formattedStartDate = new Date(startDate).toLocaleDateString('ru-RU');
    const formattedEndDate = new Date(endDate).toLocaleDateString('ru-RU');
    const formattedTotalPrice = totalPrice.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    const imageSrc = post.imageUrls && post.imageUrls[0] ? post.imageUrls[0] : "/images/default-property.jpg";

    const statusColor = {
        [ReservationStatus.PENDING]: "text-yellow-500",
        [ReservationStatus.CONFIRMED]: "text-green-500",
        [ReservationStatus.CANCELLED]: "text-red-500"
    }[status || ReservationStatus.PENDING];

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative w-full md:w-1/3">
                <Image
                    src={imageSrc}
                    alt={post.title || "Недвижимость"}
                    width={400}
                    height={300}
                    className="w-full h-60 object-cover rounded-lg"
                />
            </div>

            <div className="w-full md:w-2/3 flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                    <div className={`text-sm font-semibold ${statusColor} mb-4`}>
                        Статус: {status === ReservationStatus.PENDING ? "Ожидает" : status === ReservationStatus.CONFIRMED ? "Подтверждено" : "Отменено"}
                    </div>

                    <div className="flex items-center text-gray-700 mb-2">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{post.city}, {post.address}</span>
                    </div>

                    <div className="flex items-center text-gray-700 mb-2">
                        <FaCalendarAlt className="mr-2" />
                        <span>{formattedStartDate} - {formattedEndDate}</span>
                    </div>

                    <div className="flex items-center text-gray-700 mb-2">
                        <FaDollarSign className="mr-2" />
                        <span>Итоговая стоимость: {formattedTotalPrice}</span>
                    </div>
                </div>

                <div className="mt-6">
                    <Link href={`/properties/${post.id}`}>
                        <a className="text-blue-500 hover:underline">Подробнее о недвижимости</a>
                    </Link>
                </div>
            </div>
        </div>
    );
}
