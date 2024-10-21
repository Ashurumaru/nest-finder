// app/rent/page.tsx

import { getProperties } from "@/utils/getProperties";
import PropertyList from "@/components/property/PropertyList";
import { PropertyFilters } from "@/types/propertyTypes";

interface RentPageProps {
    searchParams: Record<string, string | string[] | undefined>;
}

const allowedPropertyTypes = ["APARTMENT", "HOUSE", "LAND_PLOT"] as const;
type PropertyType = typeof allowedPropertyTypes[number];

export default async function RentPage({ searchParams }: RentPageProps) {
    const propertyTypeParam = searchParams.propertyType;

    let propertyType: PropertyType | undefined = undefined;

    if (
        typeof propertyTypeParam === "string" &&
        allowedPropertyTypes.includes(propertyTypeParam as PropertyType)
    ) {
        propertyType = propertyTypeParam as PropertyType;
    }

    const filters: PropertyFilters = {
        type: "RENT",
        propertyType: propertyType,
        minBedrooms: searchParams.rooms ? Number(searchParams.rooms) : undefined,
        minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
        maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
        searchQuery: searchParams.searchQuery as string,
    };

    const properties = await getProperties(filters);

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Недвижимость для аренды</h1>
            <PropertyList initialProperties={properties}  propertyType="RENT"/>
        </div>
    );
}
