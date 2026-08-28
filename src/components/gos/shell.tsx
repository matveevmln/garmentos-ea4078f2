import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  IconBatch,
  IconDocument,
  IconFinance,
  IconHome,
  IconMaterial,
  IconMenu,
  IconModel,
  IconPanel,
  IconPurchase,
  IconStates,
  IconSupplier,
  IconUser,
  IconWarehouse,
  IconWorkshop,
  IconClose,
} from "./icons";
import { IconButton } from "./ui";

export type ScreenKey =
  | "home"
  | "batches"
  | "passport"
  | "models"
  | "workshops"
  | "materials"
  | "purchases"
  | "warehouses"
  | "suppliers"
  | "documents"
  | "finance"
  | "states";

type NavItem = { key: ScreenKey; label: string; icon: (p: { size?: number }) => ReactNode };

export const NAV_PRIMARY: NavItem[] = [
  { key: "home", label: "Главная", icon: IconHome },
  { key: "batches", label: "Партии", icon: IconBatch },
  { key: "models", label: "Модели", icon: IconModel },
  { key: "workshops", label: "Цеха", icon: IconWorkshop },
];

export const NAV_SUPPLY: NavItem[] = [
  { key: "materials", label: "Материалы", icon: IconMaterial },
  { key: "purchases", label: "Закупки", icon: IconPurchase },
  { key: "warehouses", label: "Склады", icon: IconWarehouse },
  { key: "suppliers", label: "Поставщики", icon: IconSupplier },
];

export const NAV_OFFICE: NavItem[] = [
  { key: "documents", label: "Документы", icon: IconDocument },
  { key: "finance", label: "Финансы", icon: IconFinance },
];

const MOBILE_NAV: NavItem[] = [
  { key: "home", label: "Главная", icon: IconHome },
  { key: "batches", label: "Партии", icon: IconBatch },
  { key: "models", label: "Модели", icon: IconModel },
  { key: "materials", label: "Материалы", icon: IconMaterial },
];

function NavGroup({
  label,
  items,
  active,
  onNavigate,
  collapsed,
  mobile = false,
}: {
  label: string;
  items: NavItem[];
  active: ScreenKey;
  onNavigate: (k: ScreenKey) => void;
  collapsed: boolean;
  mobile?: boolean;
}) {
  return (
    <div className={cn("px-3", mobile && "px-3")}>
      {!collapsed ? (
        <div className="px-3 pb-2 pt-6 text-[10px] font-medium uppercase tracking-[0.16em] text-sidebar-foreground/40">
          {label}
        </div>
      ) : (
        <div className="mx-3 my-3 border-t border-sidebar-border/60" />
      )}
      <ul className="space-y-0.5">
        {items.map((it) => {
          const isActive = active === it.key || (it.key === "batches" && active === "passport");
          const Icon = it.icon;
          return (
            <li key={it.key}>
              <button
                type="button"
                onClick={() => onNavigate(it.key)}
                title={it.label}
                className={cn(
                  "interactive group relative flex w-full items-center gap-3 rounded-[8px] pl-3 pr-2",
                  mobile ? "min-h-[48px] py-3 text-[15px]" : "py-2.5 text-[13.5px]",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-[color-mix(in_oklab,var(--sidebar-primary)_14%,var(--sidebar))] font-medium text-sidebar-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
                )}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-sidebar-primary transition-[opacity,transform] duration-200",
                    isActive ? "scale-y-100 opacity-100" : "scale-y-50 opacity-0",
                  )}
                />
                <span className={cn("transition-colors", isActive ? "text-sidebar-primary" : "text-current")}>
                  <Icon size={mobile ? 18 : 17} />
                </span>
                {!collapsed ? <span className="truncate">{it.label}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

}

/* Знак GarmentOS: игольное ушко и нить — собственный лаконичный монограм */
function BrandMark() {
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-[color-mix(in_oklab,var(--sidebar-primary)_18%,var(--sidebar))]">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M10 2.5v7.2"
          stroke="var(--sidebar-primary)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <ellipse cx="10" cy="12.1" rx="2.5" ry="3.2" stroke="var(--sidebar-primary)" strokeWidth="1.6" />
        <path
          d="M4.2 17.5c1.9-1.5 3.8-1.5 5.8 0"
          stroke="var(--sidebar-foreground)"
          strokeOpacity="0.55"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function SidebarBody({

  active,
  onNavigate,
  collapsed,
  mobile = false,
}: {
  active: ScreenKey;
  onNavigate: (k: ScreenKey) => void;
  collapsed: boolean;
  mobile?: boolean;
}) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div
        className={cn(
          "flex items-center gap-2.5 px-5",
          mobile ? "h-[72px]" : "h-[76px]",
          collapsed && "justify-center px-0",
        )}
      >
        <BrandMark />
        {!collapsed ? (
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-display text-[19px] font-semibold tracking-[-0.02em] text-sidebar-foreground">
              GarmentOS
            </span>
            <span className="mt-1.5 block text-[9px] uppercase leading-none tracking-[0.1em] text-sidebar-foreground/40">
              производственная система
            </span>


          </span>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto pb-4">
        <NavGroup label="Производство" items={NAV_PRIMARY} active={active} onNavigate={onNavigate} collapsed={collapsed} mobile={mobile} />
        <NavGroup label="Снабжение" items={NAV_SUPPLY} active={active} onNavigate={onNavigate} collapsed={collapsed} mobile={mobile} />
        <NavGroup label="Учёт" items={NAV_OFFICE} active={active} onNavigate={onNavigate} collapsed={collapsed} mobile={mobile} />
      </nav>

      <div className={cn("border-t border-sidebar-border/60 p-4", collapsed && "px-0 text-center")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--sidebar-primary)_22%,var(--sidebar))] text-[11px] font-semibold tracking-[0.02em] text-sidebar-primary">
            БМ
          </span>
          {!collapsed ? (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-sidebar-foreground">Богдан М.</span>
              <span className="block truncate text-[11.5px] text-sidebar-foreground/45">ООО «Мода Лав»</span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );

}

function panelWidthSafe(max: number) {
  if (typeof window === "undefined") return max;
  return Math.min(max, window.innerWidth * 0.86);
}

export function AppShell({
  active,
  onNavigate,
  topbarTitle,
  children,
}: {
  active: ScreenKey;
  onNavigate: (k: ScreenKey) => void;
  topbarTitle: string;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  // Смещение панели во время жеста: null — жест не активен.
  const [dragX, setDragX] = useState<number | null>(null);
  const gesture = useRef<{ startX: number; startY: number; active: boolean; from: "edge" | "panel" } | null>(null);
  const PANEL_W = 300;

  const closeNav = useCallback(() => {
    setDragX(null);
    setClosing(true);
  }, []);

  useEffect(() => {
    if (!closing) return;
    const t = window.setTimeout(() => {
      setClosing(false);
      setMobileNavOpen(false);
    }, 200);
    return () => window.clearTimeout(t);
  }, [closing]);

  const panelWidth = () => Math.min(PANEL_W, window.innerWidth * 0.86);

  const onEdgeStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    gesture.current = { startX: t.clientX, startY: t.clientY, active: false, from: "edge" };
  };

  const onPanelStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    gesture.current = { startX: t.clientX, startY: t.clientY, active: false, from: "panel" };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const g = gesture.current;
    const t = e.touches[0];
    if (!g || !t) return;
    const dx = t.clientX - g.startX;
    const dy = t.clientY - g.startY;
    if (!g.active) {
      if (Math.abs(dy) > Math.abs(dx) || Math.abs(dx) < 8) return;
      g.active = true;
      if (g.from === "edge") {
        setClosing(false);
        setMobileNavOpen(true);
      }
    }
    const w = panelWidth();
    if (g.from === "edge") {
      setDragX(Math.min(0, -w + Math.max(0, dx)));
    } else {
      setDragX(Math.max(-w, Math.min(0, dx)));
    }
  };

  const onTouchEnd = () => {
    const g = gesture.current;
    gesture.current = null;
    if (!g || !g.active) {
      setDragX(null);
      return;
    }
    const w = panelWidth();
    const offset = dragX ?? 0;
    if (offset > -w / 2) {
      setDragX(null);
      setMobileNavOpen(true);
    } else {
      closeNav();
    }
  };

  const dragging = dragX !== null;
  const progress = dragging ? 1 + dragX / panelWidthSafe(PANEL_W) : 1;

  const go = (k: ScreenKey) => {
    onNavigate(k);
    closeNav();
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Sidebar — desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden bg-sidebar transition-[width] duration-200 md:block",
          collapsed ? "w-[64px]" : "w-[260px]",
        )}
      >
        <SidebarBody active={active} onNavigate={go} collapsed={collapsed} />
      </aside>

      {/* Зона edge-swipe: открытие меню свайпом от левого края */}
      {!mobileNavOpen ? (
        <div
          aria-hidden="true"
          onTouchStart={onEdgeStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
          className="fixed left-0 top-0 bottom-[56px] z-40 w-5 touch-pan-y md:hidden"
        />
      ) : null}

      {/* Mobile nav drawer */}
      {mobileNavOpen ? (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onTouchStart={onPanelStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <div
            className={cn(
              "absolute inset-0 bg-foreground/45 backdrop-blur-[2px]",
              !dragging && (closing ? "anim-overlay-out" : "anim-overlay"),
            )}
            style={dragging ? { opacity: Math.max(0, Math.min(1, progress)) } : undefined}
            onClick={closeNav}
          />
          <div
            className={cn(
              "elev-4 relative flex h-full w-[300px] max-w-[86vw] flex-col bg-sidebar touch-pan-y",
              !dragging && (closing ? "anim-panel-left-out" : "anim-panel-left-full"),
            )}
            style={dragging ? { transform: `translateX(${dragX}px)` } : undefined}
          >
            <button
              type="button"
              aria-label="Закрыть меню"
              onClick={closeNav}
              className="interactive absolute right-2 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-[8px] text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <IconClose size={18} />
            </button>
            <SidebarBody active={active} onNavigate={go} collapsed={false} mobile />
          </div>
        </div>
      ) : null}

      <div className={cn("flex min-h-screen flex-col transition-[padding] duration-200", collapsed ? "md:pl-[64px]" : "md:pl-[260px]")}>
        {/* TopBar */}
        <header className="sticky top-0 z-20 flex h-[60px] items-center gap-2 border-b border-border bg-card/92 px-3 shadow-[0_1px_0_0_color-mix(in_oklab,var(--foreground)_4%,transparent)] backdrop-blur-md md:px-8">
          <IconButton label="Меню" className="md:hidden" onClick={() => { setClosing(false); setDragX(null); setMobileNavOpen(true); }}>
            <IconMenu size={18} />
          </IconButton>
          <IconButton
            label={collapsed ? "Развернуть навигацию" : "Свернуть навигацию"}
            className="hidden md:inline-flex"
            onClick={() => setCollapsed((c) => !c)}
          >
            <IconPanel size={16} />
          </IconButton>
          <span className="truncate font-display text-[13.5px] font-medium tracking-[-0.01em]">{topbarTitle}</span>
          <span className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">
            <button
              type="button"
              onClick={() => go("states")}
              className={cn(
                "interactive inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium",
                active === "states"
                  ? "border-primary/35 bg-primary/[0.10] text-primary shadow-[inset_0_-2px_0_0_color-mix(in_oklab,var(--primary)_45%,transparent)]"
                  : "border-border bg-card text-muted-foreground hover:border-primary/25 hover:bg-muted hover:text-foreground",
              )}
            >
              <IconStates size={14} />
              Состояния
            </button>
            <span className="hidden rounded-full border border-border bg-muted px-2.5 py-[5px] text-[11px] md:inline-flex">
              Прототип · демо-данные
            </span>
          </span>

        </header>

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-3 py-5 pb-24 md:px-8 md:py-7 md:pb-10">{children}</main>

      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card/97 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_color-mix(in_oklab,var(--foreground)_7%,transparent)] backdrop-blur md:hidden">
        {MOBILE_NAV.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.key || (it.key === "batches" && active === "passport");
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => go(it.key)}
              className={cn(
                "interactive relative flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px]",
                isActive ? "font-semibold text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "absolute inset-x-4 top-0 h-[2px] rounded-b-[2px] bg-primary transition-[opacity,transform] duration-200",
                  isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
                )}
              />
              <Icon size={18} />
              {it.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="interactive flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] text-muted-foreground"
        >
          <IconMenu size={18} />
          Ещё
        </button>
      </nav>
    </div>
  );
}
