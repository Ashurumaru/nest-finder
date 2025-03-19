// components/map/FilterPanel.tsx
import { useState, useEffect } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";

interface FilterPanelProps {
    filters: {
        type: string;
        propertyType: string;
        minPrice: string;
        maxPrice: string;
        rooms: string[];
    };
    onFilterChange: (filters: any) => void;
}

const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    // Update local filters when props change
    useEffect(() => {
        setLocalFilters(filters);
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

    const handleApplyFilters = () => {
        onFilterChange(localFilters);
    };

    const handleResetFilters = () => {
        const resetFilters = {
            type: "SALE",
            propertyType: "",
            minPrice: "",
            maxPrice: "",
            rooms: []
        };
        setLocalFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className="bg-white border-b border-gray-200">
            {/* Filter Toggle Button */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center">
                    <FaFilter className="mr-2 text-primary" />
                    <span className="font-medium">Фильтры</span>
                </div>
                <FaChevronDown className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </div>

            {/* Filter Panel Content */}
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[600px]' : 'max-h-0'}`}>
                <div className="p-4 space-y-4">
                    {/* Property Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Тип сделки</label>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => setLocalFilters(prev => ({ ...prev, type: "SALE" }))}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    localFilters.type === "SALE"
                                        ? "bg-primary text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                Продажа
                            </button>
                            <button
                                type="button"
                                onClick={() => setLocalFilters(prev => ({ ...prev, type: "RENT" }))}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    localFilters.type === "RENT"
                                        ? "bg-primary text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Цена, ₽
                        </label>
                        <div className="flex space-x-2">
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
                                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                                            localFilters.rooms.includes(room)
                                                ? "bg-primary text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    >
                                        {room === "0" ? "Студия" : room === "4" ? "4+" : room}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                        <button
                            type="button"
                            onClick={handleApplyFilters}
                            className="w-3/4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                        >
                            Применить
                        </button>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="w-1/4 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
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