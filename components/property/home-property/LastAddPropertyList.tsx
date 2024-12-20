import React from 'react';
import PropertyCard from '@/components/property/PropertyCard';
import Link from 'next/link';
import { getProperties } from '@/utils/getProperties';

const LastAddPropertyList = async () => {
    const data = await getProperties();

    const recentProperties = data
        .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, 3);


    return (
        <>
            <section className="bg-gray-50 px-4 py-6">
                <div className="container-xl lg:container m-auto">
                    <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
                        Последние добавленные
                    </h2>
                    {data.length === 0 ? (
                        <p className="text-center text-xl font-semibold">
                            Нет недавно добавленных объектов
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recentProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <section className="m-auto max-w-lg my-10 px-6">
                <Link
                    href="/sale"
                    className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
                >
                    Посмотреть все объекты
                </Link>
            </section>
        </>
    );
};

export default LastAddPropertyList;
