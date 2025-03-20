//components/property/selected-property/ContactCard.tsx
'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { createChat } from "@/services/ChatService";
import { FaEnvelope, FaPhone } from "react-icons/fa";

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
    const [isLoading, setIsLoading] = React.useState(false);

    const handleCreateChat = async () => {
        try {
            setIsLoading(true);
            const chatId = await createChat(currentUserId, recipientId);
            router.push(`/chat/${chatId}`);
        } catch (error) {
            console.error("Ошибка при создании чата:", error);
            alert("Не удалось создать чат. Попробуйте снова.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="overflow-hidden border border-indigo-100">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                <h3 className="font-semibold text-lg">Связаться с владельцем</h3>
            </div>
            <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-14 w-14 border-2 border-indigo-100">
                        <AvatarImage src={recipientImage || "/images/default.png"} alt={recipientName} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600 font-medium">
                            {recipientName.split(' ').map(name => name[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-lg text-gray-900">{recipientName}</p>
                        {(recipientEmail || recipientPhone) && (
                            <div className="space-y-1 mt-1">
                                {recipientEmail && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaEnvelope className="mr-2 text-indigo-500" />
                                        <span>{recipientEmail}</span>
                                    </div>
                                )}
                                {recipientPhone && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaPhone className="mr-2 text-indigo-500" />
                                        <span>{recipientPhone}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <Button
                    onClick={handleCreateChat}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    {isLoading ? "Загрузка..." : "Написать сообщение"}
                </Button>
            </CardContent>
        </Card>
    );
}