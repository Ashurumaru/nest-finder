'use client';
import { DashboardNav } from '@/components/dashboard/layout/DashboardNav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft, Menu } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { useState } from 'react';
import { MobileSidebar } from './MobileSidebar';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggle = () => {
    toggle();
  };

  return (
      <>
        {/* Основной сайдбар для десктопов */}
        <aside
            className={cn(
                `relative hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
                !isMinimized ? 'w-72' : 'w-[72px]',
                className
            )}
        >
          <ChevronLeft
              className={cn(
                  'absolute -right-3 top-10 z-50 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
                  isMinimized && 'rotate-180'
              )}
              onClick={handleToggle}
          />
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div className="mt-3 space-y-1">
                <DashboardNav items={navItems} />
              </div>
            </div>
          </div>
        </aside>

        {/* Кнопка вызова мобильного меню */}
        <div className="md:hidden fixed bottom-5 right-5 z-50">
          <button
              onClick={() => setIsMobileOpen(true)}
              className="p-3 rounded-full bg-blue-500 text-white shadow-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Мобильная версия сайдбара */}
        {isMobileOpen && (
            <MobileSidebar isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />
        )}
      </>
  );
}
