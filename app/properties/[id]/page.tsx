import { Icons } from '@/components/icons';
import dynamic from 'next/dynamic';
import {formatDate} from "@/utils/formatDate";
import {PostData} from "@/types/propertyTypes";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {incrementPostViews} from "@/utils/updateViews";
import {fetchIsFavorite, fetchProperty} from "@/services/propertyService";

const ImageCarousel = dynamic(() => import('@/components/property/selected-property/ImageCarousel'));
const FavoriteButton = dynamic(() => import('@/components/property/selected-property/FavoriteButton'));
const ShareButton = dynamic(() => import('@/components/property/selected-property/ShareButton'));

export default async function PropertyPage({ params }: { params: { id: string } }) {
    try {
        await incrementPostViews(params.id);

        const [property, isFavorite] = await Promise.all([
            fetchProperty(params.id),
            fetchIsFavorite(params.id),
        ]);

        if (!property) {
            return <h1 className="text-center text-2xl font-bold mt-10">Объект не найден</h1>;
        }

        const createdAt = property.createdAt ? new Date(property.createdAt) : null;
        const updatedAt = property.updatedAt ? new Date(property.updatedAt) : null;

        return (
            <div className="container mx-auto py-6 px-4">
                <Header property={property} />

                <div className="grid lg:grid-cols-3 gap-6">
                    <MainContent property={property} />
                    <Sidebar property={property} createdAt={createdAt} updatedAt={updatedAt} isFavorite={isFavorite} />
                </div>
            </div>
        );
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        return <h1 className="text-center text-2xl font-bold mt-10">Ошибка загрузки данных</h1>;
    }
}
function Header({ property }: { property: PostData }) {
    return (
        <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600">
                    {Icons.address}
                    <p>{property.address}, {property.city}</p>
                </div>
            </div>
        </div>
    );
}

function MainContent({ property }: { property: PostData }) {
    return (
        <div className="lg:col-span-2">
            {property.imageUrls?.length > 0 && (
                <div className="mb-6">
                    <ImageCarousel images={property.imageUrls} />
                </div>
            )}
            <Section title="Основные характеристики">
                <CharacteristicsList property={property} />
            </Section>

            {property.description && (
                <Section title="Описание">
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </Section>
            )}
        </div>
    );
}

function Sidebar({ property, createdAt, updatedAt, isFavorite }: { property: PostData; createdAt: Date | null; updatedAt: Date | null; isFavorite: boolean }) {
    return (
        <div className="sticky top-20">
            <PriceBox property={property} createdAt={createdAt} updatedAt={updatedAt} isFavorite={isFavorite} />
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
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {property.apartment && (
                <>
                    {property.apartment.apartmentArea !== undefined && (
                        <Characteristic icon={Icons.area} label="Площадь" value={`${property.apartment.apartmentArea} м²`} />
                    )}
                    {property.apartment.numBedrooms !== undefined && (
                        <Characteristic icon={Icons.bedrooms} label="Комнат" value={property.apartment.numBedrooms} />
                    )}
                    {property.apartment.numBathrooms !== undefined && (
                        <Characteristic icon={Icons.bathrooms} label="Ванных комнат" value={property.apartment.numBathrooms} />
                    )}
                    {property.apartment.floorNumber !== undefined && (
                        <Characteristic icon={Icons.floor} label="Этаж" value={`${property.apartment.floorNumber} из ${property.apartment.totalFloors}`} />
                    )}
                    {property.apartment.hasBalcony !== undefined && (
                        <Characteristic icon={Icons.balcony} label="Балкон" value={property.apartment.hasBalcony ? "Да" : "Нет"} />
                    )}
                    {property.apartment.hasLoggia !== undefined && (
                        <Characteristic icon={Icons.loggia} label="Лоджия" value={property.apartment.hasLoggia ? "Да" : "Нет"} />
                    )}
                    {property.apartment.heatingType && (
                        <Characteristic icon={Icons.heating} label="Тип отопления" value={property.apartment.heatingType} />
                    )}
                    {property.apartment.internetSpeed !== undefined && (
                        <Characteristic icon={Icons.internet} label="Скорость интернета" value={`${property.apartment.internetSpeed} Мбит/с`} />
                    )}
                    {property.apartment.renovationState && (
                        <Characteristic icon={Icons.renovation} label="Состояние ремонта" value={property.apartment.renovationState} />
                    )}
                    {property.apartment.yearBuilt !== undefined && (
                        <Characteristic icon={Icons.yearBuilt} label="Год постройки" value={property.apartment.yearBuilt} />
                    )}
                    {property.apartment.parkingType && (
                        <Characteristic icon={Icons.parking} label="Парковка" value={property.apartment.parkingType} />
                    )}
                </>
            )}

            {property.house && (
                <>
                    {property.house.numberOfRooms !== undefined && (
                        <Characteristic icon={Icons.house} label="Комнат" value={property.house.numberOfRooms} />
                    )}
                    {property.house.houseArea !== undefined && (
                        <Characteristic icon={Icons.area} label="Площадь дома" value={`${property.house.houseArea} м²`} />
                    )}
                    {property.house.hasGarage !== undefined && (
                        <Characteristic icon={Icons.garage} label="Гараж" value={property.house.hasGarage ? "Да" : "Нет"} />
                    )}
                    {property.house.fencing !== undefined && (
                        <Characteristic icon={Icons.fencing} label="Ограждение" value={property.house.fencing ? "Да" : "Нет"} />
                    )}
                    {property.house.heatingType && (
                        <Characteristic icon={Icons.heating} label="Тип отопления" value={property.house.heatingType} />
                    )}
                    {property.house.internetSpeed !== undefined && (
                        <Characteristic icon={Icons.internet} label="Скорость интернета" value={`${property.house.internetSpeed} Мбит/с`} />
                    )}
                    {property.house.yearBuilt !== undefined && (
                        <Characteristic icon={Icons.yearBuilt} label="Год постройки" value={property.house.yearBuilt} />
                    )}
                    {property.house.houseCondition && (
                        <Characteristic icon={Icons.renovation} label="Состояние ремонта" value={property.house.houseCondition} />
                    )}
                </>
            )}

            {property.landPlot && (
                <>
                    {property.landPlot.landArea !== undefined && (
                        <Characteristic icon={Icons.area} label="Площадь участка" value={`${property.landPlot.landArea} м²`} />
                    )}
                    {property.landPlot.fencing !== undefined && (
                        <Characteristic icon={Icons.fencing} label="Ограждение" value={property.landPlot.fencing ? "Да" : "Нет"} />
                    )}
                    {property.landPlot.landPurpose && (
                        <Characteristic icon={Icons.house} label="Назначение участка" value={property.landPlot.landPurpose} />
                    )}
                    {property.landPlot.waterSource && (
                        <Characteristic icon={Icons.heating} label="Источник воды" value={property.landPlot.waterSource} />
                    )}
                </>
            )}

            {property.rentalFeatures && (
                <>
                    {property.rentalFeatures.petPolicy && (
                        <Characteristic icon={Icons.petPolicy} label="Домашние животные" value={property.rentalFeatures.petPolicy} />
                    )}
                    {property.rentalFeatures.minimumLeaseTerm !== undefined && (
                        <Characteristic icon={Icons.yearBuilt} label="Минимальный срок аренды" value={`${property.rentalFeatures.minimumLeaseTerm} месяцев`} />
                    )}
                    {property.rentalFeatures.maximumLeaseTerm !== undefined && (
                        <Characteristic icon={Icons.yearBuilt} label="Максимальный срок аренды" value={`${property.rentalFeatures.maximumLeaseTerm} месяцев`} />
                    )}
                    {property.rentalFeatures.securityDeposit !== undefined && (
                        <Characteristic icon={Icons.heating} label="Залог" value={`${property.rentalFeatures.securityDeposit?.toLocaleString()} ₽`} />
                    )}
                </>
            )}

            {property.saleFeatures && (
                <>
                    {property.saleFeatures.mortgageAvailable !== undefined && (
                        <Characteristic icon={Icons.heating} label="Ипотека доступна" value={property.saleFeatures.mortgageAvailable ? "Да" : "Нет"} />
                    )}
                    {property.saleFeatures.priceNegotiable !== undefined && (
                        <Characteristic icon={Icons.heating} label="Цена договорная" value={property.saleFeatures.priceNegotiable ? "Да" : "Нет"} />
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
                {Icons.views}
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