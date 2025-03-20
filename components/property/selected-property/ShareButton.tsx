//components/property/selected-property/ShareButton.tsx
"use client";

import React, { useState } from "react";
import { FaShareAlt } from "react-icons/fa";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ShareButton({ title }: { title: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Посмотрите объект недвижимости: ${title}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error("Ошибка при попытке поделиться:", error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (error) {
                console.error("Ошибка при копировании ссылки:", error);
            }
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors focus:outline-none focus:ring focus:ring-indigo-300"
                        aria-label="Поделиться"
                    >
                        <FaShareAlt className="text-lg" />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{copied ? "Ссылка скопирована!" : "Поделиться"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}