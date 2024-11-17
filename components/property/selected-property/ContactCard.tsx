'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createChat } from "@/services/ChatService";

interface ContactCardProps {
    currentUserId: string; // Текущий пользователь
    recipientId: string; // Пользователь из объявления
    recipientName: string;
    recipientEmail?: string | null;
    recipientPhone?: string | null;
    recipientImage?: string | null;
}

export default function ContactCard({
                                        currentUserId,
                                        recipientId,
                                        recipientName,
                                        recipientEmail,
                                        recipientPhone,
                                        recipientImage,
                                    }: ContactCardProps) {
    const router = useRouter();

    const handleCreateChat = async () => {
        try {
            const chatId = await createChat(currentUserId, recipientId); // Передаём текущего пользователя и получателя
            router.push(`/chat/${chatId}`);
        } catch (error) {
            console.error("Ошибка при создании чата:", error);
            alert("Не удалось создать чат. Попробуйте снова.");
        }
    };

    return (
        <div className="bg-white p-6 shadow-md rounded-lg">
            <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={recipientImage || "/images/default.png"} alt={recipientName} />
                    <AvatarFallback>{recipientName[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium text-lg text-gray-900">{recipientName}</p>
                    {recipientEmail && <p className="text-sm text-gray-500">{recipientEmail}</p>}
                    {recipientPhone && <p className="text-sm text-gray-500">{recipientPhone}</p>}
                </div>
            </div>
            <Button onClick={handleCreateChat} className="w-full bg-blue-600 hover:bg-blue-700">
                Написать сообщение
            </Button>
        </div>
    );
}
