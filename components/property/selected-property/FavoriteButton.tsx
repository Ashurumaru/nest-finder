// components/property/selected-property/FavoriteButton.tsx
"use client";

import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {useToast} from "@/hooks/useToast";

export default function FavoriteButton({ isFavorite, id }: { isFavorite: boolean, id: string }) {
    const [favorite, setFavorite] = useState(isFavorite);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleFavoriteToggle = async () => {
        try {
            setIsLoading(true);

            // Проверяем авторизацию пользователя
            const sessionRes = await fetch('/api/auth/check-session', { method: 'GET' });

            if (!sessionRes.ok) {
                router.push('/login');
                return;
            }

            const session = await sessionRes.json();

            if (!session?.user) {
                router.push('/login');
                return;
            }

            if (favorite) {
                // Удаляем из избранного
                const response = await fetch(`/api/saved-properties/${id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    setFavorite(false);
                    toast({
                        title: "Удалено из избранного",
                        description: "Объект успешно удален из избранного",
                    });
                    router.refresh(); // Обновляем страницу для актуализации данных
                } else {
                    throw new Error("Failed to remove from favorites");
                }
            } else {
                // Добавляем в избранное
                const response = await fetch(`/api/saved-properties/${id}`, {
                    method: "POST",
                });

                if (response.ok) {
                    setFavorite(true);
                    toast({
                        title: "Добавлено в избранное",
                        description: "Объект успешно добавлен в избранное",
                    });
                    router.refresh(); // Обновляем страницу для актуализации данных
                } else {
                    throw new Error("Failed to add to favorites");
                }
            }
        } catch (error) {
            console.error("Ошибка при добавлении/удалении из избранного:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось выполнить операцию. Пожалуйста, попробуйте еще раз.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={handleFavoriteToggle}
                        disabled={isLoading}
                        className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full transition-all focus:outline-none focus:ring",
                            favorite
                                ? "bg-red-100 text-red-500 hover:bg-red-200 focus:ring-red-300"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:ring-gray-300"
                        )}
                        aria-label={favorite ? "Удалить из избранного" : "Добавить в избранное"}
                    >
                        <FaHeart className={cn("text-lg", isLoading && "animate-pulse")} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{favorite ? "Удалить из избранного" : "Добавить в избранное"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}