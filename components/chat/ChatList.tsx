'use client';

import React from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Chat } from "@/types/chatTypes";

interface ChatListProps {
    chats: Chat[];
    currentUserId: string;
    isLoading?: boolean;
}

export default function ChatList({ chats, currentUserId, isLoading = false }: ChatListProps) {
    if (isLoading) {
        return (
            <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex flex-col flex-grow">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            {chats.map((chat) => {
                const otherUser = chat.users.find((u) => u.user.id !== currentUserId)?.user;

                const sortedMessages = [...chat.messages].sort(
                    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
                );
                const lastMessageObj = sortedMessages[sortedMessages.length - 1];
                let lastMessage =
                    lastMessageObj && lastMessageObj.userId === currentUserId
                        ? `Вы: ${lastMessageObj.messageText}`
                        : lastMessageObj?.messageText || "Нет сообщений";

                const maxLength = 20;
                lastMessage = lastMessage.length > maxLength
                    ? `${lastMessage.slice(0, maxLength)}...`
                    : lastMessage;

                const lastMessageTime =
                    lastMessageObj
                        ? new Date(lastMessageObj.sentAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : null;

                return (
                    <Link
                        key={chat.id}
                        href={`/chat/${chat.id}`}
                        className="block rounded-lg bg-white shadow-sm hover:shadow-md p-4 transition-shadow border border-gray-200 flex items-center gap-4"
                    >
                        {otherUser?.image ? (
                            <img
                                src={otherUser.image}
                                alt={otherUser?.name || "Неизвестный пользователь"}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xl font-semibold">
                                    {otherUser?.name?.[0]?.toUpperCase() || "?"}
                                </span>
                            </div>
                        )}

                        <div className="flex flex-col flex-grow">
                            <p className="font-medium text-gray-900 truncate">
                                {otherUser?.name || "Неизвестный пользователь"}
                            </p>
                            <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            {lastMessageTime && (
                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {lastMessageTime}
                                </span>
                            )}
                            {chat.unreadCount > 0 && (
                                <Badge variant="secondary" className="mt-1">
                                    {chat.unreadCount}
                                </Badge>
                            )}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
