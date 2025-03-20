'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import FilterPanel from '@/components/map/FilterPanel';
import PropertyCard from '@/components/map/PropertyCard';
import MapControls from '@/components/map/MapControls';
import { fetchPropertiesByBounds } from '@/services/mapService';
import { PostData } from '@/types/propertyTypes';

// Dynamically import YandexMap to ensure client-side only rendering
const YandexMap = dynamic(() => import('@/components/map/YandexMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Загрузка карты...</span>
        </div>
    )
});

// Default center coordinates (Moscow)
const DEFAULT_CENTER = [55.751574, 37.573856];
const DEFAULT_ZOOM = 10;
const MIN_ZOOM = 3;
const MAX_ZOOM = 19;

// Main component with map logic
function MapContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get initial state from URL params
    const [filters, setFilters] = useState({
        type: searchParams.get('deal_type') === 'rent' ? 'RENT' : 'SALE',
        propertyType: searchParams.get('offer_type') === 'flat' ? 'APARTMENT' :
            searchParams.get('offer_type') === 'house' ? 'HOUSE' :
                searchParams.get('offer_type') === 'land' ? 'LAND' : '',
        minPrice: searchParams.get('min_price') || '',
        maxPrice: searchParams.get('max_price') || '',
        rooms: searchParams.getAll('room') || [],
        sortBy: searchParams.get('sort') || '',
        maxDistance: searchParams.get('distance') || ''
    });

    // Map state
    const [mapPosition, setMapPosition] = useState({
        center: [
            parseFloat(searchParams.get('center')?.split(',')[0] || String(DEFAULT_CENTER[0])),
            parseFloat(searchParams.get('center')?.split(',')[1] || String(DEFAULT_CENTER[1]))
        ],
        zoom: parseInt(searchParams.get('zoom') || String(DEFAULT_ZOOM))
    });
    const [initialMapPosition] = useState(mapPosition);
    const [mapBounds, setMapBounds] = useState<number[][]>([[0, 0], [0, 0]]);
    const [properties, setProperties] = useState<PostData[]>([]);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
    const [lockMap, setLockMap] = useState(false);
    const [mapKey, setMapKey] = useState(Date.now()); // For forcing re-render

    // Update URL with current filters and map position
    const updateURL = useCallback(() => {
        const params = new URLSearchParams();

        // Deal type parameter
        params.set('deal_type', filters.type === 'RENT' ? 'rent' : 'sale');

        // Property type parameter
        if (filters.propertyType) {
            params.set('offer_type', filters.propertyType === 'APARTMENT' ? 'flat' :
                filters.propertyType === 'HOUSE' ? 'house' : 'land');
        }

        // Price range parameters
        if (filters.minPrice) {
            params.set('min_price', filters.minPrice);
        }
        if (filters.maxPrice) {
            params.set('max_price', filters.maxPrice);
        }

        // Room filters
        filters.rooms.forEach(room => {
            params.append('room', room);
        });

        // Sort parameter
        if (filters.sortBy) {
            params.set('sort', filters.sortBy);
        }

        // Distance parameter
        if (filters.maxDistance) {
            params.set('distance', filters.maxDistance);
        }

        // Map position parameters
        params.set('center', mapPosition.center.join(','));
        params.set('zoom', mapPosition.zoom.toString());

        // Update URL without page reload
        router.replace(`/map?${params.toString()}`, { scroll: false });
    }, [filters, mapPosition, router]);

    // Fetch properties based on current map bounds and filters
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

    // Filter change handler
    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    // Map position change handler
    const handleMapPositionChange = ({ center, zoom, bounds }: any) => {
        if (lockMap) return;

        setMapPosition({ center, zoom });
        setMapBounds(bounds);
    };

    // Property selection handler
    const handlePropertySelect = (id: string) => {
        setSelectedProperty(id === selectedProperty ? null : id);

        // Find property by ID and center map on it
        const property = properties.find(p => p.id === id);
        if (property && property.latitude && property.longitude) {
            setMapPosition({
                ...mapPosition,
                center: [Number(property.latitude), Number(property.longitude)]
            });
        }
    };

    // Map controls handlers
    const handleZoomIn = () => {
        setMapPosition({
            ...mapPosition,
            zoom: Math.min(mapPosition.zoom + 1, MAX_ZOOM)
        });
    };

    const handleZoomOut = () => {
        setMapPosition({
            ...mapPosition,
            zoom: Math.max(mapPosition.zoom - 1, MIN_ZOOM)
        });
    };

    const handleMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setMapPosition({
                        center: [position.coords.latitude, position.coords.longitude],
                        zoom: 15
                    });
                },
                (error) => {
                    console.error('Ошибка геолокации:', error);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    };

    const handleResetView = () => {
        setMapPosition(initialMapPosition);
    };

    const toggleLockMap = () => {
        setLockMap(!lockMap);
    };

    // Reset map (force re-render)
    const handleResetMap = () => {
        setMapKey(Date.now());
    };

    // Update URL when filters or map position change
    useEffect(() => {
        updateURL();
    }, [filters, mapPosition, updateURL]);

    // Fetch properties when map bounds or filters change
    useEffect(() => {
        fetchProperties();
    }, [mapBounds, filters, fetchProperties]);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-gray-50">
            {/* Map container */}
            <div className="absolute inset-0">
                <YandexMap
                    key={mapKey}
                    center={mapPosition.center}
                    zoom={mapPosition.zoom}
                    onPositionChange={handleMapPositionChange}
                    properties={properties}
                    selectedProperty={selectedProperty}
                    onPropertySelect={handlePropertySelect}
                />
            </div>

            {/* Map Controls */}
            <MapControls
                visiblePanel={sidebarVisible}
                togglePanel={() => setSidebarVisible(!sidebarVisible)}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onMyLocation={handleMyLocation}
                onResetView={handleResetView}
                lockMap={lockMap}
                toggleLockMap={toggleLockMap}
                zoom={mapPosition.zoom}
                maxZoom={MAX_ZOOM}
                minZoom={MIN_ZOOM}
            />

            {/* Sidebar */}
            <div
                className={`absolute top-0 right-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
                    sidebarVisible ? 'translate-x-0' : 'translate-x-full'
                } w-96 z-10 flex flex-col`}
            >
                {/* Filters */}
                <FilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    totalProperties={properties.length}
                    loading={loading}
                />

                {/* Properties list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            <span className="ml-3 text-gray-600">Загрузка объектов...</span>
                        </div>
                    ) : properties.length > 0 ? (
                        properties.map(property => (
                            <div
                                key={property.id}
                                onClick={() => handlePropertySelect(property.id ?? "")}
                                className={`cursor-pointer transition-all duration-200 ${
                                    selectedProperty === property.id
                                        ? 'ring-2 ring-primary scale-[1.01]'
                                        : 'hover:shadow-md hover:scale-[1.01]'
                                }`}
                            >
                                <PropertyCard property={property} compact />
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col justify-center items-center h-64 text-center">
                            <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
                            </svg>
                            <p className="text-gray-500 font-medium">Нет объектов, соответствующих фильтрам</p>
                            <p className="text-gray-400 text-sm mt-2">Попробуйте изменить параметры поиска или переместите карту</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Main page component with Suspense wrapper
export default function MapPage() {
    return (
        <Suspense fallback={
            <div className="w-full h-screen bg-gray-100 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600 font-medium">Загрузка карты...</p>
            </div>
        }>
            <MapContent />
        </Suspense>
    );
}