'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PostData } from '@/types/propertyTypes';
import SelledPropertyCard from "@/components/property/SelledPropertyCard";
import LeasedPropertyCard from "@/components/property/LeasedPropertyCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { fetchProperties } from "@/services/propertyService";
import {
    Home,
    Building,
    Calendar,
    Search,
    Plus,
    AlertTriangle,
    SortDesc,
    Filter,
    SortAsc,
    ListFilter,
    X
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface MyPropertiesSectionProps {
    userId: string;
}

type SortOption = 'newest' | 'oldest' | 'priceAsc' | 'priceDesc';
type PropertyTypeFilter = 'ALL' | 'APARTMENT' | 'HOUSE' | 'LAND_PLOT';

export default function MyPropertiesSection({ userId }: MyPropertiesSectionProps) {
    // State for property data
    const [saleProperties, setSaleProperties] = useState<PostData[]>([]);
    const [leasedProperties, setLeasedProperties] = useState<PostData[]>([]);
    const [filteredSaleProperties, setFilteredSaleProperties] = useState<PostData[]>([]);
    const [filteredLeasedProperties, setFilteredLeasedProperties] = useState<PostData[]>([]);

    // UI state
    const [loading, setLoading] = useState({ sale: true, lease: true });
    const [errors, setErrors] = useState<{ sale: string | null; lease: string | null }>({ sale: null, lease: null });
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const [propertyTypeFilter, setPropertyTypeFilter] = useState<PropertyTypeFilter>('ALL');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('sale');
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

    // Fetch properties on component mount
    useEffect(() => {
        const fetchAllProperties = async () => {
            try {
                setLoading({ sale: true, lease: true });
                setErrors({ sale: null, lease: null });

                const [saleData, leaseData] = await Promise.all([
                    fetchProperties({ userId, type: 'SALE' }),
                    fetchProperties({ userId, type: 'RENT' }),
                ]);

                setSaleProperties(saleData);
                setFilteredSaleProperties(saleData);
                setLeasedProperties(leaseData);
                setFilteredLeasedProperties(leaseData);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
                setErrors({
                    sale: errorMessage.includes("SALE") ? errorMessage : null,
                    lease: errorMessage.includes("RENT") ? errorMessage : null,
                });

                toast({
                    title: "Ошибка загрузки",
                    description: "Не удалось загрузить данные о недвижимости",
                    variant: "destructive",
                });
            } finally {
                setLoading({ sale: false, lease: false });
            }
        };

        fetchAllProperties();
    }, [userId, toast]);

    // Filter and sort properties when query or sort option changes
    useEffect(() => {
        // Filter and sort sale properties
        let saleResult = [...saleProperties];

        // Apply property type filter
        if (propertyTypeFilter !== 'ALL') {
            saleResult = saleResult.filter(property => property.property === propertyTypeFilter);
        }

        // Apply search query filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            saleResult = saleResult.filter(
                (property) =>
                    property.title?.toLowerCase().includes(query) ||
                    property.description?.toLowerCase().includes(query) ||
                    property.address?.toLowerCase().includes(query)
            );
        }

        // Sort based on selected option
        saleResult.sort((a, b) => {
            switch (sortOption) {
                case 'newest':
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                case 'oldest':
                    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();

                default:
                    return 0;
            }
        });

        setFilteredSaleProperties(saleResult);

        // Filter and sort leased properties
        let leaseResult = [...leasedProperties];

        // Apply property type filter
        if (propertyTypeFilter !== 'ALL') {
            leaseResult = leaseResult.filter(property => property.property === propertyTypeFilter);
        }

        // Apply search query filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            leaseResult = leaseResult.filter(
                (property) =>
                    property.title?.toLowerCase().includes(query) ||
                    property.description?.toLowerCase().includes(query) ||
                    property.address?.toLowerCase().includes(query)
            );
        }

        // Sort based on selected option
        leaseResult.sort((a, b) => {
            switch (sortOption) {
                case 'newest':
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                case 'oldest':
                    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();

                default:
                    return 0;
            }
        });

        setFilteredLeasedProperties(leaseResult);
    }, [saleProperties, leasedProperties, searchQuery, sortOption, propertyTypeFilter]);

    // Handle property deletion
    const handleDeleteProperty = async (propertyId: string) => {
        try {
            setDeletingId(propertyId);
            const response = await fetch(`/api/properties/${propertyId}`, { method: 'DELETE' });

            if (!response.ok) throw new Error('Ошибка при удалении недвижимости');

            // Update state after successful deletion
            setSaleProperties((prev) => prev.filter((property) => property.id !== propertyId));
            setLeasedProperties((prev) => prev.filter((property) => property.id !== propertyId));

            toast({
                title: "Удалено успешно",
                description: "Объект недвижимости был удален",
                variant: "default",
            });
        } catch (error) {
            console.error('Ошибка при удалении недвижимости:', error);

            toast({
                title: "Ошибка",
                description: "Не удалось удалить объект недвижимости",
                variant: "destructive",
            });
        } finally {
            setDeletingId(null);
        }
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery('');
        setSortOption('newest');
        setPropertyTypeFilter('ALL');
    };

    const hasActiveFilters = searchQuery || sortOption !== 'newest' || propertyTypeFilter !== 'ALL';

    // Render components for property lists
    const renderSaleProperties = (properties: PostData[]) => (
        <AnimatePresence>
            <motion.div className="space-y-4">
                {properties.length === 0 && searchQuery && (
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
                )}

                {properties.map((property) => (
                    <motion.div
                        key={property.id}
                        variants={itemVariants}
                        exit="exit"
                        layout
                    >
                        <SelledPropertyCard
                            property={property}
                            isOwnProperty={true}
                            onDelete={handleDeleteProperty}
                            isDeleting={deletingId === property.id}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </AnimatePresence>
    );

    const renderLeaseProperties = (properties: PostData[]) => (
        <AnimatePresence>
            <motion.div className="space-y-4">
                {properties.length === 0 && searchQuery && (
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
                )}

                {properties.map((property) => (
                    <motion.div
                        key={property.id}
                        variants={itemVariants}
                        exit="exit"
                        layout
                    >
                        <LeasedPropertyCard
                            property={property}
                            onDelete={handleDeleteProperty}
                            currentUserId={userId}
                            isDeleting={deletingId === property.id}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </AnimatePresence>
    );

    // Empty state components
    const renderEmptySale = () => (
        <motion.div
            className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Building className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-medium text-slate-700 mb-2">У вас нет объектов на продажу</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
                Разместите свой первый объект недвижимости на продажу, чтобы он появился здесь
            </p>
            <Button asChild variant="default" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Link href="/properties/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить объект на продажу
                </Link>
            </Button>
        </motion.div>
    );

    const renderEmptyLease = () => (
        <motion.div
            className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Calendar className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-medium text-slate-700 mb-2">У вас нет объектов в аренду</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
                Разместите свой первый объект недвижимости в аренду, чтобы он появился здесь
            </p>
            <Button asChild variant="default" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Link href="/properties/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить объект в аренду
                </Link>
            </Button>
        </motion.div>
    );

    // Loading state
    const renderLoading = () => (
        <div className="flex items-center justify-center h-64">
            <div className="relative h-16 w-16">
                <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-200 border-l-blue-200 animate-spin"></div>
                <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-200 border-l-indigo-200 animate-spin animation-delay-150"></div>
            </div>
        </div>
    );

    return (
        <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <motion.div variants={itemVariants} className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-blue-500" />
                    <h2 className="text-2xl font-bold text-slate-800">Моя недвижимость</h2>
                    <Badge className="ml-2 bg-blue-50 text-blue-600">
                        {saleProperties.length + leasedProperties.length}
                    </Badge>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Button asChild variant="default" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                        <Link href="/properties/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Добавить объект
                        </Link>
                    </Button>
                </motion.div>
            </div>

            <Tabs
                defaultValue="sale"
                className="w-full"
                onValueChange={setActiveTab}
            >
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <TabsList className="bg-slate-100">
                        <TabsTrigger
                            value="sale"
                            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                        >
                            <Building className="mr-2 h-4 w-4" />
                            Продаваемая
                            {saleProperties.length > 0 && (
                                <Badge className="ml-2 bg-blue-100 text-blue-600">{saleProperties.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="rent"
                            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            Сдаваемая в аренду
                            {leasedProperties.length > 0 && (
                                <Badge className="ml-2 bg-blue-100 text-blue-600">{leasedProperties.length}</Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {(
                        (activeTab === 'sale' && saleProperties.length > 0) ||
                        (activeTab === 'rent' && leasedProperties.length > 0)
                    ) && (
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input
                                    className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-400 w-full"
                                    placeholder="Поиск по объектам..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Select value={propertyTypeFilter} onValueChange={(value) => setPropertyTypeFilter(value as PropertyTypeFilter)}>
                                    <SelectTrigger className="bg-slate-50 border-slate-200 w-full sm:w-auto min-w-[150px]">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <ListFilter className="h-4 w-4 flex-shrink-0" />
                                            <SelectValue placeholder="Тип недвижимости" className="truncate" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">Все типы</SelectItem>
                                        <SelectItem value="APARTMENT">Квартиры</SelectItem>
                                        <SelectItem value="HOUSE">Дома</SelectItem>
                                        <SelectItem value="LAND_PLOT">Земельные участки</SelectItem>
                                    </SelectContent>
                                </Select>

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
                            </div>

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
                    )}
                </motion.div>

                <TabsContent value="sale" className="mt-0">
                    {loading.sale ? (
                        renderLoading()
                    ) : errors.sale ? (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            <AlertDescription>{errors.sale}</AlertDescription>
                        </Alert>
                    ) : saleProperties.length === 0 ? (
                        renderEmptySale()
                    ) : (
                        renderSaleProperties(filteredSaleProperties)
                    )}
                </TabsContent>

                <TabsContent value="rent" className="mt-0">
                    {loading.lease ? (
                        renderLoading()
                    ) : errors.lease ? (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            <AlertDescription>{errors.lease}</AlertDescription>
                        </Alert>
                    ) : leasedProperties.length === 0 ? (
                        renderEmptyLease()
                    ) : (
                        renderLeaseProperties(filteredLeasedProperties)
                    )}
                </TabsContent>
            </Tabs>
        </motion.section>
    );
}