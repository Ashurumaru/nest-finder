import { User} from "@prisma/client";

export interface Message {
    id: string;
    messageText: string;
    userId: string;
    sentAt: Date;
    read: boolean;
    user: User;
}

export interface ChatUser {
    user: User;
}

export interface Chat {
    id: string;
    createdAt: Date;
    messages: Message[];
    users: ChatUser[];
    unreadCount: number;
}
