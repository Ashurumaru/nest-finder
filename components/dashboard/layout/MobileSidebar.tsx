'use client';
import { DashboardNav } from '@/components/dashboard/layout/DashboardNav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { navItems } from '@/constants/data';
import { Menu } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function MobileSidebar({ isOpen, setIsOpen }: MobileSidebarProps) {
  return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Меню
              </h2>
              <div className="space-y-1">
                <DashboardNav items={navItems} isMobileNav={true} setOpen={setIsOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
  );
}
