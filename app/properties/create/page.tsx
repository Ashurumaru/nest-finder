import React from 'react';
import CreatePropertyWizard from '@/components/create-property/CreatePropertyWizard';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CreatePropertyPage() {
    const session = await auth();

    if (!session?.user) {
        return redirect("/api/auth/signin");
    }
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Создать объявление</h1>
            <CreatePropertyWizard />
        </div>
    );
}
