'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { MenuIcon, XIcon, ChatIcon, HeartIcon } from '@heroicons/react/outline';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Type } from '@prisma/client';

const Header = () => {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (status === 'loading') {
    return (
        <header className="bg-background border-b border-border/40 shadow-sm">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="flex-shrink-0">
              <Skeleton className="h-8 w-8" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Skeleton className="h-6 w-24" />
            </div>
          </nav>
        </header>
    );
  }

  const isAdmin = session?.user?.role === 'ADMIN';

  return (
      <header className="bg-background border-b border-border/40 shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex items-center space-x-8">
              {session?.user && (
                  <>
                    <li>
                      <Link href="/chat" className="text-foreground/80 hover:text-foreground transition-colors" title="Чаты">
                        <ChatIcon className="w-5 h-5" />
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile#favorites" className="text-foreground/80 hover:text-foreground transition-colors" title="Избранное">
                        <HeartIcon className="w-5 h-5" />
                      </Link>
                    </li>
                  </>
              )}
              <li>
                <Link
                    href={`/properties?type=${Type.RENT}`}
                    className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  Аренда
                </Link>
              </li>
              <li>
                <Link
                    href={`/properties?type=${Type.SALE}`}
                    className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  Продажа
                </Link>
              </li>
            </ul>

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
                          <Link href="/profile" className="w-full">Профиль</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href="/profile#favorites" className="w-full">Избранное</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href="/properties/create" className="w-full">Добавить недвижимость</Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                            <DropdownMenuItem>
                              <Link href="/dashboard" className="w-full">Панель управления</Link>
                            </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        Выйти
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              ) : (
                  <>
                    <Link href="/properties/create">
                      <Button className="rounded-lg">+ Подать объявление</Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" className="rounded-lg">Войти</Button>
                    </Link>
                  </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
                className="text-foreground/80 hover:text-foreground focus:outline-none"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
              {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {menuOpen && (
            <div className="md:hidden transition-all duration-300 ease-in-out">
              <div className="px-4 pt-2 pb-4 space-y-4 bg-background border-t border-border/40">
                <ul className="space-y-2">
                  {session?.user && (
                      <>
                        <li>
                          <Link
                              href="/chat"
                              className="block text-foreground/80 hover:text-foreground transition-colors"
                              onClick={() => setMenuOpen(false)}
                          >
                            <ChatIcon className="w-4 h-4 mr-2 inline-block" />
                            Чат
                          </Link>
                        </li>
                        <li>
                          <Link
                              href="/profile#favorites"
                              className="block text-foreground/80 hover:text-foreground transition-colors"
                              onClick={() => setMenuOpen(false)}
                          >
                            <HeartIcon className="w-4 h-4 mr-2 inline-block" />
                            Избранное
                          </Link>
                        </li>
                      </>
                  )}
                  <li>
                    <Link
                        href={`/properties?type=${Type.RENT}`}
                        className="block text-foreground/80 hover:text-foreground transition-colors"
                        onClick={() => setMenuOpen(false)}
                    >
                      Аренда
                    </Link>
                  </li>
                  <li>
                    <Link
                        href={`/properties?type=${Type.SALE}`}
                        className="block text-foreground/80 hover:text-foreground transition-colors"
                        onClick={() => setMenuOpen(false)}
                    >
                      Продажа
                    </Link>
                  </li>
                  {isAdmin && (
                      <li>
                        <Link
                            href="/dashboard"
                            className="block text-foreground/80 hover:text-foreground transition-colors"
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
                              className="w-full rounded-lg"
                              onClick={() => setMenuOpen(false)}
                          >
                            Профиль
                          </Button>
                        </Link>
                        <Link href="/properties/create">
                          <Button
                              className="w-full rounded-lg"
                              onClick={() => setMenuOpen(false)}
                          >
                            Добавить недвижимость
                          </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            className="w-full rounded-lg"
                            onClick={() => {
                              setMenuOpen(false);
                              signOut();
                            }}
                        >
                          Выйти
                        </Button>
                      </>
                  ) : (
                      <>
                        <Link href="/properties/create">
                          <Button
                              className="w-full rounded-lg mb-2"
                              onClick={() => setMenuOpen(false)}
                          >
                            + Подать объявление
                          </Button>
                        </Link>
                        <Link href="/login">
                          <Button
                              variant="outline"
                              className="w-full rounded-lg"
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