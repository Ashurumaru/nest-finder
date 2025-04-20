'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReservationData } from '@/types/propertyTypes';
import RentedPropertyCard from "@/components/property/RentedPropertyCard";
import { fetchReservations } from "@/services/propertyService";
import {
    Calendar,
    Search,
    Filter,
    SortDesc,
    SortAsc,
    AlertTriangle,
    Home,
    CheckCircle,
    Clock,
    XCircle,
    X
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { ReservationStatus } from "@prisma/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface BookedPropertiesSectionProps {
    userId: string;
}

type SortOption = 'newest' | 'oldest' | 'priceAsc' | 'priceDesc';

export default function BookedPropertiesSection({ userId }: BookedPropertiesSectionProps) {
    // State
    const [bookedProperties, setBookedProperties] = useState<ReservationData[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<ReservationData[]>([]);
    const [loadingBooked, setLoadingBooked] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'ALL'>('ALL');
    const { toast } = useToast();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        },
        exit: {
            opacity: 0,
            x: -10,
            transition: { duration: 0.2 }
        }
    };

    // Fetch booked properties
    useEffect(() => {
        const fetchBookedProperties = async () => {
            try {
                setLoadingBooked(true);
                setError(null);

                const data = await fetchReservations({ userId });
                setBookedProperties(data);
                setFilteredProperties(data);

                // Show notification if empty
                if (data.length === 0) {
                    toast({
                        title: "Нет бронирований",
                        description: "У вас пока нет забронированной недвижимости",
                        variant: "default",
                    });
                }
            } catch (err) {
                setError('Ошибка при загрузке забронированной недвижимости');

                toast({
                    title: "Ошибка загрузки",
                    description: "Не удалось загрузить данные о бронированиях",
                    variant: "destructive",
                });
            } finally {
                setLoadingBooked(false);
            }
        };

        fetchBookedProperties();
    }, [userId, toast]);

    // Filter and sort properties when filter options change
    useEffect(() => {
        let result = [...bookedProperties];

        // Apply status filter
        if (statusFilter !== 'ALL') {
            result = result.filter(reservation => reservation.status === statusFilter);
        }

        // Apply search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (reservation) =>
                    reservation.post?.title?.toLowerCase().includes(query) ||
                    reservation.post?.description?.toLowerCase().includes(query) ||
                    reservation.post?.address?.toLowerCase().includes(query) ||
                    reservation.post?.city?.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (sortOption) {
                case 'newest':
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                case 'oldest':
                    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                default:
                    return 0;
            }
        });

        setFilteredProperties(result);
    }, [bookedProperties, searchQuery, sortOption, statusFilter]);

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery('');
        setSortOption('newest');
        setStatusFilter('ALL');
    };

    const hasActiveFilters = searchQuery || sortOption !== 'newest' || statusFilter !== 'ALL';

    // Calculate counts
    const pendingCount = bookedProperties.filter(res => res.status === 'PENDING').length;
    const confirmedCount = bookedProperties.filter(res => res.status === 'CONFIRMED').length;
    const cancelledCount = bookedProperties.filter(res => res.status === 'CANCELLED').length;

    // Get status badge color
    const getStatusColor = (status: ReservationStatus) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    // Get status icon
    const getStatusIcon = (status: ReservationStatus) => {
        switch (status) {
            case 'CONFIRMED': return <CheckCircle className="h-3.5 w-3.5 text-green-600" />;
            case 'CANCELLED': return <XCircle className="h-3.5 w-3.5 text-red-600" />;
            case 'PENDING': return <Clock className="h-3.5 w-3.5 text-amber-600" />;
            default: return null;
        }
    };

    // Loading state
    const renderLoading = () => (
        <div className="flex items-center justify-center h-64">
            <div className="relative h-16 w-16">
                <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-200 border-l-blue-200 animate-spin"></div>
                <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-200 border-l-indigo-200 animate-spin animation-delay-150"></div>
            </div>
        </div>
    );

    // Empty state
    const renderEmpty = () => (
        <motion.div
            className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Calendar className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-medium text-slate-700 mb-2">У вас нет забронированной недвижимости</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
                Здесь будут отображаться все ваши бронирования недвижимости
            </p>
            <Button asChild variant="outline" className="bg-white hover:bg-slate-50">
                <a href="/properties">Перейти к каталогу недвижимости</a>
            </Button>
        </motion.div>
    );

    // No results state
    const renderNoResults = () => (
        <motion.div
            variants={itemVariants}
            className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100"
        >
            <Search className="h-10 w-10 mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">Ничего не найдено</h3>
            <p className="text-slate-500">Попробуйте изменить параметры поиска</p>
            <Button
                variant="outline"
                className="mt-4"
                onClick={resetFilters}
            >
                <X className="mr-2 h-4 w-4" />
                Сбросить фильтры
            </Button>
        </motion.div>
    );

    return (
        <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <motion.div variants={itemVariants} className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <h2 className="text-2xl font-bold text-slate-800">Забронированная недвижимость</h2>
                    <Badge className="ml-2 bg-blue-50 text-blue-600 hover:bg-blue-100">
                        {bookedProperties.length}
                    </Badge>
                </motion.div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loadingBooked ? (
                renderLoading()
            ) : bookedProperties.length === 0 ? (
                renderEmpty()
            ) : (
                <>
                    <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <Tabs defaultValue="ALL" className="w-full" onValueChange={(value) => setStatusFilter(value as ReservationStatus | 'ALL')}>
                            <TabsList className="bg-slate-100 w-full md:w-auto">
                                <TabsTrigger
                                    value="ALL"
                                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                                >
                                    Все
                                    <Badge className="ml-2 bg-blue-100 text-blue-600">{bookedProperties.length}</Badge>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="PENDING"
                                    className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm"
                                >
                                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                                    Ожидание
                                    {pendingCount > 0 && <Badge className="ml-2 bg-amber-100 text-amber-600">{pendingCount}</Badge>}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="CONFIRMED"
                                    className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
                                >
                                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                    Подтверждено
                                    {confirmedCount > 0 && <Badge className="ml-2 bg-green-100 text-green-600">{confirmedCount}</Badge>}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="CANCELLED"
                                    className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
                                >
                                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                    Отменено
                                    {cancelledCount > 0 && <Badge className="ml-2 bg-red-100 text-red-600">{cancelledCount}</Badge>}
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input
                                    className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-400 w-full"
                                    placeholder="Поиск по бронированиям..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="justify-between bg-slate-50 border-slate-200 w-full sm:w-auto">
                                        <div className="flex items-center gap-2">
                                            <Filter className="h-4 w-4" />
                                            <span className="mr-2 hidden sm:inline">Сортировка</span>
                                        </div>
                                        {sortOption === 'newest' && <Badge className="ml-2 bg-blue-50 text-blue-600">Новые</Badge>}
                                        {sortOption === 'oldest' && <Badge className="ml-2 bg-blue-50 text-blue-600">Старые</Badge>}

                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSortOption('newest')}>
                                        <SortDesc className="h-4 w-4 mr-2" />
                                        <span>Сначала новые</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortOption('oldest')}>
                                        <SortAsc className="h-4 w-4 mr-2" />
                                        <span>Сначала старые</span>
                                    </DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>

                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-slate-500 hover:text-slate-700"
                                    onClick={resetFilters}
                                    title="Сбросить все фильтры"
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Сбросить фильтры</span>
                                </Button>
                            )}
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {filteredProperties.length === 0 ? (
                            renderNoResults()
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                className="space-y-4"
                            >
                                {filteredProperties.map((reservation) => (
                                    <motion.div
                                        key={reservation.id}
                                        variants={itemVariants}
                                        exit="exit"
                                        layout
                                    >
                                        <RentedPropertyCard
                                            reservation={reservation}
                                            getStatusColor={getStatusColor}
                                            getStatusIcon={getStatusIcon}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </motion.section>
    );
}