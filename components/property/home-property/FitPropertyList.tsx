import React from 'react';
import FitPropertyCard from './FitPropertyCard';
import { getProperties } from '@/utils/getProperties';

const FitPropertyList = async () => {
    const data = await getProperties();

    const featuredProperties = data
        .sort(() => Math.random() - Math.random())
        .slice(0, 4);

    return (
        <section className="bg-blue-50 px-4 pt-6 pb-10">
            <div className="container-xl lg:container m-auto">
                <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
                    Могут подойти
                </h2>
                {featuredProperties.length === 0 ? (
                    <p className="text-center text-xl font-semibold">
                        Нет предложений
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                        {featuredProperties.map((property) => (
                            <FitPropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FitPropertyList;
