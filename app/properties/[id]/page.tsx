"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaHeart, FaRegClipboard, FaExclamationTriangle, FaShareAlt } from "react-icons/fa";
import { Property } from "@/types/propertyTypes";

export default function PropertyPage() {
    const { id } = useParams(); // Получаем ID из URL
    const [property, setProperty] = useState<Property | null>(null); // Состояние для хранения данных недвижимости
    const [loading, setLoading] = useState(true); // Состояние для управления загрузкой

    useEffect(() => {
        // Функция для получения данных недвижимости по ID
        const fetchProperty = async () => {
            try {
                const res = await fetch(`/api/properties/${id}`, {
                    method: 'GET', // Используем метод GET для получения данных
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch property");
                }

                const data: Property = await res.json(); // Парсим ответ как JSON
                setProperty(data); // Сохраняем данные недвижимости в состояние
            } catch (error) {
                console.error("Error fetching property:", error);
            } finally {
                setLoading(false); // Отключаем состояние загрузки
            }
        };

        fetchProperty();
    }, [id]); // Эффект срабатывает при изменении ID

    // Если данные ещё загружаются, выводим сообщение
    if (loading) {
        return <p className="text-center text-xl mt-10">Loading...</p>;
    }

    // Если данные не найдены, выводим сообщение об ошибке
    if (!property) {
        return <h1 className="text-center text-2xl font-bold mt-10">Property Not Found</h1>;
    }

    return (
        <>
            {property && (
                <div className="container mx-auto py-6 px-6">
                    {/* Заголовок с основными данными */}
                    <section className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">
                            {property.title}
                        </h1>
                        <p className="text-xl text-green-500 font-bold mb-4">
                            {property.price.toLocaleString()} ₽
                        </p>
                        <p className="text-gray-600 mb-2">
                            {property.address}, {property.city}
                        </p>
                        <p className="text-gray-600">
                            Тип недвижимости: {property.property === 'apartment' ? 'Квартира' : property.property}
                        </p>
                        <p className="text-gray-600">
                            Количество спален: {property.numBedrooms}, Ванных комнат: {property.numBathrooms}
                        </p>

                        {/* Кнопки взаимодействия */}
                        <div className="flex gap-4 mt-4">
                            <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
                                <FaRegClipboard /> Сравнить
                            </button>
                            <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
                                <FaShareAlt /> Поделиться
                            </button>
                            <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
                                <FaHeart /> В избранное
                            </button>
                            <button className="flex items-center gap-2 text-red-500 hover:text-red-600">
                                <FaExclamationTriangle /> Пожаловаться
                            </button>
                        </div>
                    </section>

                    {/* Блок с изображениями */}
                    {property.imageUrls && property.imageUrls.length > 0 && (
                        <section className="mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                {property.imageUrls.map((url, index) => (
                                    <img key={index} src={url} alt={`Image ${index}`} className="rounded-lg shadow-lg" />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Детали недвижимости */}
                    <section className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">Описание</h2>
                        <p className="text-gray-600 mb-4">
                            {property.postDetail?.description || 'Описание отсутствует.'}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Характеристики объекта */}
                            <div>
                                {property.postDetail?.utilitiesIncluded && (
                                    <p className="text-gray-600">
                                        <strong>Услуги, включенные в аренду:</strong> {property.postDetail.utilitiesIncluded}
                                    </p>
                                )}
                                {property.postDetail?.petPolicy && (
                                    <p className="text-gray-600">
                                        <strong>Политика по домашним животным:</strong> {property.postDetail.petPolicy}
                                    </p>
                                )}
                                {property.postDetail?.incomeRequirement && (
                                    <p className="text-gray-600">
                                        <strong>Требование к доходу:</strong> {property.postDetail.incomeRequirement}
                                    </p>
                                )}
                            </div>

                            {/* Дистанция до объектов инфраструктуры */}
                            <div>
                                {property.postDetail?.schoolDistance && (
                                    <p className="text-gray-600">
                                        <strong>Расстояние до школы:</strong> {property.postDetail.schoolDistance} км
                                    </p>
                                )}
                                {property.postDetail?.busStopDistance && (
                                    <p className="text-gray-600">
                                        <strong>Расстояние до автобусной остановки:</strong> {property.postDetail.busStopDistance} км
                                    </p>
                                )}
                                {property.postDetail?.restaurantDistance && (
                                    <p className="text-gray-600">
                                        <strong>Расстояние до ресторанов:</strong> {property.postDetail.restaurantDistance} км
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Кнопка контактов */}
                    <section className="text-center">
                        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                            Контакты застройщика
                        </button>
                    </section>
                </div>
            )}
        </>
    );
}
