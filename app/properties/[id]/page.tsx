import {
    FaBath,
    FaBed,
    FaBuilding,
    FaCalendarAlt,
    FaDog,
    FaEye,
    FaFire,
    FaHome,
    FaMapMarkerAlt,
    FaParking,
    FaRulerCombined,
    FaWarehouse,
    FaWifi
} from "react-icons/fa";
import {MdFence, MdHouse, MdOutlineBalcony, MdOutlineGarage} from "react-icons/md";
import dynamic from 'next/dynamic';
import {formatDate} from "@/utils/formatDate";
import {PostData} from "@/types/propertyTypes";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const ImageCarousel = dynamic(() => import('@/components/property/selected-property/ImageCarousel'));
const FavoriteButton = dynamic(() => import('@/components/property/selected-property/FavoriteButton'));
const ShareButton = dynamic(() => import('@/components/property/selected-property/ShareButton'));

// Функция для получения данных о недвижимости
async function fetchProperty(id: string): Promise<PostData | null> {
    const res = await fetch(`${process.env.API_URL}/api/properties/${id}`, {
        cache: 'no-store',
    });
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

    console.log('Property data:', property);

    const createdAt = property?.createdAt ? new Date(property.createdAt) : null;
    const updatedAt = property?.updatedAt ? new Date(property.updatedAt) : null;

    if (!property) {
        return <h1 className="text-center text-2xl font-bold mt-10">Объект не найден</h1>;
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="flex flex-col md:flex-row justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                    <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="mr-2" />
                        <p>{property.address}, {property.city}</p>
                    </div>
                </div>

                {property.imageUrls && property.imageUrls.length > 0 && (
                    <div className="mb-6">
                        <ImageCarousel images={property.imageUrls} />
                    </div>
                )}

            </div>


            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Section title="Основные характеристики">
                        <CharacteristicsList property={property} />
                    </Section>

                    {property.description && (
                        <Section title="Описание">
                            <p className="text-gray-700 leading-relaxed">{property.description}</p>
                        </Section>
                    )}
                </div>

                <div className="sticky top-20">
                    <PriceBox property={property} createdAt={createdAt} updatedAt={updatedAt} isFavorite={isFavorite} />
                </div>
            </div>
        </div>
    );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="bg-white p-6 shadow-md rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            {children}
        </section>
    );
}

function CharacteristicsList({ property }: { property: PostData }) {
    const icons = {
        area: <FaRulerCombined className="mr-2 text-blue-500" />,
        bedrooms: <FaBed className="mr-2 text-blue-500" />,
        bathrooms: <FaBath className="mr-2 text-blue-500" />,
        garage: <MdOutlineGarage className="mr-2 text-blue-500" />,
        balcony: <MdOutlineBalcony className="mr-2 text-blue-500" />,
        floor: <FaBuilding className="mr-2 text-blue-500" />,
        house: <MdHouse className="mr-2 text-blue-500" />,
        loggia: <FaWarehouse className="mr-2 text-blue-500" />,
        fencing: <MdFence className="mr-2 text-blue-500" />,
        heating: <FaFire className="mr-2 text-blue-500" />,
        internet: <FaWifi className="mr-2 text-blue-500" />,
        parking: <FaParking className="mr-2 text-blue-500" />,
        renovation: <FaHome className="mr-2 text-blue-500" />,
        yearBuilt: <FaCalendarAlt className="mr-2 text-blue-500" />,
        petPolicy: <FaDog className="mr-2 text-blue-500" />,
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Apartment characteristics */}
            {property.apartment && (
                <>
                    {property.apartment.apartmentArea !== undefined && (
                        <Characteristic icon={icons.area} label="Площадь" value={`${property.apartment.apartmentArea} м²`} />
                    )}
                    {property.apartment.numBedrooms !== undefined && (
                        <Characteristic icon={icons.bedrooms} label="Комнат" value={property.apartment.numBedrooms} />
                    )}
                    {property.apartment.numBathrooms !== undefined && (
                        <Characteristic icon={icons.bathrooms} label="Ванных комнат" value={property.apartment.numBathrooms} />
                    )}
                    {property.apartment.floorNumber !== undefined && (
                        <Characteristic icon={icons.floor} label="Этаж" value={`${property.apartment.floorNumber} из ${property.apartment.totalFloors}`} />
                    )}
                    {property.apartment.hasBalcony !== undefined && (
                        <Characteristic icon={icons.balcony} label="Балкон" value={property.apartment.hasBalcony ? "Да" : "Нет"} />
                    )}
                    {property.apartment.hasLoggia !== undefined && (
                        <Characteristic icon={icons.loggia} label="Лоджия" value={property.apartment.hasLoggia ? "Да" : "Нет"} />
                    )}
                    {property.apartment.heatingType && (
                        <Characteristic icon={icons.heating} label="Тип отопления" value={property.apartment.heatingType} />
                    )}
                    {property.apartment.internetSpeed !== undefined && (
                        <Characteristic icon={icons.internet} label="Скорость интернета" value={`${property.apartment.internetSpeed} Мбит/с`} />
                    )}
                    {property.apartment.renovationState && (
                        <Characteristic icon={icons.renovation} label="Состояние ремонта" value={property.apartment.renovationState} />
                    )}
                    {property.apartment.yearBuilt !== undefined && (
                        <Characteristic icon={icons.yearBuilt} label="Год постройки" value={property.apartment.yearBuilt} />
                    )}
                    {property.apartment.parkingType && (
                        <Characteristic icon={icons.parking} label="Парковка" value={property.apartment.parkingType} />
                    )}
                </>
            )}

            {/* House characteristics */}
            {property.house && (
                <>
                    {property.house.numberOfRooms !== undefined && (
                        <Characteristic icon={icons.house} label="Комнат" value={property.house.numberOfRooms} />
                    )}
                    {property.house.houseArea !== undefined && (
                        <Characteristic icon={icons.area} label="Площадь дома" value={`${property.house.houseArea} м²`} />
                    )}
                    {property.house.hasGarage !== undefined && (
                        <Characteristic icon={icons.garage} label="Гараж" value={property.house.hasGarage ? "Да" : "Нет"} />
                    )}
                    {property.house.fencing !== undefined && (
                        <Characteristic icon={icons.fencing} label="Ограждение" value={property.house.fencing ? "Да" : "Нет"} />
                    )}
                    {property.house.heatingType && (
                        <Characteristic icon={icons.heating} label="Тип отопления" value={property.house.heatingType} />
                    )}
                    {property.house.internetSpeed !== undefined && (
                        <Characteristic icon={icons.internet} label="Скорость интернета" value={`${property.house.internetSpeed} Мбит/с`} />
                    )}
                    {property.house.yearBuilt !== undefined && (
                        <Characteristic icon={icons.yearBuilt} label="Год постройки" value={property.house.yearBuilt} />
                    )}
                    {property.house.houseCondition && (
                        <Characteristic icon={icons.renovation} label="Состояние ремонта" value={property.house.houseCondition} />
                    )}
                </>
            )}

            {/* LandPlot characteristics */}
            {property.landPlot && (
                <>
                    {property.landPlot.landArea !== undefined && (
                        <Characteristic icon={icons.area} label="Площадь участка" value={`${property.landPlot.landArea} м²`} />
                    )}
                    {property.landPlot.fencing !== undefined && (
                        <Characteristic icon={icons.fencing} label="Ограждение" value={property.landPlot.fencing ? "Да" : "Нет"} />
                    )}
                    {property.landPlot.landPurpose && (
                        <Characteristic icon={icons.house} label="Назначение участка" value={property.landPlot.landPurpose} />
                    )}
                    {property.landPlot.waterSource && (
                        <Characteristic icon={icons.heating} label="Источник воды" value={property.landPlot.waterSource} />
                    )}
                </>
            )}

            {/* Rental Features */}
            {property.rentalFeatures && (
                <>
                    {property.rentalFeatures.petPolicy && (
                        <Characteristic icon={icons.petPolicy} label="Домашние животные" value={property.rentalFeatures.petPolicy} />
                    )}
                    {property.rentalFeatures.minimumLeaseTerm !== undefined && (
                        <Characteristic icon={icons.yearBuilt} label="Минимальный срок аренды" value={`${property.rentalFeatures.minimumLeaseTerm} месяцев`} />
                    )}
                    {property.rentalFeatures.maximumLeaseTerm !== undefined && (
                        <Characteristic icon={icons.yearBuilt} label="Максимальный срок аренды" value={`${property.rentalFeatures.maximumLeaseTerm} месяцев`} />
                    )}
                    {property.rentalFeatures.securityDeposit !== undefined && (
                        <Characteristic icon={icons.heating} label="Залог" value={`${property.rentalFeatures.securityDeposit?.toLocaleString()} ₽`} />
                    )}
                </>
            )}

            {/* Sale Features */}
            {property.saleFeatures && (
                <>
                    {property.saleFeatures.mortgageAvailable !== undefined && (
                        <Characteristic icon={icons.heating} label="Ипотека доступна" value={property.saleFeatures.mortgageAvailable ? "Да" : "Нет"} />
                    )}
                    {property.saleFeatures.priceNegotiable !== undefined && (
                        <Characteristic icon={icons.heating} label="Цена договорная" value={property.saleFeatures.priceNegotiable ? "Да" : "Нет"} />
                    )}
                </>
            )}
        </div>
    );
}

function Characteristic({ icon, label, value }: { icon: React.ReactNode; label: string; value: any }) {
    if (value === undefined || value === null) return null;
    return (
        <div className="flex items-center text-gray-700">
            {icon}
            <p>{label}: {value}</p>
        </div>
    );
}

function PriceBox({ property, createdAt, updatedAt, isFavorite }: { property: PostData; createdAt: Date | null; updatedAt: Date | null; isFavorite: boolean }) {

    return (
        <div className="bg-gradient-to-br from-white via-gray-100 to-gray-200 p-8 shadow-lg rounded-xl mb-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage
                            src={property.user?.image ?? '/images/default.png'}
                            alt={property.user?.name ?? 'User'}
                        />
                        <AvatarFallback>{property.user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <p>{property.user?.name}</p>
                </div>

                <div className="flex items-center space-x-4">
                    <FavoriteButton isFavorite={isFavorite} id={property.id!}/>
                    <ShareButton title={property.title}/>
                </div>
            </div>
            <p className="text-5xl font-bold text-gray-900 mb-4">{property.price.toLocaleString()} ₽</p>

            <button
                className="bg-blue-600 w-full text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md">
                Показать контакты
            </button>

            <div className="flex items-center text-gray-600 mt-6 mb-6">
                <FaEye className="mr-2"/>
                <p>{property.views} просмотров</p>
            </div>
            <div className="text-gray-500 ">
                {updatedAt && updatedAt !== createdAt ? (
                    <p>Изменено: {formatDate(updatedAt.toISOString())}</p>
                ) : (
                    <p>Добавлено: {createdAt ? formatDate(createdAt.toISOString()) : ""}</p>
                )}
            </div>
        </div>
    );
}