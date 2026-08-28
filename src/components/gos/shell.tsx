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
    <div className={cn("px-2", mobile && "px-3")}>
      {!collapsed ? (
        <div className="flex items-center gap-2 px-2 pb-2 pt-5">
          <span className="eyebrow text-[10px] tracking-[0.16em] text-muted-foreground/70">{label}</span>
          <span className="h-px flex-1 bg-border" />
        </div>
      ) : (
        <div className="mx-3 my-3 border-t border-border" />
      )}
      <ul className="space-y-px">
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
                  "group relative flex w-full items-center gap-3 rounded-[6px] pl-3 pr-2 text-[13px] transition-colors",
                  mobile ? "min-h-[48px] py-3 text-[15px]" : "py-[7px]",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-primary/[0.06] font-semibold tracking-[-0.01em] text-primary"
                    : "text-muted-foreground hover:bg-foreground/[0.035] hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1 bottom-1 w-[2px] rounded-r-[2px] transition-colors",
                    isActive ? "bg-primary" : "bg-transparent",
                  )}
                />
                <Icon size={mobile ? 18 : 16} />
                {!collapsed ? <span className="truncate">{it.label}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
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
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center gap-2.5 border-b border-border px-4",
          mobile ? "h-[64px]" : "h-[52px]",
          collapsed && "justify-center px-0",
        )}
      >
        <span className="num inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[3px] bg-foreground text-[11px] font-semibold text-background">
          G
        </span>
        {!collapsed ? (
          <span className="editorial flex items-baseline text-[14px]">
            <span>Garment</span>
            <span className="text-primary">OS</span>
            <span className="num ml-2 text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
              atelier
            </span>
          </span>
        ) : null}
      </div>


      <nav className="flex-1 overflow-y-auto pb-4">
        <div className="pt-1">
          <NavGroup label="Производство" items={NAV_PRIMARY} active={active} onNavigate={onNavigate} collapsed={collapsed} mobile={mobile} />
        </div>
        <NavGroup label="Снабжение" items={NAV_SUPPLY} active={active} onNavigate={onNavigate} collapsed={collapsed} mobile={mobile} />
        <NavGroup label="Учёт" items={NAV_OFFICE} active={active} onNavigate={onNavigate} collapsed={collapsed} mobile={mobile} />
      </nav>

      <div className={cn("border-t border-border p-3", collapsed && "px-0 text-center")}>
        <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
            <IconUser size={14} />
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-medium">Богдан М.</span>
              <span className="block truncate text-[11px] text-muted-foreground">ООО «Мода Лав»</span>
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
          "fixed inset-y-0 left-0 z-30 hidden border-r border-border bg-[color-mix(in_oklab,var(--card)_92%,var(--background))] transition-[width] duration-200 md:block",
          collapsed ? "w-[56px]" : "w-[240px]",
        )}
      >
        <SidebarBody active={active} onNavigate={go} collapsed={collapsed} />
      </aside>

      {/* Mobile nav drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/35 backdrop-blur-[2px]" onClick={() => setMobileNavOpen(false)} />
          <div className="relative flex h-full w-[300px] max-w-[86vw] flex-col border-r border-border bg-card shadow-[0_16px_48px_rgb(0_0_0/0.18)]">
            <div className="absolute right-2 top-3 z-10">
              <IconButton label="Закрыть меню" onClick={() => setMobileNavOpen(false)}>
                <IconClose size={18} />
              </IconButton>
            </div>
            <SidebarBody active={active} onNavigate={go} collapsed={false} mobile />
          </div>
        </div>
      ) : null}

      <div className={cn("flex min-h-screen flex-col transition-[padding] duration-200", collapsed ? "md:pl-[56px]" : "md:pl-[240px]")}>
        {/* TopBar */}
        <header className="sticky top-0 z-20 flex h-[52px] items-center gap-2 border-b border-border bg-card/95 px-3 backdrop-blur md:px-6">
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
          <span className="truncate text-[13px] font-semibold">{topbarTitle}</span>
          <span className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">
            <button
              type="button"
              onClick={() => go("states")}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-[6px] border px-2 text-[11px] font-medium transition-colors",
                active === "states"
                  ? "border-primary/30 bg-primary/[0.08] text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <IconStates size={14} />
              Состояния
            </button>
            <span className="num hidden rounded-[4px] border border-border bg-muted/50 px-1.5 py-[3px] md:inline-flex">
              Прототип · демо-данные
            </span>
          </span>

        </header>

        <main className="flex-1 px-3 py-4 pb-24 md:px-6 md:py-6 md:pb-8">{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card md:hidden">
        {MOBILE_NAV.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.key || (it.key === "batches" && active === "passport");
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => go(it.key)}
              className={cn(
                "flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
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
