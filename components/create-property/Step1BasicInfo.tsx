import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import CustomCombobox from '@/components/ui/CustomCombobox';
import { PropertyFormData } from '@/types/propertyTypes';
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

const Step1BasicInfo = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext<PropertyFormData>();

    const typeOptions = [
        { value: 'sale', label: 'Продажа' },
        { value: 'rent', label: 'Аренда' },
    ];

    const propertyOptions = [
        { value: 'apartment', label: 'Квартира' },
        { value: 'house', label: 'Дом' },
        { value: 'condo', label: 'Кондо' },
        { value: 'townhouse', label: 'Таунхаус' },
        { value: 'commercial', label: 'Коммерческая недвижимость' },
        { value: 'land', label: 'Земля' },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Основная информация</h2>

            <div className="mb-4">
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <CustomCombobox
                            value={field.value}
                            onChange={field.onChange}
                            options={typeOptions}
                            placeholder="Тип сделки"
                        />
                    )}
                />
                {errors.type?.message && (
                    <p className="text-red-500">{errors.type.message}</p>
                )}
            </div>

            <div className="mb-4">
                <Controller
                    name="property"
                    control={control}
                    render={({ field }) => (
                        <CustomCombobox
                            value={field.value}
                            onChange={field.onChange}
                            options={propertyOptions}
                            placeholder="Тип недвижимости"
                        />
                    )}
                />
                {errors.property?.message && (
                    <p className="text-red-500">{errors.property.message}</p>
                )}
            </div>

            <div className="mb-4">
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Заголовок" />
                    )}
                />
                {errors.title?.message && (
                    <p className="text-red-500">{errors.title.message}</p>
                )}
            </div>

            <div className="mb-4">
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Textarea {...field} placeholder="Описание" />
                    )}
                />
                {errors.description?.message && (
                    <p className="text-red-500">{errors.description.message}</p>
                )}
            </div>
        </div>
    );
};

export default Step1BasicInfo;
