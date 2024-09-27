// components/FeaturedProperties.tsx

import React from 'react';
import FeaturedPropertyCard from './FeaturedPropertyCard';
import { Property } from '../types/propertyTypes';

interface FeaturedPropertiesProps {
    properties: Property[];
}

const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ properties }) => {
    return (
        <div className="bg-gray-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
                <FeaturedPropertyCard key={property.id} property={property} />
            ))}
        </div>
    );
};

export default FeaturedProperties;
