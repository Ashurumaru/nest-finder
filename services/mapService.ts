// services/mapService.ts
import { PostData } from "@/types/propertyTypes";

// Use relative URLs for API calls in Next.js
const getApiUrl = () => {
    // Client-side: use relative URL
    return '/api/properties/map';
};

interface MapFilters {
    type?: string;
    propertyType?: string;
    minPrice?: string;
    maxPrice?: string;
    rooms?: string[];
}

export async function fetchPropertiesByBounds(
    bounds: number[][],
    filters: MapFilters
): Promise<PostData[]> {
    const url = new URL(getApiUrl(), window.location.origin);

    // Add bounds parameters
    url.searchParams.append("swLat", bounds[0][0].toString());
    url.searchParams.append("swLng", bounds[0][1].toString());
    url.searchParams.append("neLat", bounds[1][0].toString());
    url.searchParams.append("neLng", bounds[1][1].toString());

    // Add filter parameters
    if (filters.type) {
        url.searchParams.append("type", filters.type);
    }

    if (filters.propertyType) {
        url.searchParams.append("property", filters.propertyType);
    }

    if (filters.minPrice) {
        url.searchParams.append("minPrice", filters.minPrice);
    }

    if (filters.maxPrice) {
        url.searchParams.append("maxPrice", filters.maxPrice);
    }

    if (filters.rooms && filters.rooms.length > 0) {
        filters.rooms.forEach(room => {
            url.searchParams.append("rooms", room);
        });
    }

    try {
        const res = await fetch(url.toString(), {
            method: 'GET',
            next: { revalidate: 0 }, // Disable caching
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Error fetching properties');
        }

        return await res.json();
    } catch (error) {
        console.error('Error in fetchPropertiesByBounds:', error);
        throw error;
    }
}