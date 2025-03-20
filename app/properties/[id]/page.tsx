// app/properties/[id]/page.tsx

import { Icons } from "@/components/icons";
import dynamic from "next/dynamic";
import { formatDate } from "@/utils/formatDate";
import { PostData } from "@/types/propertyTypes";
import { incrementPostViews } from "@/utils/updateViews";
import { fetchIsFavorite, fetchProperty, fetchReservations } from "@/services/propertyService";
import FavoriteButton from "@/components/property/selected-property/FavoriteButton";
import ListingReservation from "@/components/property/selected-property/ListingReservation";
import { CharacteristicsList } from "@/components/property/selected-property/PropertyCharacteristicsList";
import ContactCard from "@/components/property/selected-property/ContactCard";
import ComplaintButton from "@/components/property/selected-property/ComplaintButton";
import { Decimal } from "@prisma/client/runtime/library";
import { auth } from "@/auth";

const ImageCarousel = dynamic(() => import("@/components/property/selected-property/ImageCarousel"));
const ShareButton = dynamic(() => import("@/components/property/selected-property/ShareButton"));

export default async function PropertyPage({ params }: { params: { id: string } }) {
    try {
        await incrementPostViews(params.id);

        const [property, isFavorite, reservations] = await Promise.all([
            fetchProperty(params.id),
            fetchIsFavorite(params.id),
            fetchReservations({ postId: params.id }),
        ]);

        const session = await auth();
        const user = session?.user;
        const isLoggedIn = !!user;

        if (!property) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                        <h1 className="text-3xl font-bold text-gray-800">Объект не найден</h1>
                        <p className="mt-4 text-gray-600">Возможно, объявление было удалено или срок его публикации истек</p>
                    </div>
                </div>
            );
        }

        const createdAt = property.createdAt ? new Date(property.createdAt) : null;
        const updatedAt = property.updatedAt ? new Date(property.updatedAt) : null;

        const formattedReservations = reservations.map((reservation) => ({
            startDate: new Date(reservation.startDate).toISOString(),
            endDate: new Date(reservation.endDate).toISOString(),
            status: reservation.status || "PENDING",
        }));

        return (
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <Header
                    property={property}
                    isLoggedIn={isLoggedIn}
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    <MainContent property={property} />
                    <Sidebar
                        property={property}
                        createdAt={createdAt}
                        updatedAt={updatedAt}
                        isFavorite={isFavorite}
                        reservations={formattedReservations}
                        currentUserId={user?.id}
                    />
                </div>
            </div>
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-lg">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Ошибка загрузки данных</h1>
                    <p className="text-red-500 p-4 bg-red-50 rounded-lg">{errorMessage}</p>
                </div>
            </div>
        );
    }
}

function Header({ property, isLoggedIn }: { property: PostData; isLoggedIn: boolean }) {
    return (
        <div className="flex flex-col md:flex-row justify-between mb-8 bg-white p-6 rounded-xl shadow-md">
            <div>
                <div className="inline-flex items-center mb-3">
                    <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full mr-3">
                        {property.type === "SALE" ? "Продажа" : "Аренда"}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {property.property}
                    </span>
                </div>
                <h1 className="text-3xl font-bold mb-3 text-gray-800">{property.title}</h1>
                <div className="flex items-center text-gray-600">
                    <span className="text-indigo-600 mr-2">{Icons.address}</span>
                    <p className="text-gray-600">
                        {property.address}, {property.city}
                    </p>
                </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
                {property.id && <ComplaintButton postId={property.id} isLoggedIn={isLoggedIn} />}
            </div>
        </div>
    );
}

function MainContent({ property }: { property: PostData }) {
    return (
        <div className="lg:col-span-2 space-y-8">
            {property.imageUrls?.length > 0 && (
                <div className="overflow-hidden rounded-xl shadow-md">
                    <ImageCarousel images={property.imageUrls} />
                </div>
            )}
            <Section title="Основные характеристики">
                <CharacteristicsList property={property} />
            </Section>

            {property.description && (
                <Section title="Описание">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
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
                     currentUserId,
                 }: {
    property: PostData;
    createdAt: Date | null;
    updatedAt: Date | null;
    isFavorite: boolean;
    reservations: Array<{ startDate: string; endDate: string; status: string }>;
    currentUserId: string | undefined;
}) {
    return (
        <div className="space-y-6 lg:sticky lg:top-24">
            {property.type === "SALE" && (
                <PriceBox
                    price={property.price}
                    createdAt={createdAt}
                    updatedAt={updatedAt}
                    isFavorite={isFavorite}
                    views={property.views}
                />
            )}
            {property.type === "RENT" && property.id && (
                <ListingReservation
                    price={Number(property.price)}
                    postId={property.id}
                    reservations={reservations}
                />
            )}
            {property.user && currentUserId && (
                <ContactCard
                    currentUserId={currentUserId}
                    recipientId={property.user.id}
                    recipientName={`${property.user.name}${property.user.surname ? ` ${property.user.surname}` : ""}`}
                    recipientEmail={property.user.email}
                    recipientPhone={property.user.phoneNumber}
                    recipientImage={property.user.image}
                />
            )}
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="bg-white p-6 shadow-md rounded-xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">{title}</h2>
            {children}
        </section>
    );
}

function PriceBox({
                      price,
                      createdAt,
                      updatedAt,
                      isFavorite,
                      views,
                  }: {
    price: number | Decimal;
    createdAt: Date | null;
    updatedAt: Date | null;
    isFavorite: boolean;
    views: number | undefined;
}) {
    return (
        <div className="bg-gradient-to-br from-white to-indigo-50 p-8 shadow-lg rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <FavoriteButton isFavorite={isFavorite} id={"pricebox"} />
                    <ShareButton title={"Цена"} />
                </div>
            </div>
            <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{price.toLocaleString()} ₽</p>

            <div className="flex items-center text-gray-600 mt-6 mb-6">
                <span className="text-indigo-600 mr-2">{Icons.views}</span>
                <p>{views} просмотров</p>
            </div>
            <div className="text-gray-500 text-sm border-t pt-4 mt-2">
                {updatedAt && updatedAt !== createdAt ? (
                    <div className="flex items-center">
                        <span className="text-indigo-600 mr-2">{Icons.calendar}</span>
                        <p>Изменено: {formatDate(updatedAt.toISOString())}</p>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <span className="text-indigo-600 mr-2">{Icons.calendar}</span>
                        <p>Добавлено: {createdAt ? formatDate(createdAt.toISOString()) : ""}</p>
                    </div>
                )}
            </div>
        </div>
    );
}