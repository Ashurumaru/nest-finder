// components/map/MapControls.tsx
import { FaBars, FaTimes, FaSearchLocation, FaPlus, FaMinus } from "react-icons/fa";
import { useState } from "react";

interface MapControlsProps {
    visiblePanel: boolean;
    togglePanel: () => void;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onMyLocation?: () => void;
}

const MapControls = ({
                         visiblePanel,
                         togglePanel,
                         onZoomIn,
                         onZoomOut,
                         onMyLocation
                     }: MapControlsProps) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMyLocation = () => {
        if (onMyLocation) {
            onMyLocation();
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Show tooltip since we don't have direct handler
                    setShowTooltip(true);
                    setTimeout(() => setShowTooltip(false), 3000);
                },
                () => {
                    alert("Не удалось получить ваше местоположение");
                }
            );
        } else {
            alert("Геолокация не поддерживается вашим браузером");
        }
    };

    return (
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
            {/* Toggle Panel Button */}
            <button
                onClick={togglePanel}
                className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                aria-label={visiblePanel ? "Скрыть панель" : "Показать панель"}
            >
                {visiblePanel ? <FaTimes /> : <FaBars />}
            </button>

            {/* Current Location Button */}
            <div className="relative">
                <button
                    onClick={handleMyLocation}
                    className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    aria-label="Мое местоположение"
                >
                    <FaSearchLocation />
                </button>

                {showTooltip && (
                    <div className="absolute left-12 top-0 bg-white shadow-lg rounded-md p-2 text-sm w-48">
                        Запрос на получение местоположения отправлен
                    </div>
                )}
            </div>

            {/* Zoom Controls */}
            <button
                onClick={onZoomIn}
                className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Приблизить"
            >
                <FaPlus />
            </button>
            <button
                onClick={onZoomOut}
                className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Отдалить"
            >
                <FaMinus />
            </button>
        </div>
    );
};

export default MapControls;