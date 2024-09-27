// types/propertyTypes.ts

export interface PostDetail {
    propertySize?: number | null;  // Разрешаем null в качестве допустимого значения
}

export interface Property {
    id: string;
    title: string;
    price: number;
    imageUrls: string[];
    address: string;
    city: string;
    numBedrooms: number;
    numBathrooms: number;
    postDetail?: PostDetail;
    type: 'sale' | 'rent';
    property: 'apartment' | 'house' | 'condo' | 'townhouse' | 'commercial' | 'land';
}
