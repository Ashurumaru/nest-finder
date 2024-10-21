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
                            {property.numBedrooms !== undefined && (
                                <div className="flex items-center text-gray-700">
                                    <FaBed className="inline mr-2 text-blue-500" />
                                    <p>{property.apartment?.numBedrooms} Спальни</p>
                                </div>
                            )}
                            {property.numBathrooms !== undefined && (
                                <div className="flex items-center text-gray-700">
                                    <FaBath className="inline mr-2 text-blue-500" />
                                    <p>{property.numBathrooms} Ванные комнаты</p>
                                </div>
                            )}
                            {property.propertySize && (
                                <div className="flex items-center text-gray-700">
                                    <FaRulerCombined className="inline mr-2 text-blue-500" />
                                    <p>{property.propertySize} м²</p>
                                </div>
                            )}
                            {property.floorNumber !== undefined && (
                                <div className="flex items-center text-gray-700">
                                    <FaBuilding className="inline mr-2 text-blue-500" />
                                    <p>
                                        Этаж: {property.floorNumber}
                                        {property.totalFloors ? ` из ${property.totalFloors}` : ""}
                                    </p>
                                </div>
                            )}
                            {property.hasElevator && (
                                <div className="flex items-center text-gray-700">
                                    <MdElevator className="inline mr-2 text-blue-500" />
                                    <p>Есть лифт</p>
                                </div>
                            )}
                            {property.heatingType && (
                                <div className="flex items-center text-gray-700">
                                    <FaFire className="inline mr-2 text-blue-500" />
                                    <p>Отопление: {property.heatingType}</p>
                                </div>
                            )}
                            {property.parking && (
                                <div className="flex items-center text-gray-700">
                                    <FaCar className="inline mr-2 text-blue-500" />
                                    <p>Парковка: {property.parkingType || "Есть"}</p>
                                </div>
                            )}
                            {property.property && (
                                <div className="flex items-center text-gray-700">
                                    <FaHome className="inline mr-2 text-blue-500" />
                                    <p>Тип недвижимости: {property.property}</p>
                                </div>
                            )}
                            {property.type && (
                                <div className="flex items-center text-gray-700">
                                    <FaBuilding className="inline mr-2 text-blue-500" />
                                    <p>Тип сделки: {property.type}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Описание</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {property.description || "Описание отсутствует"}
                        </p>
                    </section>

                    {(property.furnished || property.airConditioning || property.balcony) && (
                        <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                            <h2 className="text-2xl font-semibold mb-4">Удобства и особенности</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {property.furnished && (
                                    <div className="flex items-center text-gray-700">
                                        <FaCouch className="inline mr-2 text-blue-500" />
                                        <p>Меблированная</p>
                                    </div>
                                )}
                                {property.airConditioning && (
                                    <div className="flex items-center text-gray-700">
                                        <FaWind className="inline mr-2 text-blue-500" />
                                        <p>Кондиционер</p>
                                    </div>
                                )}
                                {property.balcony && (
                                    <div className="flex items-center text-gray-700">
                                        <MdOutlineBalcony className="inline mr-2 text-blue-500" />
                                        <p>Балкон/Терраса</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    <section className="bg-white p-6 shadow-md rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Автор объявления</h2>
                        <p className="text-gray-700">
                            Размещено пользователем:{" "}
                            <strong>
                                {property.user?.name && property.user?.surname
                                    ? `${property.user.name} ${property.user.surname}`
                                    : "Неизвестно"}
                            </strong>
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
