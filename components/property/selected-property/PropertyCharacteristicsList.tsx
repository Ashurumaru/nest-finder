import {PostData} from "@/types/propertyTypes";
import {TRANSLATIONS} from "@/constants/translations";
import {getTranslation} from "@/utils/extractText";
import {Icons} from "@/components/icons";

export function CharacteristicsList({ property }: { property: PostData }) {
    const renderCharacteristic = (
        icon: React.ReactNode,
        label: string,
        value: any,
        enumType?: keyof typeof TRANSLATIONS
    ) => {
        if (value === undefined || value === null || value === '') return null;
        const translatedValue = enumType ? getTranslation(enumType, value) : value;
        return (
            <Characteristic icon={icon} label={label} value={translatedValue} />
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {property.apartment && (
                <>
                    {renderCharacteristic(Icons.area, "Площадь", property.apartment.apartmentArea ? `${property.apartment.apartmentArea} м²` : null)}
                    {renderCharacteristic(Icons.bedrooms, "Комнат", property.apartment.numBedrooms)}
                    {renderCharacteristic(Icons.bathrooms, "Ванных комнат", property.apartment.numBathrooms)}
                    {renderCharacteristic(Icons.floor, "Этаж", property.apartment.floorNumber && property.apartment.totalFloors ? `${property.apartment.floorNumber} из ${property.apartment.totalFloors}` : null)}
                    {renderCharacteristic(Icons.balcony, "Балкон", property.apartment.hasBalcony ? "Да" : "Нет")}
                    {renderCharacteristic(Icons.loggia, "Лоджия", property.apartment.hasLoggia ? "Да" : "Нет")}
                    {renderCharacteristic(Icons.heating, "Тип отопления", property.apartment.heatingType, "HeatingType")}
                    {renderCharacteristic(Icons.internet, "Скорость интернета", property.apartment.internetSpeed ? `${property.apartment.internetSpeed} Мбит/с` : null)}
                    {renderCharacteristic(Icons.renovation, "Состояние ремонта", property.apartment.renovationState, "RenovationState")}
                    {renderCharacteristic(Icons.yearBuilt, "Год постройки", property.apartment.yearBuilt)}
                    {renderCharacteristic(Icons.parking, "Парковка", property.apartment.parkingType, "ParkingType")}
                </>
            )}

            {property.house && (
                <>
                    {renderCharacteristic(Icons.house, "Комнат", property.house.numberOfRooms)}
                    {renderCharacteristic(Icons.area, "Площадь дома", property.house.houseArea ? `${property.house.houseArea} м²` : null)}
                    {renderCharacteristic(Icons.garage, "Гараж", property.house.hasGarage ? "Да" : "Нет")}
                    {renderCharacteristic(Icons.fencing, "Ограждение", property.house.fencing ? "Да" : "Нет")}
                    {renderCharacteristic(Icons.heating, "Тип отопления", property.house.heatingType, "HeatingType")}
                    {renderCharacteristic(Icons.internet, "Скорость интернета", property.house.internetSpeed ? `${property.house.internetSpeed} Мбит/с` : null)}
                    {renderCharacteristic(Icons.yearBuilt, "Год постройки", property.house.yearBuilt)}
                    {renderCharacteristic(Icons.renovation, "Состояние ремонта", property.house.houseCondition, "RenovationState")}
                </>
            )}

            {property.landPlot && (
                <>
                    {renderCharacteristic(Icons.area, "Площадь участка", property.landPlot.landArea ? `${property.landPlot.landArea} м²` : null)}
                    {renderCharacteristic(Icons.fencing, "Ограждение", property.landPlot.fencing ? "Да" : "Нет")}
                    {renderCharacteristic(Icons.house, "Назначение участка", property.landPlot.landPurpose)}
                    {renderCharacteristic(Icons.heating, "Источник воды", property.landPlot.waterSource)}
                </>
            )}

            {property.rentalFeatures && (
                <>
                    {renderCharacteristic(Icons.petPolicy, "Домашние животные", property.rentalFeatures.petPolicy, "PetPolicy")}
                    {renderCharacteristic(Icons.yearBuilt, "Минимальный срок аренды", property.rentalFeatures.minimumLeaseTerm ? `${property.rentalFeatures.minimumLeaseTerm} месяцев` : null)}
                    {renderCharacteristic(Icons.yearBuilt, "Максимальный срок аренды", property.rentalFeatures.maximumLeaseTerm ? `${property.rentalFeatures.maximumLeaseTerm} месяцев` : null)}
                    {renderCharacteristic(Icons.heating, "Залог", property.rentalFeatures.securityDeposit ? `${property.rentalFeatures.securityDeposit.toLocaleString()} ₽` : null)}
                </>
            )}

            {property.saleFeatures && (
                <>
                    {renderCharacteristic(Icons.heating, "Ипотека доступна", property.saleFeatures.mortgageAvailable ? "Да" : "Нет")}
                    {renderCharacteristic(Icons.heating, "Цена договорная", property.saleFeatures.priceNegotiable ? "Да" : "Нет")}
                </>
            )}
        </div>
    );
}

function Characteristic({ icon, label, value }: { icon: React.ReactNode; label: string; value: any }) {
    return (
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="text-indigo-600">{icon}</div>
            <div>
                <span className="text-gray-500 text-sm">{label}:</span>
                <span className="ml-1 font-medium text-gray-800">{value}</span>
            </div>
        </div>
    );
}