import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  IconAlert,
  IconChevronDown,
  IconChevronRight,
  IconClose,
  IconInbox,
  IconLock,
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
        "surface-card rounded-[6px]",
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
        <span className="h-[9px] w-[2px] shrink-0 self-center bg-primary" />
        <h2 className="editorial truncate text-[14px]">{title}</h2>
        {hint ? <span className="num shrink-0 text-[11px] text-muted-foreground">{hint}</span> : null}
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
};

export function Button({
  children,
  variant = "secondary",
  size = "md",
  onClick,
  className,
  icon,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[4px] font-medium tracking-[-0.005em] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        size === "sm" ? "h-8 px-2.5 text-[12px]" : "h-9 px-3.5 text-[13px]",
        variant === "primary" &&
          "bg-foreground text-background hover:bg-foreground/88",
        variant === "secondary" &&
          "border border-input bg-card text-foreground hover:border-foreground/25 hover:bg-muted",
        variant === "ghost" && "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function IconButton({
  children,
  onClick,
  label,
  className,
}: {
  children: ReactNode;
  onClick?: (() => void) | undefined;
  label: string;
  className?: string | undefined;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 outline-none",
        className,
      )}
    >
      {children}
    </button>
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
        "inline-flex items-center gap-1.5 rounded-[4px] border px-1.5 py-[3px] text-[11px] font-medium whitespace-nowrap",
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
              className="rounded-[4px] transition-colors hover:text-foreground"
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
    <header className="mb-4 flex flex-col gap-2 md:mb-5">
      {breadcrumbs}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="editorial text-[22px] md:text-[32px]">{title}</h1>
          {subtitle ? (
            <p className="mt-1.5 max-w-[68ch] text-[13px] leading-[1.5] text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
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
        className="h-10 w-full rounded-[6px] border border-border bg-card pl-8 pr-3 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-ring/20 md:h-9"
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
            "h-9 rounded-[6px] border px-2.5 text-[12px] font-medium transition-colors md:h-8",
            value === o
              ? "border-primary/30 bg-primary/[0.08] text-primary"
              : "border-border bg-card text-muted-foreground hover:text-foreground",
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
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-border bg-border lg:grid-cols-4">
      {items.map((m, i) => (
        <div key={m.label} className="relative bg-card px-4 pb-3.5 pt-4">
          <span
            className={cn(
              "absolute left-0 top-0 h-[2px] w-8",
              m.tone === "danger" ? "bg-danger" : m.tone === "warning" ? "bg-warning" : i === 0 ? "bg-primary" : "bg-border",
            )}
          />
          <div className="eyebrow text-[10px]">{m.label}</div>
          <div
            className={cn(
              "num mt-2 text-[30px] leading-none font-semibold tracking-[-0.02em]",
              m.tone === "danger" && "text-danger",
              m.tone === "warning" && "text-warning",
            )}
          >
            {m.value}
          </div>
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
            className="flex w-full items-start gap-3 py-3 text-left transition-colors hover:bg-muted/40"
          >
            <span
              className={cn(
                "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px]",
                it.tone === "danger"
                  ? "bg-danger/[0.08] text-danger"
                  : "bg-warning/[0.08] text-warning",
              )}
            >
              <IconAlert size={14} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-medium">{it.title}</span>
              <span className="mt-0.5 block text-[12px] text-muted-foreground">{it.sub}</span>
            </span>
            <span
              className={cn(
                "num shrink-0 text-[13px] font-medium",
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
    <div className={cn("overflow-hidden rounded-[6px] border border-border bg-card", className)}>
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {columns.map((c) => (
              <th
                key={c.key}
                style={c.width ? { width: c.width } : undefined}
                className={cn(
                  "h-9 px-3 text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground",
                  c.align === "right" ? "text-right" : "text-left",
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
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
        "h-12 px-3 align-middle",
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
      className="w-full rounded-[6px] border border-border bg-card p-3.5 text-left transition-colors active:bg-muted/50"
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
    <div className="rounded-[6px] border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-[44px] w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-baseline gap-2">
          <span className="text-[13px] font-semibold">{title}</span>
          {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
        </span>
        <IconChevronDown
          size={16}
          className={cn("shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? <div className="border-t border-border px-4 py-4">{children}</div> : null}
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
        className="absolute inset-0 bg-foreground/25"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex max-h-[85vh] w-full flex-col rounded-t-[12px] border border-border bg-card shadow-[0_16px_48px_rgb(0_0_0/0.18)] sm:max-h-none sm:h-full sm:w-[420px] sm:rounded-none sm:rounded-l-[8px]">
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
        "flex flex-col items-center justify-center rounded-[6px] border border-dashed border-border bg-card/60 text-center",
        compact ? "px-5 py-10" : "px-6 py-16",
      )}
    >
      <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-border bg-muted/50 text-muted-foreground">
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
      <div className="h-9 w-1/3 animate-pulse rounded-[6px] bg-muted" />
      <div className="rounded-[6px] border border-border bg-card p-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 border-b border-border py-3 last:border-0">
            <div className="h-3 w-10 animate-pulse rounded-[4px] bg-muted" />
            <div className="h-3 flex-1 animate-pulse rounded-[4px] bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded-[4px] bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded-[4px] bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[6px] border border-danger/20 bg-danger/[0.03] px-6 py-12 text-center">
      <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-danger/20 bg-danger/[0.08] text-danger">
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
    <div className="flex flex-col items-center justify-center rounded-[6px] border border-border bg-card px-6 py-12 text-center">
      <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-border bg-muted/60 text-muted-foreground">
        <IconLock size={18} />
      </span>
      <h3 className="text-[14px] font-semibold">Нет прав доступа</h3>
      <p className="mt-1.5 max-w-[360px] text-[12px] leading-relaxed text-muted-foreground">
        У вашей роли нет доступа к этому разделу. Запросите расширение прав у владельца бренда.
      </p>
    </div>
  );
}
