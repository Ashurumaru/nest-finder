import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ChatWindow from "@/components/chat/ChatWindow";
import { fetchChatById } from "@/services/ChatService";

export default async function ChatPage({ params }: { params: { id: string } }) {
    const session = await auth();

    if (!session?.user) {
        return redirect("/api/auth/signin");
    }

    const chatId = params.id;

    try {
        const chat = await fetchChatById(chatId);

        if (!chat) {
            return (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Чат не найден</p>
                </div>
            );
        }

        return (
            <ChatWindow
                chatId={chatId}
                messages={chat.messages}
                currentUserId={session.user.id}
                users={chat.users}
            />
        );
    } catch (error) {
        console.error("Ошибка загрузки чата:", error);
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Ошибка при загрузке чата</p>
            </div>
        );
    }
}
