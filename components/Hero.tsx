import React from 'react';
import PropertySearchForm from '@/components/PropertySearchForm';

const Hero: React.FC = () => {
    return (
        <section className="bg-blue-700 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                        Найдите свое гнездышко
                    </h1>
                    <p className="my-4 text-xl text-white">
                        Откройте для себя идеальное жилье, которое подходит именно вам.
                    </p>
                </div>
                <PropertySearchForm />
            </div>
        </section>
    );
};

export default Hero;
