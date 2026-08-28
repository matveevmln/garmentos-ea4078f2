import { useState, type ReactNode } from "react";
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
                  "group relative flex w-full items-center gap-3 rounded-[8px] pl-3 pr-2 transition-colors duration-150",
                  mobile ? "min-h-[48px] py-3 text-[15px]" : "py-2.5 text-[13.5px]",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-[color-mix(in_oklab,var(--sidebar-primary)_14%,var(--sidebar))] font-medium text-sidebar-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
                )}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full transition-colors",
                    isActive ? "bg-sidebar-primary" : "bg-transparent",
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
            <span className="mt-1.5 truncate text-[9.5px] uppercase tracking-[0.16em] text-sidebar-foreground/40">
              production system
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

  const go = (k: ScreenKey) => {
    onNavigate(k);
    setMobileNavOpen(false);
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

      {/* Mobile nav drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/45 backdrop-blur-[2px]" onClick={() => setMobileNavOpen(false)} />
          <div className="relative flex h-full w-[300px] max-w-[86vw] flex-col bg-sidebar shadow-[0_16px_48px_rgb(0_0_0/0.28)]">
            <button
              type="button"
              aria-label="Закрыть меню"
              onClick={() => setMobileNavOpen(false)}
              className="absolute right-2 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-[8px] text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <IconClose size={18} />
            </button>
            <SidebarBody active={active} onNavigate={go} collapsed={false} mobile />
          </div>
        </div>
      ) : null}

      <div className={cn("flex min-h-screen flex-col transition-[padding] duration-200", collapsed ? "md:pl-[64px]" : "md:pl-[260px]")}>
        {/* TopBar */}
        <header className="sticky top-0 z-20 flex h-[60px] items-center gap-2 border-b border-border bg-card/92 px-3 backdrop-blur-md md:px-8">
          <IconButton label="Меню" className="md:hidden" onClick={() => setMobileNavOpen(true)}>
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
                "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-colors",
                active === "states"
                  ? "border-primary/30 bg-primary/[0.08] text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
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
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card/97 backdrop-blur md:hidden">
        {MOBILE_NAV.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.key || (it.key === "batches" && active === "passport");
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => go(it.key)}
              className={cn(
                "relative flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] transition-colors",
                isActive ? "font-semibold text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "absolute inset-x-4 top-0 h-[2px] rounded-b-[2px]",
                  isActive ? "bg-primary" : "bg-transparent",
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
          className="flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] text-muted-foreground"
        >
          <IconMenu size={18} />
          Ещё
        </button>
      </nav>
    </div>
  );
}
