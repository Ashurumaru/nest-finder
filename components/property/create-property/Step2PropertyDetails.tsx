import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import CustomCombobox from '@/components/ui/CustomCombobox';
import { PropertyFormData } from '@/types/propertyTypes';
import {Checkbox} from "@/components/ui/checkbox";

const Step2PropertyDetails = () => {
    const {
        control,
        watch,
        formState: { errors },
        setValue,
    } = useFormContext<PropertyFormData>();

    const propertyType = watch('property');
    const parkingAvailable = watch('parking');

    const heatingOptions = [
        { value: 'none', label: 'Нет' },
        { value: 'gas', label: 'Газовое' },
        { value: 'electric', label: 'Электрическое' },
        { value: 'solar', label: 'Солнечное' },
        { value: 'other', label: 'Другое' },
    ];

    const parkingTypeOptions = [
        { value: 'garage', label: 'Гараж' },
        { value: 'street', label: 'Уличная' },
        { value: 'assigned', label: 'Закрепленная' },
        { value: 'covered', label: 'Под навесом' },
        { value: 'valet', label: 'Служба парковки' },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Детали недвижимости</h2>

            <div className="mb-4">
                <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Цена" type="number" />
                    )}
                />
                {errors.price?.message && (
                    <p className="text-red-500">{errors.price.message}</p>
                )}
            </div>

            <div className="mb-4">
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Адрес" />
                    )}
                />
                {errors.address?.message && (
                    <p className="text-red-500">{errors.address.message}</p>
                )}
            </div>

            <div className="mb-4">
                <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Город" />
                    )}
                />
                {errors.city?.message && (
                    <p className="text-red-500">{errors.city.message}</p>
                )}
            </div>

            {propertyType !== 'LAND_PLOT' && (
                <>
                    <div className="mb-4">
                        <Controller
                            name="numBedrooms"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Количество спален"
                                    type="number"
                                />
                            )}
                        />
                        {errors.numBedrooms?.message && (
                            <p className="text-red-500">{errors.numBedrooms.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <Controller
                            name="numBathrooms"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Количество ванных комнат"
                                    type="number"
                                />
                            )}
                        />
                        {errors.numBathrooms?.message && (
                            <p className="text-red-500">{errors.numBathrooms.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <Controller
                            name="heatingType"
                            control={control}
                            render={({ field }) => (
                                <CustomCombobox
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    options={heatingOptions}
                                    placeholder="Тип отопления"
                                />
                            )}
                        />
                        {errors.heatingType?.message && (
                            <p className="text-red-500">{String(errors.heatingType.message)}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <Controller
                            name="parking"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="parking"
                                        checked={field.value || false}
                                        onCheckedChange={(value) => {
                                            field.onChange(value);
                                            if (!value) {
                                                setValue('parkingType', '');
                                            }
                                        }}
                                    />
                                    <label htmlFor="parking" className="text-sm font-medium">
                                        Есть парковка
                                    </label>
                                </div>
                            )}
                        />
                    </div>

                    {parkingAvailable && (
                        <div className="mb-4">
                            <Controller
                                name="parkingType"
                                control={control}
                                render={({ field }) => (
                                    <CustomCombobox
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        options={parkingTypeOptions}
                                        placeholder="Тип парковки"
                                    />
                                )}
                            />
                            {errors.parkingType?.message && (
                                <p className="text-red-500">{String(errors.parkingType.message)}</p>
                            )}
                        </div>
                    )}
                </>
            )}

            {propertyType === 'APARTMENT' && (
                <>
                    <div className="mb-4">
                        <Controller
                            name="floorNumber"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Этаж" type="number" />
                            )}
                        />
                    </div>

                    <div className="mb-4">
                        <Controller
                            name="totalFloors"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Всего этажей" type="number" />
                            )}
                        />
                    </div>

                    <div className="mb-4">
                        <Controller
                            name="hasElevator"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="hasElevator"
                                        checked={field.value || false}
                                        onCheckedChange={field.onChange}
                                    />
                                    <label htmlFor="hasElevator" className="text-sm font-medium">
                                        Есть лифт
                                    </label>
                                </div>
                            )}
                        />
                    </div>
                </>
            )}

            {/* Удаляем карту и поля для координат */}

            <div className="mb-4">
                <Controller
                    name="latitude"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Широта" type="number" />
                    )}
                />
                {errors.latitude?.message && (
                    <p className="text-red-500">{errors.latitude.message}</p>
                )}
            </div>

            <div className="mb-4">
                <Controller
                    name="longitude"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Долгота" type="number" />
                    )}
                />
                {errors.longitude?.message && (
                    <p className="text-red-500">{errors.longitude.message}</p>
                )}
            </div>
        </div>
    );
};

export default Step2PropertyDetails;
