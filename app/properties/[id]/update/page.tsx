import React from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreateUpdateProperty from "@/components/property/create-property/CreateUpdateProperty";
import {fetchProperty, fetchPropertyData} from "@/services/propertyService";


export default async function UpdatePropertyPage({ params }: { params: { id: string } }) {
    const session = await auth();

    if (!session?.user) {
        return redirect("/api/auth/signin");
    }

    const property = await fetchPropertyData(params.id);

    if (!property) {
        return <div>Объявление не найдено</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Редактировать объявление</h1>
            <CreateUpdateProperty initialData={property} />
        </div>
    );
}
