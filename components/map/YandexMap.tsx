'use client';

import { YMaps, Map, Placemark, Clusterer, ZoomControl, GeolocationControl, FullscreenControl } from '@pbe/react-yandex-maps';
import { PostData } from '@/types/propertyTypes';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

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
    const boundsChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const prevCenterRef = useRef<number[]>(center);
    const prevZoomRef = useRef<number>(zoom);
    const userInteractionRef = useRef<boolean>(false);

    // Оптимизированные цвета для меток с поддержкой темы
    const colors = useMemo(() => ({
        primary: '#3B82F6',   // Синий
        secondary: '#6366F1', // Индиго
        selected: '#EF4444',  // Красный для выбранной метки
        hover: '#10B981',     // Зеленый для ховера
    }), []);

    // Создание макета для меток с учетом состояния
    const createPlacemarkOptions = useCallback((isSelected: boolean) => {
        return {
            preset: isSelected ? 'islands#redDotIcon' : 'islands#blueDotIcon',
            iconColor: isSelected ? colors.selected : colors.primary,
            // Добавляем анимацию появления для меток
            openBalloonOnClick: true,
            hideIconOnBalloonOpen: false,
        };
    }, [colors]);

    // Дебаунсинг изменения границ карты для предотвращения дергания
    const handleBoundsChange = useCallback((e: any) => {
        if (!e || !e.originalEvent) return;

        // Проверяем, вызвано ли событие пользовательским взаимодействием
        userInteractionRef.current = true;

        // Очищаем предыдущий таймаут, если он существует
        if (boundsChangeTimeoutRef.current) {
            clearTimeout(boundsChangeTimeoutRef.current);
        }

        // Устанавливаем новый таймаут для дебаунсинга
        boundsChangeTimeoutRef.current = setTimeout(() => {
            const map = e.originalEvent.target;
            const newCenter = map.getCenter();
            const newZoom = map.getZoom();
            const bounds = map.getBounds();

            // Проверяем, изменились ли координаты или зум
            if (
                prevCenterRef.current[0] !== newCenter[0] ||
                prevCenterRef.current[1] !== newCenter[1] ||
                prevZoomRef.current !== newZoom
            ) {
                // Обновляем рефы
                prevCenterRef.current = newCenter;
                prevZoomRef.current = newZoom;

                // Отправляем данные родительскому компоненту
                onPositionChange({
                    center: newCenter,
                    zoom: newZoom,
                    bounds: [
                        [bounds[0][0], bounds[0][1]], // SW
                        [bounds[1][0], bounds[1][1]]  // NE
                    ]
                });
            }

            userInteractionRef.current = false;
        }, 300); // Задержка в 300 мс
    }, [onPositionChange]);

    // Инициализация карты
    const handleMapLoad = useCallback((ymaps: any) => {
        setIsReady(true);
    }, []);

    // Получение экземпляра карты с улучшенной обработкой
    const getMapInstance = useCallback((instance: any) => {
        if (instance) {
            // Сохраняем инстанс
            setMapInstance(instance);
            mapRef.current = instance;

            // Настройка параметров карты для плавности
            instance.options.set({
                // Включаем плавное перетаскивание
                dragInertia: true,
                // Плавный зум
                smoothZooming: true
            });

            // Устанавливаем текущий зум
            instance.setZoom(zoom, {
                duration: 0 // Без анимации при инициализации
            });
        }
    }, [zoom]);

    // Центрирование карты на выбранной недвижимости с плавностью
    useEffect(() => {
        if (selectedProperty && mapInstance && !userInteractionRef.current) {
            const property = properties.find(p => p.id === selectedProperty);
            if (property && property.latitude && property.longitude) {
                // Используем плавную анимацию перемещения
                mapInstance.setCenter(
                    [Number(property.latitude), Number(property.longitude)],
                    mapInstance.getZoom(), // Сохраняем текущий зум
                    {
                        duration: 500,
                        timingFunction: 'ease-in-out'
                    }
                );
            }
        }
    }, [selectedProperty, properties, mapInstance]);

    // Обновление зума карты с плавной анимацией
    useEffect(() => {
        if (mapInstance && prevZoomRef.current !== zoom && !userInteractionRef.current) {
            prevZoomRef.current = zoom;
            mapInstance.setZoom(zoom, {
                duration: 300,
                timingFunction: 'ease-out'
            });
        }
    }, [zoom, mapInstance]);

    // Обновление центра карты с плавной анимацией при внешнем изменении
    useEffect(() => {
        if (
            mapInstance &&
            !userInteractionRef.current &&
            (prevCenterRef.current[0] !== center[0] || prevCenterRef.current[1] !== center[1])
        ) {
            prevCenterRef.current = center;
            mapInstance.setCenter(center, mapInstance.getZoom(), {
                duration: 500,
                timingFunction: 'ease-in-out'
            });
        }
    }, [center, mapInstance]);

    // Очистка таймаутов при размонтировании компонента
    useEffect(() => {
        return () => {
            if (boundsChangeTimeoutRef.current) {
                clearTimeout(boundsChangeTimeoutRef.current);
            }
        };
    }, []);

    // Форматирование цены с учетом валюты
    const formatPrice = useCallback((price: number) => {
        if (!price) return 'Цена не указана';

        if (price >= 1000000) {
            return (price / 1000000).toFixed(1) + ' млн ₽';
        } else if (price >= 1000) {
            return (price / 1000).toFixed(0) + ' тыс ₽';
        } else {
            return price.toLocaleString() + ' ₽';
        }
    }, []);

    // Создание содержимого балуна с улучшенным дизайном
    const createBalloonContent = useCallback((property: PostData) => {
        const price = Number(property.price || 0);
        const formattedPrice = formatPrice(price);

        const propertyType = property.property === "APARTMENT"
            ? "Квартира"
            : property.property === "HOUSE"
                ? "Дом"
                : "Участок";

        const dealType = property.type === "RENT" ? "Аренда" : "Продажа";

        return `
            <div style="padding: 12px; max-width: 240px; font-family: system-ui, -apple-system, sans-serif;">
                <div style="font-weight: 600; margin-bottom: 8px; font-size: 16px;">${property.title || 'Без названия'}</div>
                <div style="font-weight: 700; color: #3B82F6; margin-bottom: 8px; font-size: 18px;">${formattedPrice}</div>
                <div style="margin-bottom: 8px; color: #4B5563;">${property.address || ''}</div>
                <div style="font-size: 14px; color: #6B7280; display: flex; gap: 8px; margin-bottom: 12px;">
                    <span style="display: inline-flex; align-items: center;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #3B82F6; margin-right: 4px;"></span>
                        ${dealType}
                    </span>
                    <span style="display: inline-flex; align-items: center;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #10B981; margin-right: 4px;"></span>
                        ${propertyType}
                    </span>
                </div>
                <a href="/properties/${property.id}" style="display: inline-block; background: #3B82F6; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 500; text-align: center; width: 100%; transition: background-color 0.2s;">
                    Подробнее
                </a>
            </div>
        `;
    }, [formatPrice]);

    // Оптимизированное отображение плейсмарков с мемоизацией
    const renderPlacemarks = useMemo(() => {
        return properties.map((property) => {
            if (!property.latitude || !property.longitude) return null;

            const isSelected = selectedProperty === property.id;

            return (
                <Placemark
                    key={property.id}
                    geometry={[Number(property.latitude), Number(property.longitude)]}
                    options={createPlacemarkOptions(isSelected)}
                    properties={{
                        hintContent: formatPrice(Number(property.price || 0)),
                        balloonContent: createBalloonContent(property),
                    }}
                    onClick={() => onPropertySelect(property.id ?? "")}
                />
            );
        });
    }, [properties, selectedProperty, formatPrice, createBalloonContent, createPlacemarkOptions, onPropertySelect]);

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
                    yandexMapDisablePoiInteractivity: true,
                    avoidFractionalZoom: false, // Разрешаем дробный зум для более плавной анимации
                }}
                modules={[
                    'control.ZoomControl',
                    'control.FullscreenControl',
                    'control.GeolocationControl',
                    'geoObject.addon.balloon',
                    'geoObject.addon.hint',
                ]}
            >
                <Clusterer
                    options={{
                        preset: 'islands#blueClusterIcons',
                        groupByCoordinates: false,
                        clusterDisableClickZoom: false,
                        clusterHideIconOnBalloonOpen: false,
                        geoObjectHideIconOnBalloonOpen: false,
                        // Настройки для плавного кластеринга
                        hasBalloon: true,
                        hasHint: true,
                        // Анимированные кластеры
                        clusterIconShape: {
                            type: 'Circle',
                            coordinates: [0, 0],
                            radius: 20
                        }
                    }}
                >
                    {renderPlacemarks}
                </Clusterer>

                <FullscreenControl options={{ position: { left: 22, top: 80 } }} />
            </Map>
        </YMaps>
    );
}