"use client";

import React from "react";
import { FaShareAlt } from "react-icons/fa";

export default function ShareButton({ title }: { title: string }) {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Посмотрите объект недвижимости: ${title}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Ссылка скопирована!");
        }
    };

    return (
        <button onClick={handleShare} className="text-blue-500 focus:outline-none">
            <FaShareAlt className="text-2xl" />
        </button>
    );
}
