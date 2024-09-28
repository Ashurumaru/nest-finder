// components/Header.tsx

"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

const Header = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [menuOpen, setMenuOpen] = useState(false); // Состояние для мобильного меню

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

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Ссылки навигации */}
            <ul className="flex items-center space-x-8">
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
          </div>

          {/* Кнопка мобильного меню */}
          <div className="md:hidden">
            <button
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
              {menuOpen ? (
                  <XIcon className="h-6 w-6" />
              ) : (
                  <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Мобильное меню */}
        {menuOpen && (
            <div className="md:hidden">
              <div className="px-4 pt-2 pb-4 space-y-4 bg-white border-t border-gray-200">
                {/* Ссылки навигации */}
                <ul className="space-y-2">
                  <li>
                    <Link
                        href="/rent"
                        className="block text-gray-700 hover:text-blue-600"
                        onClick={() => setMenuOpen(false)}
                    >
                      Аренда
                    </Link>
                  </li>
                  <li>
                    <Link
                        href="/sale"
                        className="block text-gray-700 hover:text-blue-600"
                        onClick={() => setMenuOpen(false)}
                    >
                      Продажа
                    </Link>
                  </li>
                  {/* Дополнительные ссылки */}
                </ul>

                {/* Действия пользователя */}
                <div className="space-y-2">
                  {user ? (
                      <>
                        <Link href="/profile">
                          <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setMenuOpen(false)}
                          >
                            Профиль
                          </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => {
                              setMenuOpen(false);
                              handleSignOut();
                            }}
                        >
                          Выйти
                        </Button>
                      </>
                  ) : (
                      <>
                        <Link href="/post-ad">
                          <Button
                              className="w-full"
                              onClick={() => setMenuOpen(false)}
                          >
                            + Подать объявление
                          </Button>
                        </Link>
                        <Link href="/login">
                          <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setMenuOpen(false)}
                          >
                            Войти
                          </Button>
                        </Link>
                      </>
                  )}
                </div>
              </div>
            </div>
        )}
      </header>
  );
};

export default Header;
