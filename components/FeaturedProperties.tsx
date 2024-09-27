import React from 'react';
import FeaturedPropertyCard from './FeaturedPropertyCard';
import { Property } from '@/types/propertyTypes';

interface FeaturedPropertiesProps {
    properties: Property[];
}

const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ properties }) => {
    return (
        <section className="bg-blue-50 px-4 pt-6 pb-10">
            <div className="container-xl lg:container m-auto">
                <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
                    Могут подойти
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8"> {/* Увеличены отступы и ширина */}
                    {properties.map((property) => (
                        <FeaturedPropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProperties;
