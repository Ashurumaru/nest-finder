'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createChat } from '@/services/ChatService';
import { PostData } from '@/types/propertyTypes';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {
    Bed,
    Bath,
    Ruler,
    MapPin,
    Pencil,
    Trash2,
    Calendar,
    Clock,
    CreditCard,
    MessageSquare,
    CheckCircle,
    XCircle,
    ChevronsRight,
    Tag,
    UserCheck,
    Filter,
    Home
} from 'lucide-react';
import { updateReservationStatus } from '@/services/propertyService';
import { ReservationStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/useToast';

interface LeasedPropertyCardProps {
    property: PostData;
    onDelete: (id: string) => void;
    currentUserId: string;
    isDeleting?: boolean;
}

type TimeFilter = 'ALL' | 'CURRENT' | 'PAST';

const LeasedPropertyCard: React.FC<LeasedPropertyCardProps> = ({
                                                                   property,
                                                                   onDelete,
                                                                   currentUserId,
                                                                   isDeleting = false
                                                               }) => {
    const [showReservations, setShowReservations] = useState(false);
    const [filterStatus, setFilterStatus] = useState<ReservationStatus | 'ALL'>('ALL');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL');
    const [error, setError] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [contactingUser, setContactingUser] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const imageSrc = property.imageUrls?.[0] || '/images/default-property.jpg';
    const formattedPrice = property.price?.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }) || 'Н/Д';

    const formatDate = (dateString?: Date | string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const confirmDelete = () => {
        if (property.id) onDelete(property.id);
    };

    const handleContact = async (recipientId: string | undefined) => {
        try {
            if (!recipientId) {
                toast({
                    title: "Ошибка",
                    description: "ID получателя не найден",
                    variant: "destructive",
                });
                return;
            }

            setContactingUser(recipientId);
            const chatId = await createChat(currentUserId, recipientId);
            router.push(`/chat/${chatId}`);
        } catch (error) {
            console.error("Ошибка при создании чата:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось создать чат. Попробуйте снова.",
                variant: "destructive",
            });
        } finally {
            setContactingUser(null);
        }
    };

    const handleStatusUpdate = async (reservationId: string, status: ReservationStatus) => {
        try {
            setUpdatingStatus(reservationId);
            setError(null);
            await updateReservationStatus(reservationId, status);

            // Update UI by updating the reservation status locally
            property.reservations = property.reservations?.map(reservation =>
                reservation.id === reservationId
                    ? { ...reservation, status }
                    : reservation
            );

            const statusMessages = {
                CONFIRMED: "Бронирование подтверждено",
                CANCELLED: "Бронирование отменено",
                PENDING: "Бронирование ожидает подтверждения"
            };

            toast({
                title: "Статус обновлен",
                description: statusMessages[status],
                variant: status === 'CANCELLED' ? "destructive" : "default",
            });
        } catch (err) {
            setError("Не удалось обновить статус бронирования");
            toast({
                title: "Ошибка",
                description: "Не удалось обновить статус бронирования",
                variant: "destructive",
            });
            console.error(err);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const filteredReservations = property.reservations?.filter((reservation) => {
        const matchesStatus = filterStatus === 'ALL' || reservation.status === filterStatus;
        const now = new Date();

        let matchesTime = true;
        if (timeFilter === 'CURRENT') {
            matchesTime = new Date(reservation.endDate) >= now;
        } else if (timeFilter === 'PAST') {
            matchesTime = new Date(reservation.endDate) < now;
        }

        return matchesStatus && matchesTime;
    });

    const reservationCount = property.reservations?.length || 0;
    const pendingCount = property.reservations?.filter(r => r.status === 'PENDING').length || 0;

    const getStatusColor = (status: ReservationStatus) => {
        switch (status) {
            case 'CONFIRMED': return 'text-green-600 bg-green-50 border-green-200';
            case 'CANCELLED': return 'text-red-600 bg-red-50 border-red-200';
            case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getStatusIcon = (status: ReservationStatus) => {
        switch (status) {
            case 'CONFIRMED': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'CANCELLED': return <XCircle className="h-4 w-4 text-red-600" />;
            case 'PENDING': return <Clock className="h-4 w-4 text-amber-600" />;
            default: return null;
        }
    };

    return (
        <motion.div
            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300"
            whileHover={{ y: -3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            layout
        >
            <div className="flex flex-col md:flex-row">
                {/* Property Image Section */}
                <div className="relative w-full md:w-1/3 h-60 md:h-auto overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                    <Image
                        src={imageSrc}
                        alt={property.title || 'Недвижимость'}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-white/90 backdrop-blur-sm text-blue-600 shadow-md font-semibold text-sm py-1.5 px-3">
                            {formattedPrice} / день
                        </Badge>
                    </div>

                    <div className="absolute bottom-4 left-4 z-20">
                        <Badge className="bg-slate-800/80 text-white flex items-center gap-1.5 backdrop-blur-sm">
                            <Home className="h-4 w-4" />
                            <span>Сдается в аренду</span>
                        </Badge>
                    </div>
                    {property.createdAt && (
                        <div className="absolute bottom-4 right-4 z-20">
                            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-slate-700 flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(property.createdAt)}</span>
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Property Details Section */}
                <div className="w-full md:w-2/3 p-5 flex flex-col">
                    <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-slate-800 line-clamp-2">{property.title}</h3>

                            {reservationCount > 0 && (
                                <Badge className="bg-blue-50 text-blue-600 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{reservationCount} {reservationCount === 1 ? 'бронь' : 'брони'}</span>
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center text-slate-600 mb-3">
                            <MapPin className="h-4 w-4 text-orange-500 mr-1.5 flex-shrink-0" />
                            <span className="text-sm line-clamp-1">{property.address}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-slate-600 text-sm mb-4">
                            {property.apartment && (
                                <>
                                    <div className="flex items-center">
                                        <Bed className="h-4 w-4 text-green-500 mr-1.5" />
                                        <span>{property.apartment.numBedrooms} {property.apartment.numBedrooms === 1 ? 'Спальня' : 'Спальни'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Bath className="h-4 w-4 text-blue-400 mr-1.5" />
                                        <span>{property.apartment.numBathrooms} {property.apartment.numBathrooms === 1 ? 'Ванная' : 'Ванные'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Ruler className="h-4 w-4 text-yellow-500 mr-1.5" />
                                        <span>{property.apartment.apartmentArea} кв.м</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 text-sm text-slate-700 space-y-2 mb-4">
                            {property.rentalFeatures?.availabilityDate && (
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 text-blue-500 mr-1.5" />
                                    <span>Доступно с: <span className="font-medium">{new Date(property.rentalFeatures.availabilityDate).toLocaleDateString()}</span></span>
                                </div>
                            )}
                            {property.rentalFeatures?.securityDeposit && (
                                <div className="flex items-center">
                                    <CreditCard className="h-4 w-4 text-blue-500 mr-1.5" />
                                    <span>Депозит: <span className="font-medium">{property.rentalFeatures.securityDeposit.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</span></span>
                                </div>
                            )}

                            {pendingCount > 0 && (
                                <div className="flex items-center text-amber-600">
                                    <Clock className="h-4 w-4 mr-1.5" />
                                    <span>
                                        {pendingCount} {pendingCount === 1 ? 'бронирование ожидает' : 'бронирования ожидают'} подтверждения
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center mt-auto">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/properties/${property.id}`} passHref>
                                        <Button variant="default" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                                            <span className="mr-1">Подробнее</span>
                                            <ChevronsRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Посмотреть подробную информацию</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button asChild variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                                        <Link href={`/properties/${property.id}/update`}>
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Редактировать
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Изменить информацию об объекте</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Dialog open={showReservations} onOpenChange={setShowReservations}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Брони {reservationCount > 0 && <Badge className="ml-1 bg-blue-100">{reservationCount}</Badge>}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center text-xl">
                                        <UserCheck className="h-5 w-5 mr-2 text-blue-500" />
                                        Управление бронированиями
                                    </DialogTitle>
                                </DialogHeader>

                                <Tabs defaultValue="all" className="mt-2">
                                    <div className="flex items-center justify-between mb-4">
                                        <TabsList className="bg-slate-100">
                                            <TabsTrigger value="all" className="data-[state=active]:bg-white">
                                                Все
                                            </TabsTrigger>
                                            <TabsTrigger value="pending" className="data-[state=active]:bg-white">
                                                Ожидающие
                                                {pendingCount > 0 && (
                                                    <Badge className="ml-1 bg-amber-100 text-amber-700">{pendingCount}</Badge>
                                                )}
                                            </TabsTrigger>
                                            <TabsTrigger value="confirmed" className="data-[state=active]:bg-white">
                                                Подтвержденные
                                            </TabsTrigger>
                                            <TabsTrigger value="cancelled" className="data-[state=active]:bg-white">
                                                Отмененные
                                            </TabsTrigger>
                                        </TabsList>

                                        <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as TimeFilter)}>
                                            <SelectTrigger className="w-auto bg-slate-50 border-slate-200">
                                                <div className="flex items-center gap-2">
                                                    <Filter className="h-4 w-4 text-slate-500" />
                                                    <SelectValue placeholder="Фильтр по дате" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">Все даты</SelectItem>
                                                <SelectItem value="CURRENT">Актуальные</SelectItem>
                                                <SelectItem value="PAST">Прошедшие</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <TabsContent value="all">
                                        <ReservationsList
                                            reservations={property.reservations?.filter(r => {
                                                const now = new Date();
                                                if (timeFilter === 'CURRENT') return new Date(r.endDate) >= now;
                                                if (timeFilter === 'PAST') return new Date(r.endDate) < now;
                                                return true;
                                            })}
                                            handleContact={handleContact}
                                            handleStatusUpdate={handleStatusUpdate}
                                            updatingStatus={updatingStatus}
                                            contactingUser={contactingUser}
                                            getStatusColor={getStatusColor}
                                            getStatusIcon={getStatusIcon}
                                        />
                                    </TabsContent>

                                    <TabsContent value="pending">
                                        <ReservationsList
                                            reservations={property.reservations?.filter(r => {
                                                const now = new Date();
                                                const matchesTime = timeFilter === 'CURRENT'
                                                    ? new Date(r.endDate) >= now
                                                    : timeFilter === 'PAST'
                                                        ? new Date(r.endDate) < now
                                                        : true;
                                                return r.status === 'PENDING' && matchesTime;
                                            })}
                                            handleContact={handleContact}
                                            handleStatusUpdate={handleStatusUpdate}
                                            updatingStatus={updatingStatus}
                                            contactingUser={contactingUser}
                                            getStatusColor={getStatusColor}
                                            getStatusIcon={getStatusIcon}
                                        />
                                    </TabsContent>

                                    <TabsContent value="confirmed">
                                        <ReservationsList
                                            reservations={property.reservations?.filter(r => {
                                                const now = new Date();
                                                const matchesTime = timeFilter === 'CURRENT'
                                                    ? new Date(r.endDate) >= now
                                                    : timeFilter === 'PAST'
                                                        ? new Date(r.endDate) < now
                                                        : true;
                                                return r.status === 'CONFIRMED' && matchesTime;
                                            })}
                                            handleContact={handleContact}
                                            handleStatusUpdate={handleStatusUpdate}
                                            updatingStatus={updatingStatus}
                                            contactingUser={contactingUser}
                                            getStatusColor={getStatusColor}
                                            getStatusIcon={getStatusIcon}
                                        />
                                    </TabsContent>

                                    <TabsContent value="cancelled">
                                        <ReservationsList
                                            reservations={property.reservations?.filter(r => {
                                                const now = new Date();
                                                const matchesTime = timeFilter === 'CURRENT'
                                                    ? new Date(r.endDate) >= now
                                                    : timeFilter === 'PAST'
                                                        ? new Date(r.endDate) < now
                                                        : true;
                                                return r.status === 'CANCELLED' && matchesTime;
                                            })}
                                            handleContact={handleContact}
                                            handleStatusUpdate={handleStatusUpdate}
                                            updatingStatus={updatingStatus}
                                            contactingUser={contactingUser}
                                            getStatusColor={getStatusColor}
                                            getStatusIcon={getStatusIcon}
                                        />
                                    </TabsContent>
                                </Tabs>

                                {error && (
                                    <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md border border-red-200 mt-2">
                                        {error}
                                    </div>
                                )}

                                <DialogFooter>
                                    <Button onClick={() => setShowReservations(false)}>Закрыть</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></div>
                                            Удаление...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Удалить
                                        </>
                                    )}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Это действие нельзя отменить. Объявление будет удалено навсегда, включая все бронирования.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="border-slate-200">Отмена</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={confirmDelete}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Удалить объявление
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Reservations list component to reduce complexity
interface ReservationsListProps {
    reservations: any[] | undefined;
    handleContact: (id: string | undefined) => void;
    handleStatusUpdate: (id: string, status: ReservationStatus) => void;
    updatingStatus: string | null;
    contactingUser: string | null;
    getStatusColor: (status: ReservationStatus) => string;
    getStatusIcon: (status: ReservationStatus) => React.ReactNode;
}

const ReservationsList: React.FC<ReservationsListProps> = ({
                                                               reservations,
                                                               handleContact,
                                                               handleStatusUpdate,
                                                               updatingStatus,
                                                               contactingUser,
                                                               getStatusColor,
                                                               getStatusIcon
                                                           }) => {
    if (!reservations?.length) {
        return (
            <div className="text-center py-8 bg-slate-50 rounded-lg">
                <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">Нет бронирований</h3>
                <p className="text-slate-500">В данный момент нет бронирований, соответствующих фильтрам</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
            {reservations.map((reservation) => (
                <motion.div
                    key={reservation.id}
                    className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                {reservation.user?.name?.[0] || 'U'}
                            </div>
                            <div>
                                <h4 className="font-medium">{reservation.user?.name || 'Пользователь'}</h4>
                                <p className="text-sm text-slate-500">{reservation.user?.email}</p>
                            </div>
                        </div>
                        <Badge className={`${getStatusColor(reservation.status)} flex items-center gap-1.5`}>
                            {getStatusIcon(reservation.status)}
                            <span>
                                {reservation.status === 'CONFIRMED' && 'Подтверждено'}
                                {reservation.status === 'CANCELLED' && 'Отменено'}
                                {reservation.status === 'PENDING' && 'Ожидает'}
                            </span>
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-blue-500 mr-1.5" />
                            <span className="text-slate-600">
                                С {new Date(reservation.startDate).toLocaleDateString()} по {new Date(reservation.endDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 text-blue-500 mr-1.5" />
                            <span className="text-slate-600">
                                Запрос от {new Date(reservation.createdAt || "").toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Tag className="h-4 w-4 text-green-500 mr-1.5" />
                            <span className="text-slate-600">
                                Сумма: <span className="font-medium">{reservation.totalPrice.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap space-x-2 mt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            onClick={() => handleContact(reservation.user?.id)}
                            disabled={contactingUser === reservation.user?.id}
                        >
                            {contactingUser === reservation.user?.id ? (
                                <div className="h-3 w-3 rounded-full border-2 border-current border-r-transparent animate-spin mr-1.5"></div>
                            ) : (
                                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                            )}
                            Связаться
                        </Button>

                        {reservation.status !== 'CONFIRMED' && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-green-200 text-green-700 hover:bg-green-50"
                                onClick={() => handleStatusUpdate(reservation.id, 'CONFIRMED')}
                                disabled={updatingStatus === reservation.id}
                            >
                                {updatingStatus === reservation.id ? (
                                    <div className="h-3 w-3 rounded-full border-2 border-current border-r-transparent animate-spin mr-1.5"></div>
                                ) : (
                                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                )}
                                Подтвердить
                            </Button>
                        )}

                        {reservation.status !== 'CANCELLED' && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-700 hover:bg-red-50"
                                onClick={() => handleStatusUpdate(reservation.id, 'CANCELLED')}
                                disabled={updatingStatus === reservation.id}
                            >
                                {updatingStatus === reservation.id ? (
                                    <div className="h-3 w-3 rounded-full border-2 border-current border-r-transparent animate-spin mr-1.5"></div>
                                ) : (
                                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                )}
                                Отменить
                            </Button>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default LeasedPropertyCard;