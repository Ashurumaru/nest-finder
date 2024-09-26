// import React from "react";
// import { fetchProperties } from "@/utils/requests";
// import FeaturedPropertyCard from "@/components/FeaturedPropertyCard";
//
// interface Property {
//     id: string;
//     title: string;
//     price: number;
//     imageUrls: string[];
//     address: string;
//     city: string;
//     numBedrooms: number;
//     numBathrooms: number;
//     square_feet?: number;
//     type: "sale" | "rent";
//     property: "apartment" | "house" | "condo" | "townhouse" | "commercial" | "land";
// }
//
// const FeaturedProperties = async () => {
//     const properties: Property[] | null = await fetchProperties({ showFeatured: true });
//
//     const randomProperties = properties
//         ? properties.sort(() => 0.5 - Math.random()).slice(0, 3)
//         : [];
//
//     return (
//         randomProperties.length > 0 && (
//             <section className="bg-blue-50 px-4 pt-6 pb-10">
//                 <div className="container-xl lg:container m-auto">
//                     <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
//                         Featured Properties
//                     </h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {randomProperties.map((property) => (
//                             <FeaturedPropertyCard key={property.id} property={property} />
//                         ))}
//                     </div>
//                 </div>
//             </section>
//         )
//     );
// };
//
// export default FeaturedProperties;
