import { io, Socket } from "socket.io-client";

const BASE_URL =
    process.env.NEXT_PUBLIC_ENV === "production"
        ? "https://socket-server-5z1q.onrender.com"
        : "http://localhost:3001";

const socket: Socket = io(BASE_URL, {
    transports: ["websocket"], // Используйте только WebSocket
    autoConnect: false, // Подключение только при необходимости
    reconnection: true, // Повторное подключение при разрыве
    reconnectionAttempts: 10, // Количество попыток
    reconnectionDelay: 2000, // Задержка между попытками (мс)
    timeout: 10000, // Таймаут подключения
});

export default socket;
