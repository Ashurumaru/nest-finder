// Update app/property/[id]/page.tsx

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
            return <h1 className="text-center text-2xl font-bold mt-10">Объект не найден</h1>;
        }

        const createdAt = property.createdAt ? new Date(property.createdAt) : null;
        const updatedAt = property.updatedAt ? new Date(property.updatedAt) : null;

        const formattedReservations = reservations.map((reservation) => ({
            startDate: new Date(reservation.startDate).toISOString(),
            endDate: new Date(reservation.endDate).toISOString(),
            status: reservation.status || "PENDING",
        }));

        return (
            <div className="container mx-auto py-6 px-4">
                <Header
                    property={property}
                    isLoggedIn={isLoggedIn}
                />

                <div className="grid lg:grid-cols-3 gap-6">
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
            <div className="text-center text-2xl font-bold mt-10">
                <h1>Ошибка загрузки данных</h1>
                <p className="text-red-500">{errorMessage}</p>
            </div>
        );
    }
}

function Header({ property, isLoggedIn }: { property: PostData; isLoggedIn: boolean }) {
    return (
        <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600">
                    {Icons.address}
                    <p>
                        {property.address}, {property.city}
                    </p>
                </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
                {property.id && <ComplaintButton postId={property.id} isLoggedIn={isLoggedIn} />}
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
        <div className="sticky top-20 space-y-6">
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
        <section className="bg-white p-6 shadow-md rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
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
        <div className="bg-gradient-to-br from-white via-gray-100 to-gray-200 p-8 shadow-lg rounded-xl mb-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <FavoriteButton isFavorite={isFavorite} id={"pricebox"} />
                    <ShareButton title={"Цена"} />
                </div>
            </div>
            <p className="text-5xl font-bold text-gray-900 mb-4">{price.toLocaleString()} ₽</p>

            <div className="flex items-center text-gray-600 mt-6 mb-6">
                {Icons.views}
                <p>{views} просмотров</p>
            </div>
            <div className="text-gray-500">
                {updatedAt && updatedAt !== createdAt ? (
                    <p>Изменено: {formatDate(updatedAt.toISOString())}</p>
                ) : (
                    <p>Добавлено: {createdAt ? formatDate(createdAt.toISOString()) : ""}</p>
                )}
            </div>
        </div>
    );
}