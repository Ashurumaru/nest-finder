'use client';

import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { PostData } from '@/types/propertyTypes';

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
    // Обработчик изменения границ карты
    const handleBoundsChange = (e: any) => {
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
    };

    return (
        <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY }}>
            <Map
                defaultState={{ center, zoom }}
                width="100%"
                height="100%"
                onBoundsChange={handleBoundsChange}
                options={{ suppressMapOpenBlock: true }}
            >
                {properties.map((property) => {
                    if (!property.latitude || !property.longitude) return null;

                    return (
                        <Placemark
                            key={property.id}
                            geometry={[Number(property.latitude), Number(property.longitude)]}
                            options={{
                                preset: selectedProperty === property.id
                                    ? 'islands#redDotIconWithCaption'
                                    : 'islands#blueDotIconWithCaption',
                                // iconCaption: `${Number(property.price).toLocaleString()} ₽`,
                                // iconCaptionMaxWidth: '200'
                            }}
                            properties={{
                                hintContent: property.title || property.address
                            }}
                            onClick={() => onPropertySelect(property.id ?? "")}
                        />
                    );
                })}
            </Map>
        </YMaps>
    );
}
