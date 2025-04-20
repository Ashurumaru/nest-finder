import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaPlus, FaMinus, FaCrosshairs, FaCompass, FaLock, FaUnlock, FaExclamationCircle } from "react-icons/fa";

interface MapControlsProps {
    visiblePanel: boolean;
    togglePanel: () => void;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onMyLocation?: () => void;
    onResetView?: () => void;
    lockMap?: boolean;
    toggleLockMap?: () => void;
    zoom?: number;
    maxZoom?: number;
    minZoom?: number;
}

const MapControls = ({
                         visiblePanel,
                         togglePanel,
                         onZoomIn,
                         onZoomOut,
                         onMyLocation,
                         onResetView,
                         lockMap = false,
                         toggleLockMap,
                         zoom = 10,
                         maxZoom = 19,
                         minZoom = 3
                     }: MapControlsProps) => {
    const [tooltip, setTooltip] = useState<{message: string, type?: 'info' | 'error'} | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);

    useEffect(() => {
        return () => {
            setLocationLoading(false);
        };
    }, []);

    const handleMyLocation = () => {
        if (locationLoading) return;

        setLocationLoading(true);

        if (onMyLocation) {
            onMyLocation();
            setTimeout(() => setLocationLoading(false), 3000);
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocationLoading(false);
                    showTooltipMessage("Местоположение определено", "info");
                },
                (error) => {
                    setLocationLoading(false);
                    showTooltipMessage("Не удалось получить местоположение", "error");
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        } else {
            setLocationLoading(false);
            showTooltipMessage("Геолокация не поддерживается", "error");
        }
    };

    const showTooltipMessage = (message: string, type: 'info' | 'error' = 'info') => {
        setTooltip({ message, type });
        setTimeout(() => setTooltip(null), 3000);
    };

    const handleZoomIn = () => {
        if (zoom < maxZoom && onZoomIn) {
            onZoomIn();
        }
    };

    const handleZoomOut = () => {
        if (zoom > minZoom && onZoomOut) {
            onZoomOut();
        }
    };

    return (
        <>
            <div className="absolute top-4 left-4 z-10">
                <button
                    onClick={togglePanel}
                    className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={visiblePanel ? "Скрыть панель" : "Показать панель"}
                    onMouseEnter={() => setTooltip({message: visiblePanel ? "Скрыть панель" : "Показать панель"})}
                    onMouseLeave={() => setTooltip(null)}
                >
                    {visiblePanel ? <FaTimes className="text-gray-700" /> : <FaBars className="text-gray-700" />}
                </button>
            </div>

            <div className="absolute top-4 left-20 z-10">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="border-b border-gray-200">
                        <button
                            onClick={handleZoomIn}
                            disabled={zoom >= maxZoom}
                            className={`p-3 w-full flex justify-center hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 ${zoom >= maxZoom ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-label="Увеличить масштаб"
                            onMouseEnter={() => setTooltip({message: "Увеличить масштаб"})}
                            onMouseLeave={() => setTooltip(null)}
                        >
                            <FaPlus className="text-gray-700" />
                        </button>

                        <button
                            onClick={handleZoomOut}
                            disabled={zoom <= minZoom}
                            className={`p-3 w-full flex justify-center hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 ${zoom <= minZoom ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-label="Уменьшить масштаб"
                            onMouseEnter={() => setTooltip({message: "Уменьшить масштаб"})}
                            onMouseLeave={() => setTooltip(null)}
                        >
                            <FaMinus className="text-gray-700" />
                        </button>
                    </div>

                    <div className="border-b border-gray-200">
                        <button
                            onClick={handleMyLocation}
                            className={`p-3 w-full flex justify-center hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 ${locationLoading ? 'bg-gray-100' : ''}`}
                            aria-label="Мое местоположение"
                            disabled={locationLoading}
                            onMouseEnter={() => setTooltip({message: "Мое местоположение"})}
                            onMouseLeave={() => setTooltip(null)}
                        >
                            <FaCrosshairs className={`${locationLoading ? 'animate-pulse' : ''} text-gray-700`} />
                        </button>
                    </div>

                    <div className="border-b border-gray-200">
                        <button
                            onClick={onResetView}
                            className="p-3 w-full flex justify-center hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                            aria-label="Сбросить вид"
                            onMouseEnter={() => setTooltip({message: "Сбросить вид"})}
                            onMouseLeave={() => setTooltip(null)}
                        >
                            <FaCompass className="text-gray-700" />
                        </button>
                    </div>

                    {toggleLockMap && (
                        <div>
                            <button
                                onClick={toggleLockMap}
                                className="p-3 w-full flex justify-center hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                                aria-label={lockMap ? "Разблокировать карту" : "Заблокировать карту"}
                                onMouseEnter={() => setTooltip({message: lockMap ? "Разблокировать карту" : "Заблокировать карту"})}
                                onMouseLeave={() => setTooltip(null)}
                            >
                                {lockMap ? <FaUnlock className="text-gray-700" /> : <FaLock className="text-gray-700" />}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div className="absolute top-20 left-4 z-20 bg-white px-3 py-2 rounded-md shadow-lg text-sm whitespace-nowrap transition-opacity duration-300">
                    {tooltip.type === 'error' && <FaExclamationCircle className="inline-block mr-1 text-red-500" />}
                    {tooltip.message}
                </div>
            )}
        </>
    );
};

export default MapControls;