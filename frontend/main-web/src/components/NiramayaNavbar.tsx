import { useState } from 'react';
import type { ReactNode } from 'react';
import { BookOpen, CalendarDays, FileText, HeartPulse, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export type NiramayaPage = 'home' | 'appointments' | 'records' | 'wellness';

interface NiramayaNavbarProps {
  activePage?: NiramayaPage;
  onBack?: () => void;
  onNavigate?: (page: NiramayaPage) => void;
  actions?: ReactNode;
}

const items: Array<{ page: NiramayaPage; label: string; icon: typeof CalendarDays }> = [
  { page: 'appointments', label: 'Appointments', icon: CalendarDays },
  { page: 'records', label: 'Health records', icon: FileText },
  { page: 'wellness', label: 'Wellness Library', icon: BookOpen }
];

export default function NiramayaNavbar({ activePage, onBack, onNavigate, actions }: NiramayaNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (page: NiramayaPage) => {
    setMobileOpen(false);
    onNavigate?.(page);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <button type="button" onClick={onBack} className="flex min-w-0 items-center gap-2.5 text-left" aria-label="Go to Niramaya home">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-bold tracking-tight text-slate-900">Niramaya</span>
            <span className="block truncate text-[11px] text-slate-500">Digital Healthcare</span>
          </span>
        </button>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">
          {items.map(({ page, label, icon: Icon }) => (
            <button
              key={page}
              type="button"
              onClick={() => navigate(page)}
              aria-current={activePage === page ? 'page' : undefined}
              className={`inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ${
                activePage === page
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {actions}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-slate-100 bg-white px-4 py-2 lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-7xl gap-1 sm:grid-cols-3">
            {items.map(({ page, label, icon: Icon }) => (
              <button
                key={page}
                type="button"
                onClick={() => navigate(page)}
                aria-current={activePage === page ? 'page' : undefined}
                className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-left text-sm font-medium ${
                  activePage === page ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
