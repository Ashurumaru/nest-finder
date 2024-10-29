// app/sale/page.tsx
import { getProperties } from "@/utils/getProperties";
import PropertyList from "@/components/property/PropertyList";
import { PropertyFilters } from "@/types/propertyTypes";
import { Type } from "@prisma/client";

const allowedPropertyTypes = ["APARTMENT", "HOUSE", "LAND_PLOT"] as const;
type PropertyType = typeof allowedPropertyTypes[number];

export default async function SalePage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
    const propertyType = allowedPropertyTypes.includes(searchParams.propertyType as PropertyType)
        ? (searchParams.propertyType as PropertyType)
        : undefined;

    const filters: PropertyFilters = {
        type: Type.SALE,
        propertyType,
        searchQuery: searchParams.searchQuery as string | undefined,
        minBedrooms: searchParams.rooms ? Number(searchParams.rooms) : undefined,
        maxBedrooms: searchParams.rooms ? Number(searchParams.rooms) : undefined,
        minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
        maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    };

    const properties = await getProperties(filters);

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Недвижимость на продажу</h1>
            <PropertyList initialProperties={properties} propertyType={Type.SALE} />
        </div>
    );
}
