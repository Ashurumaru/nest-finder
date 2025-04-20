'use client';

import React, { useEffect, useRef, useState } from 'react';
import { YMaps, Map, Placemark, ZoomControl, GeolocationControl, FullscreenControl } from '@pbe/react-yandex-maps';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, MapPin } from 'lucide-react';
import { extractCityFromAddress } from "@/utils/extractText";

interface MapWithMarkerProps {
    onLocationSelect: (latitude: number, longitude: number, address: string | null) => void;
    initialCenter?: [number, number];
    initialZoom?: number;
}

const MapWithMarker: React.FC<MapWithMarkerProps> = ({
                                                               onLocationSelect,
                                                               initialCenter = [37.618423, 55.751244], // Moscow by default
                                                               initialZoom = 10,
                                                           }) => {
    const mapRef = useRef<any>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
        initialCenter[0] !== 0 && initialCenter[1] !== 0 ? initialCenter : null
    );

    // Reverse geocoding function using Yandex's geocoder
    const fetchAddress = async (latitude: number, longitude: number): Promise<string | null> => {
        try {
            if (!mapRef.current || !mapRef.current.ymaps) {
                return null;
            }

            const ymaps = mapRef.current.ymaps;
            const geocodeResult = await ymaps.geocode([longitude, latitude]);

            if (geocodeResult && geocodeResult.geoObjects.get(0)) {
                return geocodeResult.geoObjects.get(0).getAddressLine();
            }

            return null;
        } catch (error) {
            console.error("Ошибка при обратном геокодировании:", error);
            setError("Не удалось определить адрес по указанным координатам");
            return null;
        }
    };

    // Handler for map clicks
    const handleMapClick = async (e: any) => {
        try {
            const coords = e.get('coords');
            const lat = coords[0];
            const lng = coords[1];

            setMarkerPosition([lat, lng]);

            const address = await fetchAddress(lat, lng);
            onLocationSelect(lat, lng, address);
        } catch (error) {
            console.error("Error handling map click:", error);
            setError("Ошибка при выборе местоположения");
        }
    };

    // Handler for marker drag end
    const handleMarkerDragEnd = async (e: any) => {
        try {
            const marker = e.get('target');
            const coords = marker.geometry.getCoordinates();
            const lat = coords[0];
            const lng = coords[1];

            setMarkerPosition([lat, lng]);

            const address = await fetchAddress(lat, lng);
            onLocationSelect(lat, lng, address);
        } catch (error) {
            console.error("Error handling marker drag:", error);
        }
    };

    // Handler for map load
    const handleMapLoad = (ymaps: any) => {
        setIsMapLoaded(true);
        mapRef.current = { ymaps };
    };

    return (
        <div className="space-y-2">
            <Card className="relative rounded-lg overflow-hidden" style={{ height: '400px' }}>
                <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY, lang: 'ru_RU' }}>
                    <Map
                        defaultState={{
                            center: [initialCenter[1], initialCenter[0]], // Yandex uses [lng, lat] order
                            zoom: initialZoom
                        }}
                        width="100%"
                        height="100%"
                        onClick={handleMapClick}
                        onLoad={handleMapLoad}
                        options={{
                            suppressMapOpenBlock: true,
                            yandexMapDisablePoiInteractivity: true,
                        }}
                        modules={[
                            'control.ZoomControl',
                            'control.FullscreenControl',
                            'control.GeolocationControl',
                            'geocode',
                        ]}
                    >
                        {markerPosition && (
                            <Placemark
                                geometry={[markerPosition[0], markerPosition[1]]}
                                options={{
                                    draggable: true,
                                    preset: 'islands#redDotIcon',
                                }}
                                properties={{
                                    hintContent: 'Перетащите маркер для изменения местоположения'
                                }}
                                modules={['geoObject.addon.hint']}
                                instanceRef={(ref: any) => {
                                    if (ref) {
                                        ref.events.add('dragend', handleMarkerDragEnd);
                                    }
                                }}
                            />
                        )}
                        <ZoomControl options={{ position: { right: 10, top: 10 } }} />
                        <GeolocationControl options={{ position: { right: 10, top: 50 } }} />
                        <FullscreenControl options={{ position: { right: 10, top: 90 } }} />
                    </Map>
                </YMaps>

                {!isMapLoaded && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-2"></div>
                            <p className="text-sm text-muted-foreground">Загрузка карты...</p>
                        </div>
                    </div>
                )}

                {isMapLoaded && (
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
                        <div className="bg-white/90 px-4 py-2 rounded-full shadow-md text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-destructive" />
                            Нажмите на карту или перетащите маркер для выбора местоположения
                        </div>
                    </div>
                )}
            </Card>

            {error && (
                <Alert variant="destructive">
                    <Info className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default MapWithMarker;