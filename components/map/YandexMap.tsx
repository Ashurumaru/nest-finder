'use client';

import { YMaps, Map, Placemark, Clusterer, ZoomControl, GeolocationControl, FullscreenControl } from '@pbe/react-yandex-maps';
import { PostData } from '@/types/propertyTypes';
import { useEffect, useRef, useState, useCallback } from 'react';

interface YandexMapProps {
    center: number[];
    zoom: number;
    properties: PostData[];
    selectedProperty: string | null;
    onPropertySelect: (id: string) => void;
    onPositionChange: (data: { center: number[], zoom: number, bounds: number[][] }) => void;
}

export default function YandexMap({
                                      center,
                                      zoom,
                                      properties,
                                      selectedProperty,
                                      onPropertySelect,
                                      onPositionChange
                                  }: YandexMapProps) {
    const mapRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);
    const [mapInstance, setMapInstance] = useState<any>(null);

    // Упрощенные цвета для меток
    const colors = {
        primary: '#3B82F6',     // Синий
        selected: '#EF4444'     // Красный для выбранной метки
    };

    // Обработка изменения границ карты
    const handleBoundsChange = useCallback((e: any) => {
        if (!e || !e.originalEvent) return;

        const map = e.originalEvent.target;
        const newCenter = map.getCenter();
        const newZoom = map.getZoom();
        const bounds = map.getBounds();

        onPositionChange({
            center: newCenter,
            zoom: newZoom,
            bounds: [
                [bounds[0][0], bounds[0][1]], // SW
                [bounds[1][0], bounds[1][1]]  // NE
            ]
        });
    }, [onPositionChange]);

    // Инициализация карты
    const handleMapLoad = (ymaps: any) => {
        setIsReady(true);
    };

    // Получение экземпляра карты
    const getMapInstance = (instance: any) => {
        setMapInstance(instance);
        mapRef.current = instance;

        // Установка текущего зума при инициализации
        if (instance) {
            instance.setZoom(zoom);
        }
    };

    // Центрирование карты на выбранной недвижимости
    useEffect(() => {
        if (selectedProperty && mapInstance) {
            const property = properties.find(p => p.id === selectedProperty);
            if (property && property.latitude && property.longitude) {
                mapInstance.setCenter([Number(property.latitude), Number(property.longitude)], zoom, {
                    duration: 300
                });
            }
        }
    }, [selectedProperty, properties, mapInstance, zoom]);

    // Обновление зума карты при его изменении в родительском компоненте
    useEffect(() => {
        if (mapInstance) {
            mapInstance.setZoom(zoom);
        }
    }, [zoom, mapInstance]);

    // Форматирование цены для отображения
    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return (price / 1000000).toFixed(1) + ' млн ₽';
        } else if (price >= 1000) {
            return (price / 1000).toFixed(0) + ' тыс ₽';
        } else {
            return price.toLocaleString() + ' ₽';
        }
    };

    // Создание содержимого балуна
    const createBalloonContent = (property: PostData) => {
        const price = Number(property.price || 0);
        const formattedPrice = formatPrice(price);

        const propertyType = property.property === "APARTMENT"
            ? "Квартира"
            : property.property === "HOUSE"
                ? "Дом"
                : "Участок";

        const dealType = property.type === "RENT" ? "Аренда" : "Продажа";

        return `
            <div style="padding: 10px; max-width: 200px;">
                <div style="font-weight: bold; margin-bottom: 5px;">${property.title || 'Без названия'}</div>
                <div style="font-weight: bold; color: #3B82F6; margin-bottom: 5px;">${formattedPrice}</div>
                <div style="margin-bottom: 5px;">${property.address || ''}</div>
                <div style="font-size: 12px; color: #6B7280;">${dealType} · ${propertyType}</div>
                <a href="/properties/${property.id}" style="display: inline-block; margin-top: 10px; background: #3B82F6; color: white; padding: 5px 10px; border-radius: 4px; text-decoration: none;">
                    Подробнее
                </a>
            </div>
        `;
    };

    return (
        <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY, lang: 'ru_RU' }}>
            <Map
                defaultState={{ center, zoom }}
                width="100%"
                height="100%"
                onBoundsChange={handleBoundsChange}
                onLoad={handleMapLoad}
                instanceRef={getMapInstance}
                options={{
                    suppressMapOpenBlock: true,
                }}
                modules={[
                    'control.ZoomControl',
                    'control.FullscreenControl',
                    'control.GeolocationControl',
                    'geoObject.addon.balloon',
                ]}
            >
                <Clusterer
                    options={{
                        preset: 'islands#blueClusterIcons',
                        groupByCoordinates: false,
                    }}
                >
                    {properties.map((property) => {
                        if (!property.latitude || !property.longitude) return null;

                        const isSelected = selectedProperty === property.id;
                        return (
                            <Placemark
                                key={property.id}
                                geometry={[Number(property.latitude), Number(property.longitude)]}
                                options={{
                                    preset: isSelected ? 'islands#redDotIcon' : 'islands#blueDotIcon',
                                    iconColor: isSelected ? colors.selected : colors.primary,
                                }}
                                properties={{
                                    hintContent: formatPrice(Number(property.price || 0)),
                                    balloonContent: createBalloonContent(property),
                                }}
                                onClick={() => onPropertySelect(property.id ?? "")}
                            />
                        );
                    })}
                </Clusterer>

                <ZoomControl options={{ position: { right: 10, top: 108 } }} />
                <GeolocationControl options={{ position: { right: 10, top: 178 } }} />
                <FullscreenControl options={{ position: { right: 10, top: 248 } }} />
            </Map>
        </YMaps>
    );
}