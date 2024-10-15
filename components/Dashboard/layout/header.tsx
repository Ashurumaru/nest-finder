import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar';

export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 w-full">
      <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2">
        </div>
      </nav>
    </header>
  );
}