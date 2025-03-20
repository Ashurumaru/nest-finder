import { useState, useEffect } from "react";
import { FaChevronDown, FaFilter, FaLocationArrow, FaSort, FaSearch } from "react-icons/fa";
import { Slider } from "@/components/ui/slider";

interface FilterPanelProps {
    filters: {
        type: string;
        propertyType: string;
        minPrice: string;
        maxPrice: string;
        rooms: string[];
        sortBy?: string;
        maxDistance?: string;
    };
    onFilterChange: (filters: any) => void;
    totalProperties?: number;
    loading?: boolean;
}

const FilterPanel = ({ filters, onFilterChange, totalProperties = 0, loading = false }: FilterPanelProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [priceRange, setPriceRange] = useState([
        filters.minPrice ? parseInt(filters.minPrice) : 0,
        filters.maxPrice ? parseInt(filters.maxPrice) : 100000000
    ]);

    // Максимальная цена для слайдера
    const maxPriceValue = 100000000; // 100 млн рублей

    // Update local filters when props change
    useEffect(() => {
        setLocalFilters(filters);
        setPriceRange([
            filters.minPrice ? parseInt(filters.minPrice) : 0,
            filters.maxPrice ? parseInt(filters.maxPrice) : maxPriceValue
        ]);
    }, [filters]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleRoomToggle = (room: string) => {
        setLocalFilters(prev => {
            const roomsSet = new Set(prev.rooms);

            if (roomsSet.has(room)) {
                roomsSet.delete(room);
            } else {
                roomsSet.add(room);
            }

            return { ...prev, rooms: Array.from(roomsSet) };
        });
    };

    const handlePriceChange = (values: number[]) => {
        setPriceRange(values);
        setLocalFilters(prev => ({
            ...prev,
            minPrice: values[0].toString(),
            maxPrice: values[1].toString()
        }));
    };

    const handleApplyFilters = () => {
        onFilterChange(localFilters);
    };

    const handleResetFilters = () => {
        const resetFilters = {
            type: "SALE",
            propertyType: "",
            minPrice: "",
            maxPrice: "",
            rooms: [],
            sortBy: "",
            maxDistance: ""
        };
        setLocalFilters(resetFilters);
        setPriceRange([0, maxPriceValue]);
        onFilterChange(resetFilters);
    };

    // Форматирование цены для отображения
    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return (price / 1000000).toFixed(1) + ' млн ₽';
        } else {
            return price.toLocaleString() + ' ₽';
        }
    };

    return (
        <div className="bg-white border-b border-gray-200">
            {/* Filter Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50">
                <div className="flex items-center">
                    <FaFilter className="mr-2 text-primary" />
                    <span className="font-medium">Фильтры</span>
                    {!loading && totalProperties > 0 && (
                        <span className="ml-2 text-xs text-gray-500">
                            Найдено: {totalProperties}
                        </span>
                    )}
                </div>
                <div className="flex items-center">
                    {loading && (
                        <div className="mr-3 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <button
                        className="flex items-center text-sm text-gray-600 hover:text-primary"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Скрыть' : 'Показать'}
                        <FaChevronDown className={`ml-1 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Filter Panel Content */}
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <div className="p-4 space-y-4">
                    {/* Quick Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Поиск по адресу или названию"
                            className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    {/* Property Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Тип сделки</label>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => setLocalFilters(prev => ({ ...prev, type: "SALE" }))}
                                className={`px-4 py-2 text-sm font-medium rounded-md flex-1 transition-colors ${
                                    localFilters.type === "SALE"
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Продажа
                            </button>
                            <button
                                type="button"
                                onClick={() => setLocalFilters(prev => ({ ...prev, type: "RENT" }))}
                                className={`px-4 py-2 text-sm font-medium rounded-md flex-1 transition-colors ${
                                    localFilters.type === "RENT"
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Аренда
                            </button>
                        </div>
                    </div>

                    {/* Property Category */}
                    <div>
                        <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                            Тип недвижимости
                        </label>
                        <select
                            id="propertyType"
                            name="propertyType"
                            value={localFilters.propertyType}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        >
                            <option value="">Все типы</option>
                            <option value="APARTMENT">Квартира</option>
                            <option value="HOUSE">Дом</option>
                            <option value="LAND">Земельный участок</option>
                        </select>
                    </div>

                    {/* Price Range */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Цена
                            </label>
                            <div className="text-sm text-gray-500">
                                от {formatPrice(priceRange[0])} до {formatPrice(priceRange[1])}
                            </div>
                        </div>
                        <div className="py-6 px-4">
                            <div className="w-full">
                                <Slider
                                    defaultValue={[0, maxPriceValue]}
                                    min={0}
                                    max={maxPriceValue}
                                    step={50000}
                                    value={priceRange}
                                    onValueChange={handlePriceChange}
                                    minStepsBetweenThumbs={5}
                                />
                            </div>
                        </div>
                        <div className="flex space-x-2 mt-2">
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="От"
                                value={localFilters.minPrice}
                                onChange={handleInputChange}
                                className="w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="До"
                                value={localFilters.maxPrice}
                                onChange={handleInputChange}
                                className="w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Rooms (for apartments and houses) */}
                    {(localFilters.propertyType === "APARTMENT" || localFilters.propertyType === "HOUSE" || localFilters.propertyType === "") && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Количество комнат
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {["0", "1", "2", "3", "4"].map((room) => (
                                    <button
                                        key={room}
                                        type="button"
                                        onClick={() => handleRoomToggle(room)}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            localFilters.rooms.includes(room)
                                                ? "bg-primary text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {room === "0" ? "Студия" : room === "4" ? "4+" : room}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Advanced Options Toggle */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center text-sm text-gray-600 hover:text-primary"
                        >
                            <span>Дополнительные параметры</span>
                            <FaChevronDown className={`ml-1 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Advanced Options */}
                    {showAdvanced && (
                        <div className="space-y-4 pt-2 border-t border-gray-200">
                            {/* Sort By */}
                            <div>
                                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                                    Сортировка
                                </label>
                                <div className="relative">
                                    <select
                                        id="sortBy"
                                        name="sortBy"
                                        value={localFilters.sortBy || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    >
                                        <option value="">По умолчанию</option>
                                        <option value="price_asc">Цена (по возрастанию)</option>
                                        <option value="price_desc">Цена (по убыванию)</option>
                                        <option value="date_desc">Сначала новые</option>
                                        <option value="date_asc">Сначала старые</option>
                                    </select>
                                    <FaSort className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Max Distance */}
                            <div>
                                <label htmlFor="maxDistance" className="block text-sm font-medium text-gray-700 mb-1">
                                    Расстояние от центра (км)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="maxDistance"
                                        name="maxDistance"
                                        value={localFilters.maxDistance || ""}
                                        onChange={handleInputChange}
                                        placeholder="Не ограничено"
                                        className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    />
                                    <FaLocationArrow className="absolute left-3 top-3 text-gray-400" />
                                </div>
                            </div>

                            {/* Можно добавить другие дополнительные параметры */}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={handleApplyFilters}
                            className="w-3/4 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Применить
                        </button>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="w-1/4 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Сброс
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;