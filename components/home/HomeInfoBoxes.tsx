import React from 'react';
import InfoBox from "@/components/InfoBox";

const HomeInfoBoxes: React.FC = () => {
    return (
        <section className="bg-gray-50 py-12">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoBox
                        heading={"Размещайте объявления"}
                        backgroundColor={"bg-blue-50"}
                        buttonInfo={{
                            text: "Добавить объявление",
                            link: "/properties",
                            backgroundColor: "bg-indigo-600"
                        }}>
                        <p className="text-gray-600">На нашем сайте имеется возможность быстро и удобно разместить объявление.</p>
                    </InfoBox>

                    <InfoBox
                        heading={"Арендуйте недвижимость"}
                        backgroundColor={"bg-white"}
                        buttonInfo={{
                            text: "Арендовать",
                            link: "/properties/add",
                            backgroundColor: "bg-blue-600"
                        }}>
                        <p className="text-gray-600">Аренда недвижимости быстро и просто.</p>
                    </InfoBox>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <InfoBox
                        heading={"Ищите на карте"}
                        backgroundColor={"bg-white"}
                        buttonInfo={{
                            text: "Найти на карте",
                            link: "/properties",
                            backgroundColor: "bg-blue-600"
                        }}>
                        <p className="text-gray-600">Ищите объявления рядом с работой и другими важными местами.</p>
                    </InfoBox>

                    <InfoBox
                        heading={"Покупайте недвижимость"}
                        backgroundColor={"bg-blue-50"}
                        buttonInfo={{
                            text: "Купить",
                            link: "/properties/add",
                            backgroundColor: "bg-indigo-600"
                        }}>
                        <p className="text-gray-600">Покупка недвижимости с лучшими предложениями.</p>
                    </InfoBox>
                </div>
            </div>
        </section>
    );
};

export default HomeInfoBoxes;
