// app/sale/page.tsx

import { getProperties } from "@/utils/getProperties";
import PropertyList from "@/components/PropertyList";
import { PropertyFilters } from "@/types/propertyTypes";

interface SalePageProps {
    searchParams: Record<string, string | string[] | undefined>;
}

// Определяем допустимые типы недвижимости
const allowedPropertyTypes = ["apartment", "house", "condo", "townhouse", "commercial", "land"] as const;
type PropertyType = typeof allowedPropertyTypes[number];

export default async function SalePage({ searchParams }: SalePageProps) {
    const propertyTypeParam = searchParams.propertyType;

    let propertyType: PropertyType | undefined = undefined;

    if (
        typeof propertyTypeParam === "string" &&
        allowedPropertyTypes.includes(propertyTypeParam as PropertyType)
    ) {
        propertyType = propertyTypeParam as PropertyType;
    }

    // Обработка параметра "rooms"
    const roomsParam = searchParams.rooms;

    let minBedrooms: number | undefined = undefined;
    let maxBedrooms: number | undefined = undefined;

    if (typeof roomsParam === "string") {
        if (roomsParam === "5+") {
            minBedrooms = 5;
        } else {
            const numRooms = Number(roomsParam);
            if (!isNaN(numRooms)) {
                minBedrooms = numRooms;
                maxBedrooms = numRooms;
            }
        }
    }

    const filters: PropertyFilters = {
        type: "sale",
        propertyType: propertyType,
        minBedrooms: minBedrooms,
        maxBedrooms: maxBedrooms,
        minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
        maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
        searchQuery: searchParams.searchQuery as string,
    };

    const properties = await getProperties(filters);

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Недвижимость на продажу</h1>
            <PropertyList initialProperties={properties} />
        </div>
    );
}
