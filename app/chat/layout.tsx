'use client';

import React, { useEffect, useState } from "react";
import ChatList from "@/components/chat/ChatList";
import { useSession } from "next-auth/react";
import { Chat } from "@/types/chatTypes";
import { fetchChats } from "@/services/ChatService";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const loadChats = async () => {
            if (status === "authenticated" && session?.user?.id) {
                try {
                    const data = await fetchChats();
                    setChats(data);
                } catch (err: any) {
                    setError(err.message || "Ошибка загрузки чатов");
                } finally {
                    setLoading(false);
                }
            }
        };

        loadChats();
    }, [status, session]);

    if (status === "loading" || loading) {
        return (
            <div className="flex h-full">
                <aside className="w-full sm:w-1/4 p-4 bg-gray-100 border-r flex flex-col">
                    <div className="flex items-center mb-6">
                        <Skeleton className="h-10 w-full sm:w-3/4 rounded-lg" />
                    </div>
                    <div className="space-y-4">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <Skeleton className="h-6 w-2/3 rounded-lg" />
                            </div>
                        ))}
                    </div>
                </aside>
                <main className="flex-grow flex items-center justify-center bg-gray-50">

                </main>
            </div>
        );
    }

    if (status !== "authenticated" || !session?.user?.id) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <Alert variant="destructive" className="w-3/4 max-w-md">
                    <AlertTitle>Ошибка авторизации</AlertTitle>
                    <AlertDescription>
                        Пожалуйста, войдите в систему для продолжения.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <Alert variant="destructive" className="w-3/4 max-w-md">
                    <AlertTitle>Ошибка загрузки</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    const filteredChats = chats.filter((chat) =>
        chat.users.some((u) =>
            u.user.name?.toLowerCase().includes(search.toLowerCase())
        )
    );

    const currentUserId = session.user.id;

    return (
        <div className="flex flex-col sm:flex-row h-full bg-gray-100">
            <aside className="w-full sm:w-1/4 bg-white border-r flex flex-col">
                <div className="p-4">
                    <Input
                        placeholder="Поиск чатов..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex-grow overflow-y-auto">
                    <ChatList chats={filteredChats} currentUserId={currentUserId} isLoading={false} />
                </div>
            </aside>
            <main className="flex-grow bg-gray-50">{children}</main>
        </div>
    );
}
