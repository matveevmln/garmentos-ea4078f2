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
  IconSearch,
} from "./icons";
import { IconButton } from "./ui";
import { CommandPalette, type PaletteItem } from "./palette";

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

const PALETTE_ITEMS: PaletteItem[] = [
  ...NAV_PRIMARY.map((i) => ({ key: i.key, label: i.label, group: "Производство" })),
  ...NAV_SUPPLY.map((i) => ({ key: i.key, label: i.label, group: "Снабжение" })),
  ...NAV_OFFICE.map((i) => ({ key: i.key, label: i.label, group: "Учёт" })),
  { key: "passport" as ScreenKey, label: "Паспорт партии #158", group: "Производство", hint: "158 лана промода" },
  { key: "states" as ScreenKey, label: "Состояния интерфейса", group: "Прототип" },
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
                  "interactive focus-ring group relative flex w-full items-center gap-3 rounded-[8px] pl-3 pr-2",
                  mobile ? "min-h-[48px] py-3 text-[15px]" : "py-2.5 text-[13.5px]",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "nav-active font-medium text-sidebar-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
                )}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-sidebar-primary shadow-[0_0_12px_0_color-mix(in_oklab,var(--sidebar-primary)_70%,transparent)] transition-[opacity,transform] duration-200",
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
    <div className="rail-ambient isolate flex h-full flex-col bg-sidebar text-sidebar-foreground">
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
  const [paletteOpen, setPaletteOpen] = useState(false);
  const gesture = useRef<{
    startX: number;
    startY: number;
    active: boolean;
    from: "edge" | "panel";
    offset: number;
    lastX: number;
    lastT: number;
    velocity: number;
    width: number;
    raf: number;
    pendingX: number | null;
  } | null>(null);
  const edgeRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const PANEL_W = 300;

  // Панель смонтирована всегда. Подготовка слоя выполняется один раз,
  // а в горячем touchmove меняется только compositor-friendly transform.
  const prepareDrag = () => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const layer = layerRef.current;
    if (!panel || !backdrop || !layer) return;
    layer.style.pointerEvents = "auto";
    layer.style.visibility = "visible";
    panel.style.transition = "none";
    backdrop.style.transition = "none";
    backdrop.style.opacity = "1";
  };

  const applyDrag = (x: number, width: number) => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel) return;
    panel.style.transform = `translate3d(${x}px,0,0)`;
    if (backdrop) {
      const progress = Math.max(0, Math.min(1, (x + width) / width));
      backdrop.style.opacity = String(progress);
    }
  };

  const clearDrag = () => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const layer = layerRef.current;
    if (panel) {
      panel.style.transition = "";
      panel.style.transform = "";
    }
    if (backdrop) {
      backdrop.style.transition = "";
      backdrop.style.opacity = "";
    }
    if (layer) {
      layer.style.pointerEvents = "";
      layer.style.visibility = "";
    }
  };

  const closeNav = useCallback(() => {
    clearDrag();
    setMobileNavOpen(false);
  }, []);

  const startGesture = useCallback((t: { clientX: number; clientY: number }, from: "edge" | "panel") => {
    const w = panelWidthSafe(PANEL_W);
    gesture.current = {
      startX: t.clientX,
      startY: t.clientY,
      active: false,
      from,
      offset: from === "panel" ? 0 : -w,
      lastX: t.clientX,
      lastT: performance.now(),
      velocity: 0,
      width: w,
      raf: 0,
      pendingX: null,
    };

    const move = (ev: TouchEvent) => {
      const g = gesture.current;
      const p = ev.touches[0];
      if (!g || !p) return;
      const dx = p.clientX - g.startX;
      const dy = p.clientY - g.startY;
      if (!g.active) {
        if (Math.abs(dx) < 1) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          gesture.current = null;
          window.removeEventListener("touchmove", move);
          return;
        }
        if (g.from === "edge" && dx <= 0) return;
        g.active = true;
        prepareDrag();
      }
      if (ev.cancelable) ev.preventDefault();
      const now = performance.now();
      const dt = now - g.lastT;
      if (dt > 0) {
        const v = (p.clientX - g.lastX) / dt;
        // EMA-сглаживание скорости — устойчивое распознавание flick без дёрганий
        g.velocity = g.velocity * 0.7 + v * 0.3;
      }
      g.lastX = p.clientX;
      g.lastT = now;
      const next =
        g.from === "edge"
          ? Math.min(0, -g.width + Math.max(0, dx))
          : Math.max(-g.width, Math.min(0, dx));
      g.offset = next;
      // Батчинг через rAF: один transform-апдейт на кадр, движение без рывков
      g.pendingX = next;
      if (!g.raf) {
        g.raf = requestAnimationFrame(() => {
          const gg = gesture.current;
          if (gg && gg.pendingX !== null) applyDrag(gg.pendingX, gg.width);
          if (gg) gg.raf = 0;
        });
      }
    };

    const end = () => {
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
      window.removeEventListener("touchcancel", end);
      const g = gesture.current;
      gesture.current = null;
      if (!g) return;
      if (g.raf) cancelAnimationFrame(g.raf);
      if (!g.active) return;
      const dist = g.offset + g.width; // сколько панели вытянуто
      const flickOpen = g.velocity > 0.4 && dist > 40;
      const flickClose = g.velocity < -0.4;
      const open = flickOpen || (!flickClose && g.offset > -g.width / 2);
      const panel = panelRef.current;
      const backdrop = backdropRef.current;
      const layer = layerRef.current;
      // Длительность доводки зависит от оставшегося пути: короткий путь — короткая анимация
      const remain = open ? -g.offset : g.offset + g.width;
      const ms = Math.round(Math.min(300, Math.max(160, 120 + (remain / g.width) * 180)));
      const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      if (panel) {
        panel.style.transition = `transform ${ms}ms ${ease}`;
        panel.style.transform = open ? "translate3d(0,0,0)" : `translate3d(${-g.width}px,0,0)`;
      }
      if (backdrop) {
        backdrop.style.transition = `opacity ${ms}ms ease-out`;
        backdrop.style.opacity = open ? "1" : "0";
      }
      if (layer) {
        layer.style.pointerEvents = open ? "auto" : "none";
        layer.style.visibility = "visible";
      }
      setMobileNavOpen(open);
      window.setTimeout(clearDrag, ms + 20);
    };

    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
    window.addEventListener("touchcancel", end);
  }, []);

  // Нативный non-passive listener: перехватываем жест раньше браузерного «назад».
  useEffect(() => {
    const el = edgeRef.current;
    if (!el) return;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) startGesture(t, "edge");
    };
    el.addEventListener("touchstart", onStart, { passive: false });
    return () => el.removeEventListener("touchstart", onStart);
  }, [startGesture]);

  const onPanelStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (t) startGesture(t, "panel");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (k: ScreenKey) => {
    onNavigate(k);
    closeNav();
  };

  return (
    <div className="ambient-field isolate min-h-screen w-full bg-background text-foreground">
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
      <div
        ref={edgeRef}
        aria-hidden="true"
        style={{ touchAction: "pan-y" }}
        className={cn("fixed left-0 top-0 bottom-[56px] z-40 w-6 md:hidden", mobileNavOpen && "hidden")}
      />

      {/* Mobile nav drawer — всегда в DOM, состояние через transform */}
      <div
        ref={layerRef}
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          mobileNavOpen ? "visible" : "pointer-events-none invisible",
        )}
        onTouchStart={mobileNavOpen ? onPanelStart : undefined}
      >
        <div
          ref={backdropRef}
          className={cn(
            "absolute inset-0 bg-foreground/45 transition-opacity duration-300 ease-out",
            mobileNavOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={closeNav}
        />
        <div
          ref={panelRef}
          className={cn(
            "elev-4 relative flex h-full w-[300px] max-w-[86vw] flex-col bg-sidebar transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform",
            mobileNavOpen ? "[transform:translate3d(0,0,0)]" : "[transform:translate3d(-100%,0,0)]",
          )}
          style={{ touchAction: "pan-y" }}
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

      <div className={cn("flex min-h-screen flex-col transition-[padding] duration-200", collapsed ? "md:pl-[64px]" : "md:pl-[260px]")}>
        {/* TopBar */}
        <header className="glass-bar sticky top-0 z-20 flex h-[60px] items-center gap-2 border-b px-3 shadow-[0_1px_0_0_color-mix(in_oklab,var(--foreground)_4%,transparent),0_10px_24px_-22px_color-mix(in_oklab,var(--foreground)_45%,transparent)] md:px-8">
          <IconButton label="Меню" className="md:hidden" onClick={() => setMobileNavOpen((v) => !v)}>

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
              onClick={() => setPaletteOpen(true)}
              className="interactive focus-ring hidden h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-[12px] text-muted-foreground hover:border-primary/25 hover:bg-muted hover:text-foreground lg:inline-flex"
            >
              <IconSearch size={14} />
              Быстрый переход
              <kbd className="micro rounded-[4px] border border-border px-1.5 py-1">⌘K</kbd>
            </button>
            <IconButton label="Быстрый переход" className="lg:hidden" onClick={() => setPaletteOpen(true)}>
              <IconSearch size={16} />
            </IconButton>
            <button
              type="button"
              onClick={() => go("states")}
              className={cn(
                "interactive focus-ring inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium",
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
                "interactive focus-ring relative flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px]",
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
          className="interactive focus-ring flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] text-muted-foreground"
        >
          <IconMenu size={18} />
          Ещё
        </button>
      </nav>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        items={PALETTE_ITEMS}
        onSelect={(k) => onNavigate(k)}
      />
    </div>
  );
}
