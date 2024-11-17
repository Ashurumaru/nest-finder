'use client';

import React, { useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import socket from "@/utils/socket";
import { markMessagesAsRead } from "@/services/ChatService";
import { Message, ChatUser } from "@/types/chatTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChatWindowProps {
    chatId: string;
    messages: Message[];
    currentUserId: string;
    users: ChatUser[];
}

export default function ChatWindow({ chatId, messages: initialMessages, currentUserId, users }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        socket.connect();
        setIsConnected(true);
        socket.emit("joinChat", chatId);

        socket.on("newMessage", (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on("connect", () => setIsConnected(true));
        socket.on("disconnect", () => setIsConnected(false));

        return () => {
            socket.emit("leaveChat", chatId);
            socket.disconnect();
        };
    }, [chatId]);

    useEffect(() => {
        markMessagesAsRead(chatId)
            .then(() => setIsLoading(false))
            .catch(() => setIsLoading(false));
    }, [chatId]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (text: string) => {
        if (text.trim()) {
            const currentUser = users.find((user) => user.user.id === currentUserId)?.user;

            if (!currentUser) {
                console.error("Ошибка: информация о текущем пользователе недоступна");
                return;
            }

            socket.emit(
                "sendMessage",
                {
                    chatId,
                    userId: currentUserId,
                    message: text,
                    user: {
                        id: currentUser.id,
                        name: currentUser.name,
                        image: currentUser.image,
                    },
                },
                (response: { success: boolean; error?: string }) => {
                    if (!response.success) {
                        console.error("Ошибка отправки сообщения:", response.error);
                    }
                }
            );
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <ChatHeader chatId={chatId} users={users} currentUserId={currentUserId} />
            <div className="flex-grow max-h-[70vh] min-h-[70vh] overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                    <>
                        {[...Array(10)].map((_, i) => (
                            <Skeleton key={i} className="h-9 rounded-lg" />
                        ))}
                    </>
                ) : messages.length > 0 ? (
                    messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} isOwn={msg.userId === currentUserId} />
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Нет сообщений</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
                {!isConnected && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>
                            Соединение с сервером потеряно. Повторное подключение...
                        </AlertDescription>
                    </Alert>
                )}
            </div>
            <MessageInput onSend={handleSendMessage} />
        </div>
    );
}
