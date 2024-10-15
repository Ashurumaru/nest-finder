"use client";

import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ isFavorite, id }: { isFavorite: boolean, id: string }) {
    const [favorite, setFavorite] = useState(isFavorite);
    const router = useRouter();

    const handleFavoriteToggle = async () => {
        try {
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
        }
    };

    return (
        <button onClick={handleFavoriteToggle} className="text-red-500 focus:outline-none">
            {favorite ? <FaHeart className="text-2xl" /> : <FaHeart className="text-2xl text-gray-400" />}
        </button>
    );
}
