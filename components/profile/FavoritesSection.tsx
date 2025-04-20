'use client';

import { useEffect, useState } from 'react';
import { PostData } from '@/types/propertyTypes';
import SelledPropertyCard from '@/components/property/SelledPropertyCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Heart,
    Filter,
    SortAsc,
    SortDesc,
    Home,
    Building,
    Map
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/useToast';

interface FavoritesSectionProps {
    userId: string;
}

type SortOption = 'newest' | 'oldest';

export default function FavoritesSection({ userId }: FavoritesSectionProps) {
    const [favorites, setFavorites] = useState<PostData[]>([]);
    const [filteredFavorites, setFilteredFavorites] = useState<PostData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('ALL');
    const [deletingId, setDeletingId] = useState<string | null>(null);
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

    // Fetch favorites when component mounts
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/api/saved-properties?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке избранных объектов');
                }
                const data = await response.json();
                const favoriteProperties = data.map((savedPost: any) => savedPost.post);
                setFavorites(favoriteProperties);
                setFilteredFavorites(favoriteProperties);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Неизвестная ошибка при загрузке избранного');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [userId]);

    // Filter and sort favorites when any filter/sort option changes
    useEffect(() => {
        // Filter by search query and property type
        let result = [...favorites];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (post) =>
                    post.title?.toLowerCase().includes(query) ||
                    post.description?.toLowerCase().includes(query) ||
                    post.address?.toLowerCase().includes(query)
            );
        }

        if (propertyTypeFilter !== 'ALL') {
            result = result.filter(post => post.property === propertyTypeFilter);
        }

        // Sort based on selected option
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

        setFilteredFavorites(result);
    }, [favorites, searchQuery, sortOption, propertyTypeFilter]);

    // Remove property from favorites
    const handleRemoveFavorite = async (propertyId: string) => {
        try {
            setDeletingId(propertyId);
            const response = await fetch(`/api/saved-properties/${propertyId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при удалении из избранного');
            }

            // Update favorites state after successful deletion
            setFavorites((prevFavorites) =>
                prevFavorites.filter((post) => post.id !== propertyId)
            );

            toast({
                title: "Удалено из избранного",
                description: "Объект был успешно удален из списка избранного",
                variant: "default",
            });
        } catch (error) {
            console.error(`Ошибка при удалении объекта ${propertyId} из избранного:`, error);
            setError('Не удалось удалить объект из избранного');

            toast({
                title: "Ошибка",
                description: "Не удалось удалить объект из избранного. Попробуйте позже.",
                variant: "destructive",
            });
        } finally {
            setDeletingId(null);
        }
    };

    // Different loading states
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
            <Heart className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-medium text-slate-700 mb-2">Список избранного пуст</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
                Добавляйте понравившиеся объекты недвижимости в избранное, чтобы быстро возвращаться к ним позже.
            </p>
            <Button asChild variant="outline" className="bg-white hover:bg-slate-50">
                <a href="/properties">Перейти к каталогу недвижимости</a>
            </Button>
        </motion.div>
    );

    // Error state
    const renderError = () => (
        <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );

    if (loading) {
        return renderLoading();
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <motion.div variants={itemVariants} className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <h2 className="text-2xl font-bold text-slate-800">Мое избранное</h2>
                    <Badge className="ml-2 bg-red-50 text-red-600 hover:bg-red-100 border-red-200">
                        {filteredFavorites.length}
                    </Badge>
                </motion.div>
            </div>

            {error && renderError()}

            {!loading && favorites.length > 0 && (
                <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-400"
                                placeholder="Поиск по названию, описанию, адресу..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Тип недвижимости" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Все типы</SelectItem>
                                <SelectItem value="APARTMENT">
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4" />
                                        <span>Квартиры</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="HOUSE">
                                    <div className="flex items-center gap-2">
                                        <Home className="h-4 w-4" />
                                        <span>Дома</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="LAND_PLOT">
                                    <div className="flex items-center gap-2">
                                        <Map className="h-4 w-4" />
                                        <span>Земельные участки</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between bg-slate-50 border-slate-200">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <span>Сортировка</span>
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
                </motion.div>
            )}

            {!loading && favorites.length === 0 ? renderEmpty() : (
                <AnimatePresence>
                    <motion.div className="space-y-4">
                        {filteredFavorites.length === 0 && searchQuery && (
                            <motion.div
                                variants={itemVariants}
                                className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100"
                            >
                                <Search className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                                <h3 className="text-lg font-medium text-slate-700 mb-2">Ничего не найдено</h3>
                                <p className="text-slate-500">Попробуйте изменить параметры поиска</p>
                            </motion.div>
                        )}

                        {filteredFavorites.map((post) => (
                            <motion.div
                                key={post.id}
                                variants={itemVariants}
                                exit="exit"
                                layout
                            >
                                <SelledPropertyCard
                                    property={post}
                                    isOwnProperty={false}
                                    onDelete={() => {
                                        if (post.id) {
                                            handleRemoveFavorite(post.id);
                                        }
                                    }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}
        </motion.div>
    );
}