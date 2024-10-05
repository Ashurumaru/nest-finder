"use client";

import React from 'react';
import CreatePropertyWizard from '@/components/CreateProperty/CreatePropertyWizard';

const CreatePropertyPage = () => {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Создать объявление</h1>
            <CreatePropertyWizard />
        </div>
    );
};

export default CreatePropertyPage;
