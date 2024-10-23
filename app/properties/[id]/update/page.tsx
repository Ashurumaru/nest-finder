import React from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreateUpdateProperty from "@/components/property/create-property/CreateUpdateProperty";
import {getPropertyById} from "@/utils/getPropertyById";

export default async function CreatePropertyPage() {
    const session = await auth();
    const propertyData = await getPropertyById("78d7b765-7c3f-44aa-9aac-1152f755ad81");

    if (!session?.user) {
        return redirect("/api/auth/signin");
    }
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Редактировать объявление</h1>
            <CreateUpdateProperty initialData={propertyData} />
        </div>
    );
}
