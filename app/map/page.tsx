// app/map/page.tsx
'use client';

import {useState, useEffect, useRef, useCallback, Suspense} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import FilterPanel from '@/components/map/FilterPanel';
import PropertyCard from '@/components/map/PropertyCard';
import MapControls from '@/components/map/MapControls';
import { fetchPropertiesByBounds } from '@/services/mapService';
import { PostData } from '@/types/propertyTypes';

// Подключение Яндекс Карт динамически на стороне клиента
const YandexMap = dynamic(() => import('@/components/map/YandexMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-200 flex items-center justify-center">Загрузка карты...</div>
});

// Компонент с основной логикой карты
function MapContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Состояние для отслеживания текущих фильтров
    const [filters, setFilters] = useState({
        type: searchParams.get('deal_type') === 'rent' ? 'RENT' : 'SALE',
        propertyType: searchParams.get('offer_type') === 'flat' ? 'APARTMENT' :
            searchParams.get('offer_type') === 'house' ? 'HOUSE' :
                searchParams.get('offer_type') === 'land' ? 'LAND' : '',
        minPrice: searchParams.get('min_price') || '',
        maxPrice: searchParams.get('max_price') || '',
        rooms: searchParams.getAll('room') || []
    });

    // Состояние для отслеживания текущего положения и зума карты
    const [mapPosition, setMapPosition] = useState({
        center: [
            parseFloat(searchParams.get('center')?.split(',')[0] || '55.751574'),
            parseFloat(searchParams.get('center')?.split(',')[1] || '37.573856')
        ],
        zoom: parseInt(searchParams.get('zoom') || '10')
    });

    // Состояние для отслеживания границ карты
    const [mapBounds, setMapBounds] = useState<number[][]>([[0, 0], [0, 0]]);
    // Состояние для отслеживания объектов на карте
    const [properties, setProperties] = useState<PostData[]>([]);
    // Состояние для отслеживания видимости панели с фильтрами и списком объектов
    const [sidebarVisible, setSidebarVisible] = useState(true);
    // Состояние для отслеживания загрузки данных
    const [loading, setLoading] = useState(false);
    // Состояние для отслеживания выбранного объекта
    const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

    // Функция для обновления URL в соответствии с текущими фильтрами и положением карты
    const updateURL = useCallback(() => {
        const params = new URLSearchParams();

        // Добавление параметров фильтрации
        params.set('deal_type', filters.type === 'RENT' ? 'rent' : 'sale');

        if (filters.propertyType) {
            params.set('offer_type', filters.propertyType === 'APARTMENT' ? 'flat' :
                filters.propertyType === 'HOUSE' ? 'house' : 'land');
        }

        if (filters.minPrice) {
            params.set('min_price', filters.minPrice);
        }

        if (filters.maxPrice) {
            params.set('max_price', filters.maxPrice);
        }

        // Добавление комнат
        filters.rooms.forEach(room => {
            params.append('room', room);
        });

        // Добавление положения карты
        params.set('center', mapPosition.center.join(','));
        params.set('zoom', mapPosition.zoom.toString());

        // Обновление URL без перезагрузки страницы
        router.replace(`/map?${params.toString()}`, { scroll: false });
    }, [filters, mapPosition, router]);

    // Функция для обновления списка объектов на карте
    const fetchProperties = useCallback(async () => {
        if (mapBounds[0][0] === 0 && mapBounds[0][1] === 0) return;

        setLoading(true);
        try {
            const data = await fetchPropertiesByBounds(mapBounds, filters);
            setProperties(data);
        } catch (error) {
            console.error('Ошибка при получении объектов недвижимости:', error);
        } finally {
            setLoading(false);
        }
    }, [mapBounds, filters]);

    // Обработчик изменения фильтров
    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    // Обработчик изменения положения карты
    const handleMapPositionChange = ({ center, zoom, bounds }: any) => {
        setMapPosition({ center, zoom });
        setMapBounds(bounds);
    };

    // Обработчик выбора объекта на карте
    const handlePropertySelect = (id: string) => {
        setSelectedProperty(id);

        // Найти объект по ID
        const property = properties.find(p => p.id === id);
        if (property && property.latitude && property.longitude) {
            // Установить центр карты на выбранный объект
            setMapPosition({
                ...mapPosition,
                center: [Number(property.latitude), Number(property.longitude)]
            });
        }
    };

    // Обработчик изменения зума карты
    const handleZoomIn = () => {
        setMapPosition({
            ...mapPosition,
            zoom: Math.min(mapPosition.zoom + 1, 19)
        });
    };

    const handleZoomOut = () => {
        setMapPosition({
            ...mapPosition,
            zoom: Math.max(mapPosition.zoom - 1, 3)
        });
    };

    // Обработчик перемещения к текущему местоположению пользователя
    const handleMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setMapPosition({
                        center: [position.coords.latitude, position.coords.longitude],
                        zoom: 15
                    });
                },
                () => {
                    alert('Не удалось получить ваше местоположение');
                }
            );
        } else {
            alert('Геолокация не поддерживается вашим браузером');
        }
    };

    // Обновление URL при изменении фильтров или положения карты
    useEffect(() => {
        updateURL();
    }, [filters, mapPosition, updateURL]);

    // Загрузка объектов при изменении границ карты или фильтров
    useEffect(() => {
        fetchProperties();
    }, [mapBounds, filters, fetchProperties]);

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Карта */}
            <div className="absolute inset-0">
                <YandexMap
                    center={mapPosition.center}
                    zoom={mapPosition.zoom}
                    onPositionChange={handleMapPositionChange}
                    properties={properties}
                    selectedProperty={selectedProperty}
                    onPropertySelect={handlePropertySelect}
                />
            </div>

            {/* Панель управления картой */}
            <MapControls
                visiblePanel={sidebarVisible}
                togglePanel={() => setSidebarVisible(!sidebarVisible)}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onMyLocation={handleMyLocation}
            />

            {/* Боковая панель с фильтрами и списком объектов */}
            <div
                className={`absolute top-0 right-0 h-full bg-white shadow-lg transition-transform duration-300 transform ${
                    sidebarVisible ? 'translate-x-0' : 'translate-x-full'
                } w-96 z-10 flex flex-col`}
            >
                {/* Фильтры */}
                <FilterPanel filters={filters} onFilterChange={handleFilterChange}/>

                {/* Список объектов */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : properties.length > 0 ? (
                        properties.map(property => (
                            <div
                                key={property.id}
                                onClick={() => handlePropertySelect(property.id ?? "")}
                                className={`cursor-pointer ${selectedProperty === property.id ? 'ring-2 ring-primary' : ''}`}
                            >
                                <PropertyCard property={property} compact/>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-gray-500">Нет объектов, соответствующих фильтрам</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Основной компонент страницы с оберткой Suspense
export default function MapPage() {
    return (
        <Suspense fallback={<div className="w-full h-full bg-gray-200 flex items-center justify-center">Загрузка карты...</div>}>
            <MapContent />
        </Suspense>
    );
}
