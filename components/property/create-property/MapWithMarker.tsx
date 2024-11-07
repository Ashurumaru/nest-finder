import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {extractCityFromAddress} from "@/utils/extractText";

interface MapWithMarkerProps {
    onLocationSelect: (latitude: number, longitude: number, address: string | null) => void;
    initialCenter?: [number, number];
    initialZoom?: number;
}

const MapWithMarker: React.FC<MapWithMarkerProps> = ({
                                                         onLocationSelect,
                                                         initialCenter = [105.3188, 61.524],
                                                         initialZoom = 4,
                                                     }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);
    const markerInstance = useRef<maplibregl.Marker | null>(null);

    const fetchAddress = async (latitude: number, longitude: number): Promise<string | null> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );

            if (!response.ok) {
                throw new Error("Ошибка при получении данных с Nominatim API");
            }

            const data = await response.json();
            return data.display_name; // Возвращает полный адрес в виде строки
        } catch (error) {
            console.error("Ошибка при обратном геокодировании:", error);
            return null;
        }
    };

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapInstance.current = new maplibregl.Map({
            container: mapContainerRef.current,
            style: 'https://api.maptiler.com/maps/streets/style.json?key=zytIDhaemB8gnrazMxZM',
            center: initialCenter,
            zoom: initialZoom,
        });

        mapInstance.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        mapInstance.current.on('click', async (e) => {
            const { lng, lat } = e.lngLat;

            const address = await fetchAddress(lat, lng);

            if (!markerInstance.current) {
                markerInstance.current = new maplibregl.Marker()
                    .setLngLat([lng, lat])
                    .addTo(mapInstance.current!);
            } else {
                markerInstance.current.setLngLat([lng, lat]);
            }

            alert(`Широта: ${lat}, Долгота: ${lng}, Город: ${extractCityFromAddress(address || 'адреса нет')}\nАдрес: ${address || 'Адрес не найден'}`);

            onLocationSelect(lat, lng, address);
        });

        return () => mapInstance.current?.remove();
    }, [onLocationSelect, initialCenter, initialZoom]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default MapWithMarker;
