import { Chat, Message } from "@/types/chatTypes";

const API_URL =
    process.env.NEXT_PUBLIC_ENV === "production"
        ? "https://nest-finder-diplom.vercel.app"
        : "http://localhost:3000";

/**
 * Получение списка чатов
 */
export async function fetchChats(): Promise<Chat[]> {
    try {
        const res = await fetch(`${API_URL}/api/chats`, {
            method: "GET",
            cache: "no-store",
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Ошибка при загрузке чатов");
        }

        const data: Chat[] = await res.json();
        return data.map((chat) => ({
            ...chat,
            createdAt: new Date(chat.createdAt),
            messages: chat.messages?.map((message) => ({
                ...message,
                sentAt: new Date(message.sentAt),
            })) || [],
        }));
    } catch (error) {
        console.error("Ошибка при запросе fetchChats:", error);
        throw error;
    }
}

/**
 * Получение данных о чате по ID
 * @param chatId ID чата
 * @returns Данные чата
 */
export async function fetchChatById(chatId: string): Promise<Chat | null> {
    if (!chatId) {
        throw new Error("ID чата обязателен");
    }

    try {
        const res = await fetch(`${API_URL}/api/chats/${chatId}`, {
            method: "GET",
            cache: "no-store",
            credentials: "include",
        });

        if (res.status === 404) {
            console.error(`Чат с ID ${chatId} не найден`);
            return null;
        }

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Ошибка при загрузке чата");
        }

        const data: Chat = await res.json();

        return {
            ...data,
            createdAt: new Date(data.createdAt),
            messages: data.messages.map((message) => ({
                ...message,
                sentAt: new Date(message.sentAt),
            })),
            users: data.users.map((user) => ({
                ...user,
                user: {
                    ...user.user,
                    image: user.user?.image || null,
                },
            })),
        };
    } catch (error) {
        console.error("Ошибка при запросе fetchChatById:", error);
        throw error;
    }
}


/**
 * Создание нового чата
 */
export async function createChat(currentUserId: string, recipientId: string): Promise<string> {
    try {
        const res = await fetch(`${API_URL}/api/chats`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipientId }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Ошибка при создании чата");
        }

        const { id } = await res.json();
        return id;
    } catch (error) {
        console.error("Ошибка при запросе createChat:", error);
        throw error;
    }
}


/**
 * Отправка сообщения в чат
 */
export async function sendMessage(chatId: string, userId: string, messageText: string): Promise<Message> {
    try {
        const res = await fetch(`${API_URL}/api/chats/${chatId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, messageText }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Ошибка при отправке сообщения");
        }

        return await res.json();
    } catch (error) {
        console.error("Ошибка при запросе sendMessage:", error);
        throw error;
    }
}

export async function markMessagesAsRead(chatId: string): Promise<void> {
    try {
        const res = await fetch(`/api/chats/${chatId}/read`, {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Ошибка при обновлении статуса сообщений");
        }
    } catch (error) {
        console.error("Ошибка при запросе markMessagesAsRead:", error);
        throw error;
    }
}
