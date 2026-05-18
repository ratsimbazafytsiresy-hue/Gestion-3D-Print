"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  FileText,
  Gauge,
  LayoutGrid,
  ReceiptText,
  Settings,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavEntry = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navEntries: NavEntry[] = [
  { label: "Dashboard", href: "/", icon: Gauge },
  { label: "Projets", href: "/projets", icon: LayoutGrid },
  { label: "Planning", href: "/planning", icon: CalendarDays },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Devis & Factures", href: "/devis-factures", icon: FileText },
  { label: "Depenses", href: "/depenses", icon: ReceiptText },
  { label: "Parametres", href: "/parametres", icon: Settings },
];

const isActiveRoute = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-68 border-r border-atelier-line bg-atelier-surface md:flex md:flex-col">
        <BrandBlock />
        <nav aria-label="Navigation principale" className="flex-1 space-y-1 px-3 py-4">
          {navEntries.map((entry) => (
            <SidebarLink active={isActiveRoute(pathname, entry.href)} entry={entry} key={entry.href} />
          ))}
        </nav>
        <div className="border-t border-atelier-line px-5 py-4">
          <div className="rounded-lg border border-atelier-line bg-atelier-canvas px-3 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">Atelier</p>
            <p className="mt-1 text-sm font-semibold text-atelier-ink">Marge et production</p>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-atelier-line bg-atelier-surface/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <BrandBlock compact />
          <WalletCards aria-hidden="true" className="text-atelier-amber" size={20} />
        </div>
        <nav
          aria-label="Navigation principale"
          className="flex min-w-0 max-w-full gap-1 overflow-x-auto overflow-y-hidden overscroll-x-contain px-3 pb-3 [contain:layout_paint_inline-size]"
        >
          {navEntries.map((entry) => (
            <MobileLink active={isActiveRoute(pathname, entry.href)} entry={entry} key={entry.href} />
          ))}
        </nav>
      </header>
    </>
  );
}

function BrandBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("border-atelier-line", compact ? "border-0" : "border-b px-5 py-5")}>
      <Link className="group flex items-center gap-3" href="/">
        <span className="flex h-9 w-9 items-center justify-center rounded-md border border-atelier-line bg-atelier-ink text-sm font-semibold text-atelier-surface">
          GC
        </span>
        <span>
          <span className="block text-sm font-semibold text-atelier-ink group-hover:text-black">Gestion Crafted</span>
          <span className="block text-xs text-atelier-muted">Atelier impression 3D</span>
        </span>
      </Link>
    </div>
  );
}

function SidebarLink({ entry, active }: { entry: NavEntry; active: boolean }) {
  const Icon = entry.icon;

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atelier-amber focus-visible:ring-offset-2 focus-visible:ring-offset-atelier-surface",
        active ? "bg-atelier-ink text-atelier-surface shadow-sm" : "text-atelier-muted hover:bg-atelier-canvas hover:text-atelier-ink",
      )}
      href={entry.href}
    >
      <Icon aria-hidden="true" size={18} />
      <span>{entry.label}</span>
    </Link>
  );
}

function MobileLink({ entry, active }: { entry: NavEntry; active: boolean }) {
  const Icon = entry.icon;

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors",
        active
          ? "border-atelier-ink bg-atelier-ink text-atelier-surface"
          : "border-atelier-line bg-white text-atelier-muted hover:text-atelier-ink",
      )}
      href={entry.href}
    >
      <Icon aria-hidden="true" size={16} />
      <span>{entry.label}</span>
    </Link>
  );
}
