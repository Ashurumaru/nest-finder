import React from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreateUpdateProperty from "@/components/property/create-property/CreateUpdateProperty";

export default async function CreatePropertyPage() {
    const session = await auth();

    if (!session?.user) {
        return redirect("/api/auth/signin");
    }
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Создать объявление</h1>
            <CreateUpdateProperty />
        </div>
    );
}
