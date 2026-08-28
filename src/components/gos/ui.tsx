import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  IconAlert,
  IconChevronDown,
  IconChevronRight,
  IconClose,
  IconInbox,
  IconLock,
  IconMore,
  IconRefresh,
  IconSearch,
} from "./icons";
import type { BatchStatus } from "@/data/garmentos";

/* ---------- Card ---------- */

export function Card({
  className,
  children,
  padded = true,
}: {
  className?: string | undefined;
  children: ReactNode;
  padded?: boolean | undefined;
}) {
  return (
    <section
      className={cn(
        "surface-card surface-grad rounded-[10px] transition-shadow duration-200",
        padded && "p-4 md:p-5",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  hint,
  action,
  className,
}: {
  title: string;
  hint?: ReactNode | undefined;
  action?: ReactNode | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex min-w-0 items-baseline gap-2.5">
        <h2 className="t-section truncate">{title}</h2>
        {hint ? <span className="t-meta shrink-0">{hint}</span> : null}

      </div>
      {action}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}



/* ---------- Button ---------- */

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | undefined;
  size?: "sm" | "md" | undefined;
  onClick?: (() => void) | undefined;
  className?: string | undefined;
  icon?: ReactNode | undefined;
  type?: "button" | undefined;
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
};

function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="animate-spin"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Button({
  children,
  variant = "secondary",
  size = "md",
  onClick,
  className,
  icon,
  disabled,
  loading,
}: ButtonProps) {
  const inert = disabled || loading;
  return (
    <button
      type="button"
      onClick={inert ? undefined : onClick}
      disabled={inert}
      aria-busy={loading || undefined}
      className={cn(
        "interactive focus-ring relative inline-flex items-center justify-center gap-1.5 rounded-[6px] font-medium tracking-[-0.005em]",
        size === "sm" ? "h-8 px-2.5 text-[12px]" : "h-9 px-3.5 text-[13px]",
        variant === "primary" &&
          "bg-foreground text-background shadow-[inset_0_-2px_0_0_color-mix(in_oklab,var(--primary)_75%,transparent)] hover:bg-foreground/88 active:bg-foreground/95",
        variant === "secondary" &&
          "border border-input bg-card text-foreground hover:border-primary/35 hover:bg-muted active:bg-muted",
        variant === "ghost" && "text-muted-foreground hover:bg-muted hover:text-foreground",
        inert && "pointer-events-none opacity-45 shadow-none",
        className,
      )}

    >
      {loading ? <Spinner size={size === "sm" ? 12 : 14} /> : icon}
      {children}
    </button>
  );
}

export function IconButton({
  children,
  onClick,
  label,
  className,
  active,
}: {
  children: ReactNode;
  onClick?: (() => void) | undefined;
  label: string;
  className?: string | undefined;
  active?: boolean | undefined;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "interactive focus-ring inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted md:h-9 md:w-9",
        active && "border-primary/25 bg-primary/[0.08] text-primary",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ---------- Контекстное меню «•••» ---------- */

export function ContextMenu({
  items,
  label = "Действия",
  className,
}: {
  items: { label: string; onSelect?: () => void; disabled?: boolean }[];
  label?: string | undefined;
  className?: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <IconButton
        label={label}
        active={open}
        onClick={() => setOpen((o) => !o)}
      >
        <IconMore size={16} />
      </IconButton>
      {open ? (
        <div className="anim-pop elev-overlay absolute right-0 top-[calc(100%+6px)] z-40 min-w-[210px] overflow-hidden rounded-[10px] border border-border bg-popover py-1">
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              disabled={it.disabled}
              onClick={() => {
                setOpen(false);
                it.onSelect?.();
              }}
              className={cn(
                "flex w-full items-center px-3 py-2.5 text-left text-[13px] transition-colors duration-150 hover:bg-muted",
                it.disabled && "pointer-events-none opacity-45",
              )}
            >
              {it.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}


/* ---------- StatusBadge ---------- */

const statusTone: Record<string, "neutral" | "info" | "accent" | "success" | "warning" | "danger"> = {
  Черновик: "neutral",
  Размещён: "info",
  "В производстве": "accent",
  "Готово к отгрузке": "warning",
  Принято: "success",
  Отменён: "danger",
  Получена: "success",
  Отправлена: "accent",
  Актуальная: "success",
  "BOM утверждён": "success",
  "BOM черновик": "neutral",
};

const toneStyles: Record<string, string> = {
  neutral: "text-muted-foreground border-border bg-muted/60",
  info: "text-foreground border-border bg-muted/60",
  accent: "text-primary border-primary/25 bg-primary/[0.08]",
  success: "text-success border-success/25 bg-success/[0.08]",
  warning: "text-warning border-warning/30 bg-warning/[0.08]",
  danger: "text-danger border-danger/25 bg-danger/[0.08]",
};

const dotStyles: Record<string, string> = {
  neutral: "bg-muted-foreground/60",
  info: "bg-muted-foreground",
  accent: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function StatusBadge({
  status,
  tone,
  className,
}: {
  status: BatchStatus | string;
  tone?: keyof typeof toneStyles | undefined;
  className?: string | undefined;
}) {
  const t = tone ?? statusTone[status] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[4px] text-[11.5px] font-medium whitespace-nowrap transition-colors duration-200",
        toneStyles[t],
        className,
      )}

    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[t])} />
      {status}
    </span>
  );

}

export function VersionBadge({ label }: { label: string }) {
  const actual = label.toLowerCase().startsWith("актуальн");
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] border px-1.5 py-[2px] text-[11px] font-medium",
        actual
          ? "border-success/25 bg-success/[0.08] text-success"
          : "border-border bg-muted/60 text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

/* ---------- Page header / breadcrumbs ---------- */

export function Breadcrumbs({
  items,
}: {
  items: { label: string; onClick?: () => void }[];
}) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
      {items.map((it, i) => (
        <span key={it.label} className="inline-flex items-center gap-1">
          {i > 0 ? <IconChevronRight size={12} className="opacity-60" /> : null}
          {it.onClick ? (
            <button
              type="button"
              onClick={it.onClick}
              className="focus-ring rounded-[4px] transition-colors hover:text-foreground"
            >
              {it.label}
            </button>
          ) : (
            <span className="text-foreground">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
}: {
  title: string;
  subtitle?: ReactNode | undefined;
  breadcrumbs?: ReactNode | undefined;
  actions?: ReactNode | undefined;
}) {
  return (
    <header className="anim-rise mb-5 md:mb-6">
      {breadcrumbs}
      <div className="mt-1.5 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="t-page md:t-display md:text-[38px]">{title}</h1>
          {subtitle ? (
            <p className="t-secondary mt-2 max-w-[68ch]">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      <span className="mt-4 block h-px w-full bg-[linear-gradient(90deg,color-mix(in_oklab,var(--primary)_55%,transparent)_0%,var(--border)_18%,transparent_86%)]" />
    </header>
  );


}

/* ---------- Search & filters ---------- */

export function SearchField({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("relative", className)}>
      <IconSearch
        size={16}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-[10px] border border-border bg-card pl-8 pr-3 text-[13px] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-ring/20 md:h-9"
      />
    </div>
  );
}

export function FilterChips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="-mx-1 flex flex-wrap gap-1 px-1">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cn(
            "interactive focus-ring h-9 rounded-[10px] border px-2.5 text-[12px] font-medium md:h-8",
            value === o
              ? "border-primary/35 bg-primary/[0.10] text-primary shadow-[inset_0_-2px_0_0_color-mix(in_oklab,var(--primary)_45%,transparent)]"
              : "border-border bg-card text-muted-foreground hover:border-primary/25 hover:bg-muted hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/* ---------- Metrics ---------- */

export function MetricStrip({
  items,
}: {
  items: { label: string; value: string; tone?: "danger" | "warning" }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {items.map((m) => (
        <div
          key={m.label}
          className="surface-card surface-grad group flex flex-col rounded-[10px] px-4 py-4 transition-shadow duration-200 hover:elev-2"
        >
          <div className="t-meta uppercase tracking-[0.06em]">{m.label}</div>
          <div
            className={cn(
              "t-figure mt-3.5 text-[32px]",
              m.tone === "danger" && "text-danger",
              m.tone === "warning" && "text-warning",
            )}
          >
            {m.value}
          </div>

          <span
            className={cn(
              "mt-4 block h-px w-full",
              m.tone === "danger"
                ? "bg-danger/25"
                : m.tone === "warning"
                  ? "bg-warning/30"
                  : "bg-border",
            )}
          />
        </div>
      ))}
    </div>
  );


}

/* ---------- Attention ---------- */

export function AttentionList({
  items,
  onSelect,
}: {
  items: { id: string; tone: "danger" | "warning"; title: string; meta: string; sub: string }[];
  onSelect?: ((id: string) => void) | undefined;
}) {
  return (
    <ul className="divide-y divide-border">
      {items.map((it) => (
        <li key={it.id}>
          <button
            type="button"
            onClick={() => onSelect?.(it.id)}
            className="interactive focus-ring -mx-2 flex w-full items-start gap-3 rounded-[8px] px-2 py-3 text-left hover:bg-muted/50 active:bg-muted"
          >
            <span
              className={cn(
                "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px]",
                it.tone === "danger"
                  ? "bg-danger/[0.08] text-danger"
                  : "bg-warning/[0.08] text-warning",
              )}
            >
              <IconAlert size={14} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="t-object block">{it.title}</span>
              <span className="t-meta mt-1 block">{it.sub}</span>
            </span>
            <span
              className={cn(
                "t-value shrink-0 text-[13.5px] font-semibold",
                it.tone === "danger" ? "text-danger" : "text-warning",
              )}
            >
              {it.meta}
            </span>

          </button>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Table ---------- */

export function DataTable({
  columns,
  children,
  className,
}: {
  columns: { key: string; label: string; align?: "left" | "right"; width?: string }[];
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div className={cn("surface-card surface-grad overflow-hidden rounded-[10px]", className)}>
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-border">
            {columns.map((c) => (
              <th
                key={c.key}
                style={c.width ? { width: c.width } : undefined}
                className={cn(
                  "h-11 px-4 text-[11.5px] font-medium uppercase tracking-[0.06em] text-muted-foreground",
                  c.align === "right" ? "text-right" : "text-left",

                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border [&>tr]:cursor-pointer [&>tr]:transition-colors [&>tr]:duration-150 [&>tr:hover]:bg-muted">
          {children}
        </tbody>

      </table>
    </div>
  );

}

export function Td({
  children,
  align,
  className,
}: {
  children: ReactNode;
  align?: "left" | "right" | undefined;
  className?: string | undefined;
}) {
  return (
    <td
      className={cn(
        "h-[52px] px-4 align-middle",
        align === "right" && "text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function MobileListItem({
  onClick,
  children,
}: {
  onClick?: (() => void) | undefined;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="interactive focus-ring elev-1 min-h-[56px] w-full rounded-[10px] border border-border bg-card p-3.5 text-left hover:border-primary/25 active:bg-muted/50"
    >
      {children}
    </button>
  );
}

/* ---------- Accordion ---------- */

export function Accordion({
  title,
  hint,
  defaultOpen = false,
  children,
}: {
  title: string;
  hint?: ReactNode | undefined;
  defaultOpen?: boolean | undefined;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-[10px] border border-border bg-card transition-shadow duration-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="interactive focus-ring flex min-h-[48px] w-full items-center justify-between gap-3 rounded-[10px] px-4 py-3 text-left hover:bg-muted/45 active:bg-muted/60"
      >
        <span className="flex items-baseline gap-2">
          <span className="text-[13px] font-semibold">{title}</span>
          {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
        </span>
        <IconChevronDown
          size={16}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <div className={cn("collapsible", open && "collapsible-open")}>
        <div>
          <div className="border-t border-border px-4 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Drawer / bottom sheet ---------- */

export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end">
      <div
        className="anim-overlay absolute inset-0 bg-foreground/35 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="anim-sheet elev-4 relative flex max-h-[85vh] w-full flex-col rounded-t-[14px] border border-border bg-card sm:anim-panel sm:h-full sm:max-h-none sm:w-[420px] sm:rounded-none sm:rounded-l-[10px]">
        <span className="mx-auto mt-2 block h-1 w-9 rounded-full bg-border sm:hidden" aria-hidden="true" />
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-[13px] font-semibold">{title}</h3>
          <IconButton label="Закрыть" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>
        <div className="overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>
  );
}

/* ---------- States ---------- */

export function EmptyState({
  title,
  description,
  icon,
  action,
  compact,
}: {
  title: string;
  description: string;
  icon?: ReactNode | undefined;
  action?: ReactNode | undefined;
  compact?: boolean | undefined;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[10px] border border-dashed border-border bg-card/60 text-center",
        compact ? "px-5 py-10" : "px-6 py-16",
      )}
    >
      <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-border bg-muted/50 text-muted-foreground">
        {icon ?? <IconInbox size={18} />}
      </span>
      <h3 className="text-[14px] font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-[380px] text-[12px] leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="space-y-2.5" aria-busy="true">
      <div className="h-9 w-1/3 skeleton rounded-[10px]" />
      <div className="rounded-[10px] border border-border bg-card p-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 border-b border-border py-3 last:border-0">
            <div className="h-3 w-10 skeleton rounded-[4px]" />
            <div className="h-3 flex-1 skeleton rounded-[4px]" />
            <div className="h-3 w-16 skeleton rounded-[4px]" />
            <div className="h-3 w-20 skeleton rounded-[4px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[10px] border border-danger/20 bg-danger/[0.03] px-6 py-12 text-center">
      <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-danger/20 bg-danger/[0.08] text-danger">
        <IconAlert size={18} />
      </span>
      <h3 className="text-[14px] font-semibold">Не удалось загрузить данные</h3>
      <p className="mt-1.5 max-w-[360px] text-[12px] leading-relaxed text-muted-foreground">
        Соединение с сервисом прервано. Данные не были получены — повторите попытку.
      </p>
      <div className="mt-4">
        <Button icon={<IconRefresh size={14} />} onClick={onRetry}>
          Повторить
        </Button>
      </div>
    </div>
  );
}

export function AccessDeniedState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[10px] border border-border bg-card px-6 py-12 text-center">
      <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-border bg-muted/60 text-muted-foreground">
        <IconLock size={18} />
      </span>
      <h3 className="text-[14px] font-semibold">Нет прав доступа</h3>
      <p className="mt-1.5 max-w-[360px] text-[12px] leading-relaxed text-muted-foreground">
        У вашей роли нет доступа к этому разделу. Запросите расширение прав у владельца бренда.
      </p>
    </div>
  );
}
