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
    const [ymaps, setYmaps] = useState<any>(null);
    const [map, setMap] = useState<any>(null);
    const [objectManager, setObjectManager] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

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
                const ymaps3 = (window as any).ymaps3;

                // Save ymaps instance
                setYmaps(ymaps3);

                // Create map - ensure mapRef.current is not null before using it
                if (!mapRef.current) return;

                const ymap = new ymaps3.YMap(mapRef.current, {
                    location: {
                        center: [center[1], center[0]], // Yandex uses [lon, lat]
                        zoom: zoom
                    }
                });

                // Add map layers with proper parameters
                const defaultSchemeLayer = new ymaps3.YMapDefaultSchemeLayer({});
                ymap.addChild(defaultSchemeLayer);

                const defaultFeaturesLayer = new ymaps3.YMapDefaultFeaturesLayer({});
                ymap.addChild(defaultFeaturesLayer);

                // Create ObjectManager for object management
                // Use YMapObjectManager instead of YMapDefaultObjectManager
                const manager = new ymaps3.YMapObjectManager({});
                ymap.addChild(manager);
                setObjectManager(manager);

                // Add controls
                const controls = new ymaps3.YMapControls({});
                const zoomControl = new ymaps3.YMapZoomControl({});
                controls.addChild(zoomControl);
                ymap.addChild(controls);

                // Handle map position changes
                // Use the proper event listener method and access bounds correctly
                ymap.on('boundschange', (event: any) => {
                    const mapCenter = event.location.center;
                    const mapZoom = event.location.zoom;
                    // Access bounds through the correct property
                    const mapBounds = ymap.bounds;

                    onPositionChange({
                        center: [mapCenter[1], mapCenter[0]], // Convert to [lat, lon]
                        zoom: mapZoom,
                        bounds: [
                            [mapBounds.south, mapBounds.west], // SW
                            [mapBounds.north, mapBounds.east]  // NE
                        ]
                    });
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
    }, [isLoaded, map, center, zoom, onPositionChange]);

    // Update map center and zoom
    useEffect(() => {
        if (!map) return;

        map.setLocation?.({
            center: [center[1], center[0]], // Yandex uses [lon, lat]
            zoom: zoom
        });
    }, [map, center, zoom]);

    // Update markers when property list changes
    useEffect(() => {
        if (!map || !objectManager || !properties.length) return;

        // Remove all markers
        objectManager.removeAll?.();

        // Add new markers
        properties.forEach((property) => {
            if (!property.latitude || !property.longitude) return;

            try {
                // Create marker with proper options
                const marker = new ymaps.YMapMarker(
                    {
                        coordinates: [Number(property.longitude), Number(property.latitude)],
                        properties: {
                            id: property.id,
                            title: property.title || property.address,
                            price: property.price,
                            type: property.type,
                            propertyType: property.property
                        }
                    },
                    {}
                );

                // Create DOM element for marker
                const markerElement = document.createElement('div');
                markerElement.className = 'flex items-center justify-center';
                markerElement.innerHTML = `
          <div class="${selectedProperty === property.id ? 'bg-primary text-white' : 'bg-white text-primary'}
            font-bold text-sm px-2 py-1 rounded-md shadow-md transition-colors">
            ${Number(property.price).toLocaleString()} ₽
          </div>
        `;

                // Add click handler
                markerElement.onclick = () => {
                    onPropertySelect(property.id ?? "");
                };

                // Set DOM element for marker using the proper method
                marker.element.appendChild(markerElement);

                // Add marker to the map
                objectManager.addChild?.(marker);
            } catch (error) {
                console.error("Error creating marker:", error);
            }
        });
    }, [map, objectManager, properties, selectedProperty, onPropertySelect, ymaps]);

    return (
        <>
            <Script
                src={`https://api-maps.yandex.ru/v3/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY}&lang=ru_RU`}
                onLoad={handleScriptLoad}
                strategy="afterInteractive"
            />
            <div ref={mapRef} className="w-full h-full" />
        </>
    );
}