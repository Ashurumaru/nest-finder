// components/Hero.tsx

import React from "react";
import HomePropertySearchForm from "@/components/HomePropertySearchForm";

const Hero: React.FC = () => {
    return (
        <section className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
            <div className="container mx-auto px-4 flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Найдите своё гнёздышко
                </h1>
                <p className="text-lg md:text-xl mb-8">
                    Откройте для себя идеальное жильё, которое подходит именно вам.
                </p>
                <div className="w-full max-w-3xl">
                    <HomePropertySearchForm />
                </div>
            </div>
        </section>
    );
};

export default Hero;
