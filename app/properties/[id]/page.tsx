"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Property } from "@/types/propertyTypes";
import ImageCarousel from "@/components/ImageCarousel";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaHeart, FaShareAlt, FaEye } from "react-icons/fa";

export default function PropertyPage() {
    const { id } = useParams();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showContacts, setShowContacts] = useState(false); // Управление видимостью контактов

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch(`/api/properties/${id}`, {
                    method: 'GET',
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch property");
                }

                const data: Property = await res.json();
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
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <p className="text-center text-xl mt-10">Loading...</p>;
    }

    if (!property) {
        return <h1 className="text-center text-2xl font-bold mt-10">Property Not Found</h1>;
    }

    return (
        <div className="container mx-auto py-6 px-4">
            {/* Название недвижимости */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                {/* Кнопка "Избранное" */}
                <button
                    onClick={handleFavoriteToggle}
                    className="text-red-500 focus:outline-none"
                >
                    {isFavorite ? <FaHeart className="text-2xl" /> : <FaHeart className="text-2xl text-gray-400" />}
                </button>
            </div>

            {/* Дата публикации или изменения */}
            <div className="text-gray-500 mb-4">
                {property.updatedAt ? (
                    <p>Изменено: {formatDate(property.updatedAt)}</p>
                ) : (
                    <p>Добавлено: {formatDate(property.createdAt)}</p>
                )}
            </div>

            {/* Карусель изображений */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    {property.imageUrls && property.imageUrls.length > 0 && (
                        <ImageCarousel images={property.imageUrls} />
                    )}
                </div>

                {/* Информация о недвижимости */}
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <p className="text-xl text-gray-700 mb-4">{property.price.toLocaleString()} ₽</p>
                    <div className="flex items-center text-gray-600 mb-4">
                        <FaMapMarkerAlt className="inline mr-2" />
                        <p>{property.address}, {property.city}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                            <FaBed className="inline mr-2" />
                            <p>{property.numBedrooms} Спальни</p>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FaBath className="inline mr-2" />
                            <p>{property.numBathrooms} Ванные комнаты</p>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FaRulerCombined className="inline mr-2" />
                            <p>{property.postDetail?.propertySize ? `${property.postDetail?.propertySize} м²` : 'Нет данных о размере'}</p>
                        </div>
                    </div>

                    {/* Кнопка "Поделиться" */}
                    <button
                        onClick={handleShare}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center mb-4"
                    >
                        <FaShareAlt className="mr-2" /> Поделиться
                    </button>

                    {/* Кнопка "Показать контакты" */}
                    <button
                        onClick={() => setShowContacts(!showContacts)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        Показать контакты
                    </button>

                    {showContacts && (
                        <div className="mt-4">
                            <p>Телефон: {property.postDetail?.incomeRequirement || "Не указано"}</p>
                            <p>Email: example@mail.com</p> {/* Здесь замените на реальный email */}
                        </div>
                    )}

                    {/* Количество просмотров */}
                    <div className="flex items-center text-gray-600 mt-4">
                        <FaEye className="inline mr-2" />
                        <p>{property.views || 0} просмотров</p>
                    </div>
                </div>
            </div>

            {/* Автор объявления */}
            <section className="bg-white p-6 shadow-lg rounded-lg mt-6">
                <h2 className="text-xl font-bold mb-4">Автор объявления</h2>
                <p className="text-gray-700">Размещено пользователем: <strong>{property.author || "Неизвестно"}</strong></p>
            </section>

            {/* Описание объекта недвижимости */}
            <section className="bg-white p-6 shadow-lg rounded-lg mt-6">
                <h2 className="text-2xl font-bold mb-4">Описание</h2>
                <p className="text-gray-700 leading-relaxed">
                    {property.postDetail?.description || "Описание отсутствует"}
                </p>
            </section>
        </div>
    );
}
