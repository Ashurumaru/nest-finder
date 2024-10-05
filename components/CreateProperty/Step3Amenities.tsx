import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { PropertyFormData } from '@/types/propertyTypes';
import { Checkbox } from '@/components/ui/checkbox';
import CustomCombobox from '@/components/ui/CustomCombobox';
import {Input} from "@/components/ui/input";

const Step3Amenities = () => {
    const {
        control,
        watch,
        formState: { errors },
    } = useFormContext<PropertyFormData>();
    const transactionType = watch('type');

    const leaseTermOptions = [
        { value: 'monthToMonth', label: 'Месяц к месяцу' },
        { value: 'sixMonths', label: '6 месяцев' },
        { value: 'oneYear', label: '1 год' },
        { value: 'twoYears', label: '2 года' },
        { value: 'other', label: 'Другой' },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Удобства и особенности</h2>

            <div className="mb-4">
                <Controller
                    name="furnished"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="furnished"
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                            />
                            <label htmlFor="furnished" className="text-sm font-medium">
                                Меблированная
                            </label>
                        </div>
                    )}
                />
            </div>

            <div className="mb-4">
                <Controller
                    name="airConditioning"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="airConditioning"
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                            />
                            <label htmlFor="airConditioning" className="text-sm font-medium">
                                Кондиционер
                            </label>
                        </div>
                    )}
                />
            </div>

            <div className="mb-4">
                <Controller
                    name="balcony"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="balcony"
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                            />
                            <label htmlFor="balcony" className="text-sm font-medium">
                                Балкон/Терраса
                            </label>
                        </div>
                    )}
                />
            </div>

            {transactionType === 'rent' && (
                <>
                    <div className="mb-4">
                        <Controller
                            name="moveInDate"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} type="date" placeholder="Дата заселения" />
                            )}
                        />
                        {errors.moveInDate?.message && (
                            <p className="text-red-500">{errors.moveInDate.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <Controller
                            name="leaseTerm"
                            control={control}
                            render={({ field }) => (
                                <CustomCombobox
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    options={leaseTermOptions}
                                    placeholder="Срок аренды"
                                />
                            )}
                        />
                        {errors.leaseTerm?.message && (
                            <p className="text-red-500">{errors.leaseTerm.message}</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Step3Amenities;
