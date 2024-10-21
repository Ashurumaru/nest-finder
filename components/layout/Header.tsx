'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import Logo from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (status === 'loading') {
    return <p>Загрузка...</p>;
  }

  const isAdmin = session?.user?.role === 'ADMIN';

  return (
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/public">
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
              {session?.user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                              src={session.user?.image ?? '/images/default.png'}
                              alt={session.user?.name ?? 'User'}
                          />
                          <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {session.user?.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {session.user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Link href="/profile">Профиль</Link>
                          <DropdownMenuShortcut></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href="/properties/create">Добавить недвижимость</Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                            <DropdownMenuItem>
                              <Link href="/dashboard">Панель управления</Link>
                            </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        Выйти
                        <DropdownMenuShortcut></DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                    <Link
                        href="/sale"
                        className="block text-gray-700 hover:text-blue-600"
                        onClick={() => setMenuOpen(false)}
                    >
                      Продажа
                    </Link>
                  </li>
                  {isAdmin && (
                      <li>
                        <Link
                            href="/dashboard"
                            className="block text-gray-700 hover:text-blue-600"
                            onClick={() => setMenuOpen(false)}
                        >
                          Панель управления
                        </Link>
                      </li>
                  )}
                </ul>
                <div className="space-y-2">
                  {session?.user ? (
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
                        <Link href="/properties/create">
                          <Button
                              className="w-full"
                              onClick={() => setMenuOpen(false)}
                          >
                            Добавить недвижимость
                          </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => {
                              setMenuOpen(false);
                              signOut();
                            }}
                        >
                          Выйти
                        </Button>
                      </>
                  ) : (
                      <Link href="/login">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setMenuOpen(false)}
                        >
                          Войти
                        </Button>
                      </Link>
                  )}
                </div>
              </div>
            </div>
        )}
      </header>
  );
};

export default Header;
