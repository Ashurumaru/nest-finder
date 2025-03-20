//components/property/selected-property/FavoriteButton.tsx
"use client";

import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function FavoriteButton({ isFavorite, id }: { isFavorite: boolean, id: string }) {
    const [favorite, setFavorite] = useState(isFavorite);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleFavoriteToggle = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/auth/check-session', { method: 'GET' });
            const session = await res.json();

            if (!session?.user) {
                router.push('/api/auth/signin');
                return;
            }

            if (favorite) {
                await fetch(`/api/saved-properties/${id}`, { method: "DELETE" });
                setFavorite(false);
            } else {
                await fetch(`/api/saved-properties/${id}`, { method: "POST" });
                setFavorite(true);
            }
        } catch (error) {
            console.error("Ошибка при добавлении/удалении из избранного:", error);
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