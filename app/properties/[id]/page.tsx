import {PostData} from "@/types/propertyTypes";
import {
    FaBath,
    FaBed,
    FaBuilding,
    FaCar,
    FaCouch,
    FaEye,
    FaFire,
    FaHome,
    FaMapMarkerAlt,
    FaRulerCombined,
    FaWind
} from "react-icons/fa";
import {MdElevator, MdOutlineBalcony} from "react-icons/md";
import ShareButton from "@/components/property/selected-property/ShareButton";
import {formatDate} from "@/utils/formatDate";
import dynamic from 'next/dynamic';

const ImageCarousel = dynamic(() => import('@/components/property/selected-property/ImageCarousel'));
const FavoriteButton = dynamic(() => import('@/components/property/selected-property/FavoriteButton'));

// Функция для получения данных о недвижимости на сервере
async function fetchProperty(id: string): Promise<PostData | null> {
    const res = await fetch(`${process.env.API_URL}/api/properties/${id}`);
    if (!res.ok) return null;
    return await res.json();
}

// Функция для проверки, является ли объект избранным
async function fetchIsFavorite(id: string): Promise<boolean> {
    const res = await fetch(`${process.env.API_URL}/api/saved-properties/${id}/is-favorite`);
    if (!res.ok) return false;
    const { isFavorite } = await res.json();
    return isFavorite;
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
    const [property, isFavorite] = await Promise.all([
        fetchProperty(params.id),
        fetchIsFavorite(params.id),
    ]);

    if (!property) {
        return (
            <h1 className="text-center text-2xl font-bold mt-10">
                Объект недвижимости не найден
            </h1>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                    <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="inline mr-2" />
                        <p>
                            {property.address}, {property.city}
                        </p>
                    </div>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                    <FavoriteButton isFavorite={isFavorite} id={params.id} />
                    <ShareButton title={property.title} />
                </div>
            </div>

            {property.imageUrls && property.imageUrls.length > 0 && (
                <div className="mb-6">
                    <ImageCarousel images={property.imageUrls} />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Основные характеристики</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Проверка на тип недвижимости */}
                            {property.property === 'APARTMENT' && property.apartment && (
                                <>
                                    {property.apartment.numBedrooms !== undefined && (
                                        <div className="flex items-center text-gray-700">
                                            <FaBed className="inline mr-2 text-blue-500" />
                                            <p>{property.apartment.numBedrooms} Спальни</p>
                                        </div>
                                    )}
                                    {property.apartment.numBathrooms !== undefined && (
                                        <div className="flex items-center text-gray-700">
                                            <FaBath className="inline mr-2 text-blue-500" />
                                            <p>{property.apartment.numBathrooms} Ванные комнаты</p>
                                        </div>
                                    )}
                                    {property.apartment.floorNumber !== undefined && (
                                        <div className="flex items-center text-gray-700">
                                            <FaBuilding className="inline mr-2 text-blue-500" />
                                            <p>Этаж: {property.apartment.floorNumber}</p>
                                        </div>
                                    )}
                                    {/* Добавить все другие поля для квартиры */}
                                </>
                            )}

                            {property.property === 'HOUSE' && property.house && (
                                <>
                                    {property.house.numberOfRooms !== undefined && (
                                        <div className="flex items-center text-gray-700">
                                            <FaBed className="inline mr-2 text-blue-500" />
                                            <p>{property.house.numberOfRooms} Комнаты</p>
                                        </div>
                                    )}
                                    {property.house.houseArea !== undefined && (
                                        <div className="flex items-center text-gray-700">
                                            <FaRulerCombined className="inline mr-2 text-blue-500" />
                                            <p>{property.house.houseArea} м²</p>
                                        </div>
                                    )}
                                    {/* Добавить все другие поля для дома */}
                                </>
                            )}

                            {property.property === 'LAND_PLOT' && property.landPlot && (
                                <>
                                    {property.landPlot.landArea !== undefined && (
                                        <div className="flex items-center text-gray-700">
                                            <FaRulerCombined className="inline mr-2 text-blue-500" />
                                            <p>{property.landPlot.landArea} м²</p>
                                        </div>
                                    )}
                                    {property.landPlot.landPurpose && (
                                        <div className="flex items-center text-gray-700">
                                            <FaHome className="inline mr-2 text-blue-500" />
                                            <p>Назначение земли: {property.landPlot.landPurpose}</p>
                                        </div>
                                    )}
                                    {/* Добавить все другие поля для земельного участка */}
                                </>
                            )}
                        </div>
                    </section>

                    {/* Характеристики аренды */}
                    {property.type === 'RENT' && property.rentalFeatures && (
                        <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                            <h2 className="text-2xl font-semibold mb-4">Характеристики аренды</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {property.rentalFeatures.rentalTerm && (
                                    <p>Срок аренды: {property.rentalFeatures.rentalTerm}</p>
                                )}
                                {property.rentalFeatures.securityDeposit && (
                                    <p>Залог: {property.rentalFeatures.securityDeposit.toLocaleString()} ₽</p>
                                )}
                                {/* Добавить все другие поля для аренды */}
                            </div>
                        </section>
                    )}

                    {/* Характеристики продажи */}
                    {property.type === 'SALE' && property.saleFeatures && (
                        <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                            <h2 className="text-2xl font-semibold mb-4">Характеристики продажи</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {property.saleFeatures.mortgageAvailable && (
                                    <p>Ипотека доступна</p>
                                )}
                                {property.saleFeatures.priceNegotiable && (
                                    <p>Цена договорная</p>
                                )}
                                {/* Добавить все другие поля для продажи */}
                            </div>
                        </section>
                    )}

                    <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Описание</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {property.description || "Описание отсутствует"}
                        </p>
                    </section>
                </div>

                <div>
                    <div className="bg-white p-6 shadow-md rounded-lg mb-6 sticky top-20">
                        <p className="text-3xl font-bold text-gray-800 mb-4">
                            {property.price.toLocaleString()} ₽
                        </p>

                        <div className="text-gray-500 mb-4">
                            {property.updatedAt && property.updatedAt !== property.createdAt ? (
                                <p>Изменено: {formatDate(property.updatedAt.toISOString())}</p>
                            ) : (
                                <p>
                                    Добавлено: {property.createdAt && property.createdAt instanceof Date
                                    ? formatDate(property.createdAt.toISOString())
                                    : ""}
                                </p>
                            )}
                        </div>

                        <button
                            className="bg-green-500 w-full text-white px-4 py-2 rounded-lg flex items-center justify-center mb-4 hover:bg-green-600 transition"
                        >
                            Показать контакты
                        </button>

                        <div className="flex items-center text-gray-600 mt-4">
                            <FaEye className="inline mr-2"/>
                            <p>{property.views || 0} просмотров</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
