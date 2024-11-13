import { Icons } from '@/components/icons';
import dynamic from 'next/dynamic';
import { formatDate } from "@/utils/formatDate";
import { PostData } from "@/types/propertyTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { incrementPostViews } from "@/utils/updateViews";
import { fetchIsFavorite, fetchProperty, fetchReservations } from "@/services/propertyService";
import FavoriteButton from "@/components/property/selected-property/FavoriteButton";
import ListingReservation from "@/components/property/selected-property/ListingReservation";
import {TRANSLATIONS} from "@/constants/translations";
import { getTranslation } from '@/utils/extractText';

const ImageCarousel = dynamic(() => import('@/components/property/selected-property/ImageCarousel'));
const ShareButton = dynamic(() => import('@/components/property/selected-property/ShareButton'));

export default async function PropertyPage({ params }: { params: { id: string } }) {
    try {
        await incrementPostViews(params.id);

        const [property, isFavorite, reservations] = await Promise.all([
            fetchProperty(params.id),
            fetchIsFavorite(params.id),
            fetchReservations({ postId: params.id }),
        ]);

        if (!property) {
            return <h1 className="text-center text-2xl font-bold mt-10">Объект не найден</h1>;
        }

        const createdAt = property.createdAt ? new Date(property.createdAt) : null;
        const updatedAt = property.updatedAt ? new Date(property.updatedAt) : null;

        const formattedReservations = reservations.map(reservation => ({
            startDate: new Date(reservation.startDate).toISOString(),
            endDate: new Date(reservation.endDate).toISOString(),
            status: reservation.status || "PENDING",
        }));

        return (
            <div className="container mx-auto py-6 px-4">
                <Header property={property} />

                <div className="grid lg:grid-cols-3 gap-6">
                    <MainContent property={property} />
                    <Sidebar
                        property={property}
                        createdAt={createdAt}
                        updatedAt={updatedAt}
                        isFavorite={isFavorite}
                        reservations={formattedReservations} // Pass 'formattedReservations' with 'status'
                    />
                </div>
            </div>
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        return (
            <div className="text-center text-2xl font-bold mt-10">
                <h1>Ошибка загрузки данных</h1>
                <p className="text-red-500">{errorMessage}</p>
            </div>
        );
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

function Sidebar({
                     property,
                     createdAt,
                     updatedAt,
                     isFavorite,
                     reservations,
                 }: {
    property: PostData;
    createdAt: Date | null;
    updatedAt: Date | null;
    isFavorite: boolean;
    reservations: Array<{ startDate: string; endDate: string; status: string }>; // Updated to include 'status'
}) {
    return (
        <div className="sticky top-20">
            {property.type === 'SALE' && (
                <PriceBox
                    property={property}
                    createdAt={createdAt}
                    updatedAt={updatedAt}
                    isFavorite={isFavorite}
                />
            )}
            {property.type === 'RENT' && property.id && (
                <ListingReservation
                    price={Number(property.price)}
                    postId={property.id}
                    reservations={reservations}
                />
            )}
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
    const renderCharacteristic = (
        icon: React.ReactNode,
        label: string,
        value: any,
        enumType?: keyof typeof TRANSLATIONS
    ) => {
        if (value === undefined || value === null || value === '') return null;
        const translatedValue = enumType ? getTranslation(enumType, value) : value;
        return (
            <Characteristic icon={icon} label={label} value={translatedValue} />
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {property.apartment && (
                <>
                    {renderCharacteristic(Icons.area, "Площадь", property.apartment.apartmentArea ? `${property.apartment.apartmentArea} м²` : null)}
                    {renderCharacteristic(Icons.bedrooms, "Комнат", property.apartment.numBedrooms)}
                    {renderCharacteristic(Icons.bathrooms, "Ванных комнат", property.apartment.numBathrooms)}
                    {renderCharacteristic(Icons.floor, "Этаж", property.apartment.floorNumber && property.apartment.totalFloors ? `${property.apartment.floorNumber} из ${property.apartment.totalFloors}` : null)}
                    {renderCharacteristic(Icons.balcony, "Балкон", property.apartment.hasBalcony ? "Да" : "Нет")}
                    {renderCharacteristic(Icons.loggia, "Лоджия", property.apartment.hasLoggia ? "Да" : "Нет")}
                    {renderCharacteristic(Icons.heating, "Тип отопления", property.apartment.heatingType, "HeatingType")}
                    {renderCharacteristic(Icons.internet, "Скорость интернета", property.apartment.internetSpeed ? `${property.apartment.internetSpeed} Мбит/с` : null)}
                    {renderCharacteristic(Icons.renovation, "Состояние ремонта", property.apartment.renovationState, "RenovationState")}
                    {renderCharacteristic(Icons.yearBuilt, "Год постройки", property.apartment.yearBuilt)}
                    {renderCharacteristic(Icons.parking, "Парковка", property.apartment.parkingType, "ParkingType")}
                </>
            )}

            {property.house && (
                <>
                    {renderCharacteristic(Icons.house, "Комнат", property.house.numberOfRooms)}
                    {renderCharacteristic(Icons.area, "Площадь дома", property.house.houseArea ? `${property.house.houseArea} м²` : null)}
                    {renderCharacteristic(Icons.garage, "Гараж", property.house.hasGarage ? "Да" : "Нет")}
                    {renderCharacteristic(Icons.fencing, "Ограждение", property.house.fencing ? "Да" : "Нет")}
                    {renderCharacteristic(Icons.heating, "Тип отопления", property.house.heatingType, "HeatingType")}
                    {renderCharacteristic(Icons.internet, "Скорость интернета", property.house.internetSpeed ? `${property.house.internetSpeed} Мбит/с` : null)}
                    {renderCharacteristic(Icons.yearBuilt, "Год постройки", property.house.yearBuilt)}
                    {renderCharacteristic(Icons.renovation, "Состояние ремонта", property.house.houseCondition, "RenovationState")}
                </>
            )}

            {property.landPlot && (
                <>
                    {renderCharacteristic(Icons.area, "Площадь участка", property.landPlot.landArea ? `${property.landPlot.landArea} м²` : null)}
                    {renderCharacteristic(Icons.fencing, "Ограждение", property.landPlot.fencing ? "Да" : "Нет")}
                    {renderCharacteristic(Icons.house, "Назначение участка", property.landPlot.landPurpose)}
                    {renderCharacteristic(Icons.heating, "Источник воды", property.landPlot.waterSource)}
                </>
            )}

            {property.rentalFeatures && (
                <>
                    {renderCharacteristic(Icons.petPolicy, "Домашние животные", property.rentalFeatures.petPolicy, "PetPolicy")}
                    {renderCharacteristic(Icons.yearBuilt, "Минимальный срок аренды", property.rentalFeatures.minimumLeaseTerm ? `${property.rentalFeatures.minimumLeaseTerm} месяцев` : null)}
                    {renderCharacteristic(Icons.yearBuilt, "Максимальный срок аренды", property.rentalFeatures.maximumLeaseTerm ? `${property.rentalFeatures.maximumLeaseTerm} месяцев` : null)}
                    {renderCharacteristic(Icons.heating, "Залог", property.rentalFeatures.securityDeposit ? `${property.rentalFeatures.securityDeposit.toLocaleString()} ₽` : null)}
                </>
            )}

            {property.saleFeatures && (
                <>
                    {renderCharacteristic(Icons.heating, "Ипотека доступна", property.saleFeatures.mortgageAvailable ? "Да" : "Нет")}
                    {renderCharacteristic(Icons.heating, "Цена договорная", property.saleFeatures.priceNegotiable ? "Да" : "Нет")}
                </>
            )}
        </div>
    );
}

function Characteristic({ icon, label, value }: { icon: React.ReactNode; label: string; value: any }) {
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
                    <FavoriteButton isFavorite={isFavorite} id={property.id!} />
                    <ShareButton title={property.title} />
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
