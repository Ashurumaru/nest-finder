'use client';

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatUser } from "@/types/chatTypes";

interface ChatHeaderProps {
    chatId: string;
    users: ChatUser[] | null;
    currentUserId: string;
    isLoading?: boolean;
}

export default function ChatHeader({
                                       chatId,
                                       users,
                                       currentUserId,
                                       isLoading = false,
                                   }: ChatHeaderProps) {
    const otherUser = users?.find((user) => user.user.id !== currentUserId)?.user;

    return (
        <div className="flex items-center gap-4 px-4 py-3 bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="flex items-center gap-4">
                {isLoading ? (
                    <Skeleton className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-300 to-gray-100" />
                ) : otherUser?.image ? (
                    <img
                        src={otherUser.image}
                        alt={otherUser.name || "User"}
                        className="w-12 h-12 rounded-full object-cover shadow"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xl font-semibold">
                            {otherUser?.name?.[0]?.toUpperCase() || "?"}
                        </span>
                    </div>
                )}

                <div>
                    {isLoading ? (
                        <Skeleton className="h-5 w-32 bg-gradient-to-r from-gray-300 to-gray-100" />
                    ) : (
                        <p className="text-base font-semibold text-gray-800">
                            {otherUser?.name || `Чат #${chatId}`}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
