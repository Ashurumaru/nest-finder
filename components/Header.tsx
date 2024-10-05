"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

const Header = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [menuOpen, setMenuOpen] = useState(false); // Состояние для мобильного меню

  const handleSignOut = async () => {
    await signOut();
    // Дополнительно: перенаправление или обновление страницы
  };

  if (status === "loading") {
    return <p>Загрузка...</p>;
  }

  return (
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-8">
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
            </ul>

            {/* Действия пользователя */}
            <div className="flex items-center space-x-4">
              {user ? (
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="flex items-center">
                        <Image
                            src={user.image || "/images/default.png"}
                            alt={`Profile picture of ${user.name}`}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                      </Menu.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none z-50">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                                <Link
                                    href="/profile"
                                    className={`${
                                        active ? "bg-gray-100" : ""
                                    } flex items-center px-4 py-2 text-sm text-gray-700`}
                                >
                                  Профиль
                                </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                                <Link
                                    href="/properties/create"
                                    className={`${
                                        active ? "bg-gray-100" : ""
                                    } flex items-center px-4 py-2 text-sm text-gray-700`}
                                >
                                  Добавить недвижимость
                                </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleSignOut}
                                    className={`${
                                        active ? "bg-gray-100" : ""
                                    } w-full flex items-center px-4 py-2 text-sm text-red-600`}
                                >
                                  Выйти
                                </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
              ) : (
                  <>
                    <Link href="/properties/create">
                      <Button>+ Подать объявление</Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline">Войти</Button>
                    </Link>
                  </>
              )}
            </div>
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden">
            <button
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
              {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {menuOpen && (
            <div className="md:hidden">
              <div className="px-4 pt-2 pb-4 space-y-4 bg-white border-t border-gray-200">
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
                    <Link href="/sale"
                          className="block text-gray-700 hover"
                          onClick={() => setMenuOpen(false)}
                    >
                      Продажа
                    </Link>
                  </li>
                </ul>
                <div className="space-y-2">
                  {user ?
                      (
                          <>
                        <Link href="/profile">
                          <Button variant="outline"
                                  className="w-full"
                                  onClick={() => setMenuOpen(false)}>
                            Профиль
                          </Button>
                        </Link>
                        <Link href="/properties/create">
                          <Button className="w-full"
                                  onClick={() => setMenuOpen(false)}>
                            Добавить недвижимость
                          </Button>
                        </Link>
                        <Button variant="destructive"
                                className="w-full"
                                onClick={() => { setMenuOpen(false); handleSignOut(); }} >
                          Выйти
                        </Button>
                          </>
                      ) : (
                          <>
                            <Link href="/login">
                              <Button variant="outline"
                                      className="w-full"
                                      onClick={() => setMenuOpen(false)} >
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
