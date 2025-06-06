'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { NavIcons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/navTypes';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
                               items,
                               setOpen,
                               isMobileNav = false
                             }: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();

  const navItems = useMemo(() => items, [items]);

  if (!navItems?.length) {
    return null;
  }

  return (
      <nav className="grid items-start gap-2">
        <TooltipProvider>
          {navItems.map((item, index) => {
            const Icon = NavIcons[item.icon || 'arrowRight'];

            return (
                item.href && (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Link
                            href={item.disabled ? '/' : item.href}
                            className={cn(
                                'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                                path === item.href ? 'bg-accent' : 'transparent',
                                item.disabled && 'cursor-not-allowed opacity-80'
                            )}
                            onClick={() => {
                              if (setOpen) setOpen(false);
                            }}
                        >
                          <Icon className="ml-3 size-5 flex-none" />

                          {(isMobileNav || !isMinimized) && (
                              <span className="mr-2 truncate">{item.title}</span>
                          )}
                        </Link>
                      </TooltipTrigger>
                      {isMinimized && (
                          <TooltipContent
                              align="center"
                              side="right"
                              sideOffset={8}
                          >
                            {item.title}
                          </TooltipContent>
                      )}
                    </Tooltip>
                )
            );
          })}
        </TooltipProvider>
      </nav>
  );
}
