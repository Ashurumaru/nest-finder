import React from 'react';
import { Metadata } from 'next';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreateUpdateProperty from "@/components/property/create-property/CreateUpdateProperty";
import { Heading } from '@/components/ui/heading';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HomeIcon } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';

export const metadata: Metadata = {
    title: 'Создать объявление о недвижимости',
    description: 'Создайте новое объявление о продаже или аренде недвижимости',
};

export default async function CreatePropertyPage() {
    const session = await auth();

    if (!session?.user) {
        return redirect("/api/auth/signin?callbackUrl=/property/create");
    }

    return (
        <div className="container py-6 space-y-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <HomeIcon className="h-6 w-6" />
                    <Heading
                        title="Создать объявление"
                        description="Заполните форму для создания нового объявления о недвижимости"
                    />
                </div>
            </div>

            <Separator />

            <Card>
                <CardContent className="pt-6">
                    <CreateUpdateProperty />
                </CardContent>
            </Card>
        </div>
    );
}