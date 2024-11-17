'use client';

import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FiSend } from "react-icons/fi";

interface MessageInputProps {
    onSend: (text: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
    const [message, setMessage] = useState<string>("");
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleSend = () => {
        if (message.trim()) {
            onSend(message.trim());
            setMessage("");
            if (textAreaRef.current) {
                textAreaRef.current.style.height = "auto";
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };

    return (
        <div className="flex items-center gap-2 p-4 border-t bg-background">
            <Textarea
                ref={textAreaRef}
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Введите сообщение..."
                className="resize-none flex-grow max-h-32 overflow-hidden"
                rows={1}
            />
            <Button
                onClick={handleSend}
                variant="default"
                size="icon"
                aria-label="Отправить сообщение"
                className="ml-2"
                disabled={!message.trim()}
            >
                <FiSend
                    size={20}
                    className={message.trim() ? "text-blue-200" : "text-muted-foreground"}
                />
            </Button>
        </div>
    );
}
