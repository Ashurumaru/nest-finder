import { getProperties } from "@/utils/getProperties";
import PropertyList from "@/components/property/PropertyList";
import PropertyFilter from "@/components/property/PropertyFilter";
import { PropertyFilters } from "@/types/propertyTypes";
import { Type } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertiesClientWrapper } from "@/components/property/PropertiesClientWrapper";

const allowedPropertyTypes = ["APARTMENT", "HOUSE", "LAND_PLOT"] as const;
type PropertyType = typeof allowedPropertyTypes[number];

export default async function PropertiesPage({
                                                 searchParams
                                             }: {
    searchParams: Record<string, string | string[] | undefined>
}) {
    // Determine which type (SALE or RENT) to show as default
    const selectedType = searchParams.type === Type.RENT ? Type.RENT : Type.SALE;

    // Extract property type filter
    const propertyType = allowedPropertyTypes.includes(searchParams.propertyType as PropertyType)
        ? (searchParams.propertyType as PropertyType)
        : undefined;

    // Create filters based on the search parameters
    const filters: PropertyFilters = {
        type: selectedType,
        propertyType,
        searchQuery: searchParams.searchQuery as string | undefined,
        minBedrooms: searchParams.rooms ? Number(searchParams.rooms) : undefined,
        maxBedrooms: searchParams.rooms ? Number(searchParams.rooms) : undefined,
        minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
        maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    };

    // Fetch properties server-side
    const properties = await getProperties(filters);

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Use client component wrapper to handle client-side tab interactions */}
            <PropertiesClientWrapper selectedType={selectedType} searchParams={searchParams}>
                <TabsContent value={Type.SALE} className="mt-0">
                    <PropertyFilter propertyType={Type.SALE} />
                    <PropertyList properties={selectedType === Type.SALE ? properties : []} />
                </TabsContent>

                <TabsContent value={Type.RENT} className="mt-0">
                    <PropertyFilter propertyType={Type.RENT} />
                    <PropertyList properties={selectedType === Type.RENT ? properties : []} />
                </TabsContent>
            </PropertiesClientWrapper>
        </div>
    );
}