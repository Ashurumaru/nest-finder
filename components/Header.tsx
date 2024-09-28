// components/Header.tsx

"use client";

import { auth, signOut } from "@/auth";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { User } from "next-auth"; // Импортируем тип User из next-auth

const Header = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Клиентский запрос для получения сессии
    const fetchSession = async () => {
      const session = await auth();
      setUser(session?.user ?? null);
    };
    fetchSession();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    // Дополнительно: перенаправление или обновление страницы
  };

  return (
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Логотип */}
          <Link href="/">
            <Logo />
          </Link>

          {/* Ссылки навигации */}
          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <Link href="/rent" className="text-gray-700 hover:text-blue-600">
                Аренда
              </Link>
            </li>
            <li>
              <Link href="/sale" className="text-gray-700 hover:text-blue-600">
                Продажа
              </Link>
            </li>
            {/* Дополнительные ссылки */}
          </ul>

          {/* Действия пользователя */}
          <div className="flex items-center space-x-4">
            {user ? (
                <>
                  <Link href="/profile">
                    <Button variant="outline">Профиль</Button>
                  </Link>
                  <Button variant="destructive" onClick={handleSignOut}>
                    Выйти
                  </Button>
                </>
            ) : (
                <>
                  <Link href="/post-ad">
                    <Button>+ Подать объявление</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline">Войти</Button>
                  </Link>
                </>
            )}
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden">
            {/* Здесь можно добавить иконку меню для мобильных устройств */}
          </div>
        </nav>
      </header>
  );
};

export default Header;
