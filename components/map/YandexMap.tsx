'use client';

import { useEffect, useRef, useState } from 'react';
import { PostData } from '@/types/propertyTypes';
import Script from 'next/script';

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
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const markersRef = useRef<any[]>([]);

    // Load Yandex Maps scripts
    const handleScriptLoad = () => {
        setIsLoaded(true);
    };

    // Initialize map
    useEffect(() => {
        if (!isLoaded || !mapRef.current || map) return;

        const initMap = async () => {
            try {
                // Wait for ymaps to load
                await (window as any).ymaps3.ready;

                const {
                    YMap,
                    YMapDefaultSchemeLayer,
                    YMapDefaultFeaturesLayer,
                    YMapControls,
                    YMapMarker
                } = (window as any).ymaps3;

                // Import controls
                const { YMapZoomControl } = await (window as any).ymaps3.import('@yandex/ymaps3-controls@0.0.1');

                // Create map
                const ymap = new YMap(mapRef.current, {
                    location: {
                        center: [center[1], center[0]], // Yandex uses [lon, lat]
                        zoom: zoom
                    }
                });

                // Add map layers
                ymap.addChild(new YMapDefaultSchemeLayer());
                ymap.addChild(new YMapDefaultFeaturesLayer());

                // Add controls
                const controls = new YMapControls({ position: 'right' });
                controls.addChild(new YMapZoomControl({}));
                ymap.addChild(controls);

                // Handle map position changes
                ymap.on('boundschange', (event: any) => {
                    if (!event.location) return;

                    const mapCenter = event.location.center;
                    const mapZoom = event.location.zoom;
                    const mapBounds = ymap.getBounds();

                    if (mapCenter && mapZoom && mapBounds) {
                        onPositionChange({
                            center: [mapCenter[1], mapCenter[0]], // Convert to [lat, lon]
                            zoom: mapZoom,
                            bounds: [
                                [mapBounds.min[1], mapBounds.min[0]], // SW
                                [mapBounds.max[1], mapBounds.max[0]]  // NE
                            ]
                        });
                    }
                });

                setMap(ymap);
            } catch (error) {
                console.error("Error initializing Yandex Map:", error);
            }
        };

        initMap();

        return () => {
            if (map) {
                map.destroy?.();
            }
        };
    }, [isLoaded, center, zoom, onPositionChange]);

    // Update map center and zoom when props change
    useEffect(() => {
        if (!map) return;

        map.setLocation({
            center: [center[1], center[0]], // Yandex uses [lon, lat]
            zoom: zoom,
            duration: 400
        });
    }, [map, center, zoom]);

    // Update markers when property list changes
    useEffect(() => {
        if (!map || !isLoaded || !properties.length) return;

        // Remove existing markers
        markersRef.current.forEach(marker => {
            if (map.getChild(marker)) {
                map.removeChild(marker);
            }
        });
        markersRef.current = [];

        const createMarkers = async () => {
            try {
                const { YMapMarker } = (window as any).ymaps3;

                // Add new markers
                properties.forEach((property) => {
                    if (!property.latitude || !property.longitude) return;

                    // Create marker element
                    const markerElement = document.createElement('div');
                    markerElement.className = 'flex items-center justify-center';
                    markerElement.innerHTML = `
                        <div class="${selectedProperty === property.id ? 'bg-primary text-white' : 'bg-white text-primary'}
                            font-bold text-sm px-2 py-1 rounded-md shadow-md transition-colors">
                            ${Number(property.price).toLocaleString()} ₽
                        </div>
                    `;

                    // Create marker
                    const marker = new YMapMarker({
                        coordinates: [Number(property.longitude), Number(property.latitude)],
                        properties: {
                            id: property.id,
                            title: property.title || property.address,
                            price: property.price
                        }
                    }, markerElement);

                    // Add click handler
                    markerElement.onclick = () => {
                        onPropertySelect(property.id ?? "");
                    };

                    // Add marker to map
                    map.addChild(marker);
                    markersRef.current.push(marker);
                });
            } catch (error) {
                console.error("Error creating markers:", error);
            }
        };

        createMarkers();
    }, [map, properties, selectedProperty, onPropertySelect, isLoaded]);

    return (
        <>
            <Script
                src={`https://api-maps.yandex.ru/3.0/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY}&lang=ru_RU`}
                onLoad={handleScriptLoad}
                strategy="afterInteractive"
            />
            <div ref={mapRef} className="w-full h-full" />
        </>
    );
}