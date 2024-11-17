'use client';

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Message } from "@/types/chatTypes";

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    const sentAt = message.sentAt instanceof Date ? message.sentAt : new Date(message.sentAt);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={clsx("flex mb-1", isOwn ? "justify-end" : "justify-start")}
        >
            <div
                className={clsx(
                    "relative px-3 py-2 rounded-xl max-w-[75%] text-sm shadow",
                    isOwn
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-gray-200 text-gray-800 rounded-tl-none"
                )}
            >
                <p className="break-words pr-8">{message.messageText}</p>
                <span
                    className={clsx(
                        "absolute bottom-1 right-3 text-[10px]",
                        isOwn ? "text-blue-200" : "text-gray-500"
                    )}
                >
                    {sentAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
            </div>
        </motion.div>
    );
}
