"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PostData } from "@/types/propertyTypes";
import ImageCarousel from "@/components/ImageCarousel";
import {
    FaMapMarkerAlt,
    FaBed,
    FaBath,
    FaRulerCombined,
    FaHeart,
    FaShareAlt,
    FaEye,
    FaCar,
    FaFire,
    FaHome,
    FaCouch,
    FaWind,
    FaBuilding,
} from "react-icons/fa";
import { MdElevator, MdOutlineBalcony } from "react-icons/md";
import { FiCopy } from "react-icons/fi";

export default function PropertyPage() {
    const { id } = useParams();
    const [property, setProperty] = useState<PostData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showContacts, setShowContacts] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch(`/api/properties/${id}`, {
                    method: "GET",
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch property");
                }

                const data: PostData = await res.json();
                setProperty(data);
            } catch (error) {
                console.error("Error fetching property:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    const handleFavoriteToggle = () => {
        setIsFavorite(!isFavorite);
        // Здесь может быть логика для добавления/удаления из избранного через API
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: property?.title,
                text: `Посмотрите объект недвижимости: ${property?.title}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Ссылка скопирована!");
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <p className="text-center text-xl mt-10">Загрузка...</p>;
    }

    if (!property) {
        return (
            <h1 className="text-center text-2xl font-bold mt-10">
                Объект недвижимости не найден
            </h1>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4">
            {/* Название и основная информация */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                    <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="inline mr-2" />
                        <p>
                            {property.address}, {property.city}
                        </p>
                    </div>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                    {/* Кнопка "Избранное" */}
                    <button
                        onClick={handleFavoriteToggle}
                        className="text-red-500 focus:outline-none mr-4"
                    >
                        {isFavorite ? (
                            <FaHeart className="text-2xl" />
                        ) : (
                            <FaHeart className="text-2xl text-gray-400" />
                        )}
                    </button>
                    {/* Кнопка "Поделиться" */}
                    <button
                        onClick={handleShare}
                        className="text-blue-500 focus:outline-none"
                    >
                        <FaShareAlt className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Галерея изображений */}
            {property.imageUrls && property.imageUrls.length > 0 && (
                <div className="mb-6">
                    <ImageCarousel images={property.imageUrls} />
                </div>
            )}

            {/* Основная информация */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Описание и дополнительная информация */}
                <div className="lg:col-span-2">
                    {/* Основные характеристики */}
                    <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Основные характеристики</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {property.numBedrooms !== undefined && (
                                <div className="flex items-center text-gray-700">
                                    <FaBed className="inline mr-2 text-blue-500"/>
                                    <p>{property.numBedrooms} Спальни</p>
                                </div>
                            )}
                            {property.numBathrooms !== undefined && (
                                <div className="flex items-center text-gray-700">
                                    <FaBath className="inline mr-2 text-blue-500"/>
                                    <p>{property.numBathrooms} Ванные комнаты</p>
                                </div>
                            )}
                            {property.propertySize && (
                                <div className="flex items-center text-gray-700">
                                    <FaRulerCombined className="inline mr-2 text-blue-500"/>
                                    <p>{property.propertySize} м²</p>
                                </div>
                            )}
                            {property.floorNumber !== undefined && (
                                <div className="flex items-center text-gray-700">
                                    <FaBuilding className="inline mr-2 text-blue-500"/>
                                    <p>
                                        Этаж: {property.floorNumber}
                                        {property.totalFloors
                                            ? ` из ${property.totalFloors}`
                                            : ""}
                                    </p>
                                </div>
                            )}
                            {property.hasElevator && (
                                <div className="flex items-center text-gray-700">
                                    <MdElevator className="inline mr-2 text-blue-500"/>
                                    <p>Есть лифт</p>
                                </div>
                            )}
                            {property.heatingType && (
                                <div className="flex items-center text-gray-700">
                                    <FaFire className="inline mr-2 text-blue-500"/>
                                    <p>Отопление: {property.heatingType}</p>
                                </div>
                            )}
                            {property.parking && (
                                <div className="flex items-center text-gray-700">
                                    <FaCar className="inline mr-2 text-blue-500"/>
                                    <p>Парковка: {property.parkingType || "Есть"}</p>
                                </div>
                            )}
                            {property.property && (
                                <div className="flex items-center text-gray-700">
                                    <FaHome className="inline mr-2 text-blue-500"/>
                                    <p>Тип недвижимости: {property.property}</p>
                                </div>
                            )}
                            {property.type && (
                                <div className="flex items-center text-gray-700">
                                    <FaBuilding className="inline mr-2 text-blue-500"/>
                                    <p>Тип сделки: {property.type}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Описание */}
                    <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Описание</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {property.description || "Описание отсутствует"}
                        </p>
                    </section>

                    {/* Удобства и особенности */}
                    {(property.furnished ||
                        property.airConditioning ||
                        property.balcony) && (
                        <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                            <h2 className="text-2xl font-semibold mb-4">Удобства и особенности</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {property.furnished && (
                                    <div className="flex items-center text-gray-700">
                                        <FaCouch className="inline mr-2 text-blue-500"/>
                                        <p>Меблированная</p>
                                    </div>
                                )}
                                {property.airConditioning && (
                                    <div className="flex items-center text-gray-700">
                                        <FaWind className="inline mr-2 text-blue-500"/>
                                        <p>Кондиционер</p>
                                    </div>
                                )}
                                {property.balcony && (
                                    <div className="flex items-center text-gray-700">
                                        <MdOutlineBalcony className="inline mr-2 text-blue-500"/>
                                        <p>Балкон/Терраса</p>
                                    </div>
                                )}
                                {/* Добавьте другие удобства при необходимости */}
                            </div>
                        </section>
                    )}

                    {/* Автор объявления */}
                    <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Автор объявления</h2>
                        <p className="text-gray-700">
                            Размещено пользователем:{" "}
                            <strong>
                                {property.user && property.user.name && property.user.surname
                                    ? `${property.user.name} ${property.user.surname}`
                                    : "Неизвестно"}
                            </strong>
                        </p>
                    </section>

                </div>

                {/* Боковая панель с ценой и контактами */}
                <div>
                    <div className="bg-white p-6 shadow-md rounded-lg mb-6 sticky top-20">
                        <p className="text-3xl font-bold text-gray-800 mb-4">
                            {property.price.toLocaleString()} ₽
                        </p>

                        {/* Дата публикации или изменения */}
                        <div className="text-gray-500 mb-4">
                            {property.updatedAt && property.updatedAt !== property.createdAt ? (
                                <p>Изменено: {formatDate(property.updatedAt)}</p>
                            ) : (
                                <p>Добавлено: {formatDate(property.createdAt ?? '')}</p>
                            )}
                        </div>


                        {/* Кнопка "Показать контакты" */}
                        <button
                            onClick={() => setShowContacts(!showContacts)}
                            className="bg-green-500 w-full text-white px-4 py-2 rounded-lg flex items-center justify-center mb-4 hover:bg-green-600 transition"
                        >
                            Показать контакты
                        </button>

                        {showContacts && (
                            <div className="mt-4">
                                {property.user?.phoneNumber && (
                                    <div className="flex items-center text-gray-700 mb-2">
                                        <p>Телефон: {property.user.phoneNumber}</p>
                                        <button
                                            onClick={() => {
                                                if (property.user?.phoneNumber) {
                                                    navigator.clipboard.writeText(property.user.phoneNumber);
                                                }
                                            }}
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                        >
                                            <FiCopy />
                                        </button>
                                    </div>
                                )}

                                {property.user?.email && (
                                    <div className="flex items-center text-gray-700">
                                        <p>Email: {property.user.email}</p>
                                        <button
                                            onClick={() => {
                                                if (property.user?.email) {
                                                    navigator.clipboard.writeText(property.user.email);
                                                }
                                            }}
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                        >
                                            <FiCopy />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Количество просмотров */}
                        <div className="flex items-center text-gray-600 mt-4">
                            <FaEye className="inline mr-2"/>
                            <p>{property.views || 0} просмотров</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
