import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyFormData } from '@/types/propertyTypes';

const Step5Review = () => {
    const { getValues } = useFormContext<PropertyFormData>();
    const data = getValues();

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Проверьте введенные данные</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default Step5Review;
