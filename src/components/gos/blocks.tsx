import { cn } from "@/lib/utils";
import { IconCheck, IconDocument, IconDownload } from "./icons";
import { VersionBadge } from "./ui";
import { PRODUCTION_STAGES, type ProductionStage } from "@/data/garmentos";

/* ---------- MoneyBlock ---------- */

export function MoneyBlock({
  label,
  value,
  sub,
  tone,
  className,
}: {
  label: string;
  value: string;
  sub?: string | undefined;
  tone?: "default" | "warning" | "muted" | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("px-4 py-3.5", className)}>
      <div className="eyebrow text-[10px]">{label}</div>
      <div
        className={cn(
          "num mt-2 text-[22px] font-semibold leading-none tracking-[-0.02em]",
          tone === "warning" && "text-warning",
          tone === "muted" && "text-muted-foreground",
        )}
      >
        {value}
      </div>
      {sub ? <div className="num mt-1.5 text-[11px] text-muted-foreground">{sub}</div> : null}
    </div>
  );
}

/* ---------- ProductionStepper — производственная шкала ---------- */

export function ProductionStepper({ current }: { current: ProductionStage }) {
  const idx = PRODUCTION_STAGES.indexOf(current);
  return (
    <ol className="flex flex-col md:flex-row md:items-stretch">
      {PRODUCTION_STAGES.map((stage, i) => {
        const state = i < idx ? "done" : i === idx ? "current" : "next";
        return (
          <li
            key={stage}
            className={cn(
              "relative flex flex-1 items-start gap-3 py-2.5 md:flex-col md:gap-0 md:py-0 md:pr-4",
            )}
          >
            {/* ось: вертикальная на мобильном, горизонтальная на desktop */}
            <span
              className={cn(
                "absolute left-[5px] top-6 h-[calc(100%-12px)] w-px md:left-0 md:top-[5px] md:h-px md:w-full",
                i === PRODUCTION_STAGES.length - 1 && "hidden",
                i < idx ? "bg-primary/45" : "bg-border",
              )}
            />
            <span
              className={cn(
                "relative z-10 mt-[3px] shrink-0 md:mt-0",
                state === "current"
                  ? "h-[11px] w-[11px] -translate-x-px bg-primary md:-translate-x-0 md:-translate-y-[3px]"
                  : "h-[11px] w-[11px]",
              )}
            >
              {state === "done" ? (
                <span className="block h-full w-full rounded-full border border-primary/50 bg-primary/[0.18]" />
              ) : state === "current" ? (
                <span className="block h-full w-full rounded-[2px] bg-primary ring-4 ring-primary/[0.14]" />
              ) : (
                <span className="block h-full w-full rounded-full border border-border bg-card" />
              )}
            </span>

            <div className="min-w-0 md:mt-3">
              <div className="num text-[10px] tracking-[0.14em] text-muted-foreground/70">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                className={cn(
                  "mt-1 text-[13px] leading-tight",
                  state === "current"
                    ? "font-semibold tracking-[-0.01em] text-primary"
                    : state === "done"
                      ? "text-foreground"
                      : "text-muted-foreground",
                )}
              >
                {stage}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground/80">
                {state === "done" ? "пройден" : state === "current" ? "текущий" : "следующий"}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- CostBreakdown ---------- */

export function CostBreakdown({
  rows,
  total,
}: {
  rows: { label: string; unit: string; total: string; share: number }[];
  total: { label: string; unit: string; total: string };
}) {
  return (
    <div>
      <ul className="divide-y divide-border">
        {rows.map((r) => (
          <li key={r.label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 py-2.5 md:grid-cols-[160px_1fr_110px_120px_44px]">
            <span className="text-[13px] font-medium">{r.label}</span>
            <span className="order-3 col-span-2 h-1.5 overflow-hidden rounded-full bg-muted md:order-none md:col-span-1">
              <span className="block h-full rounded-full bg-primary/60" style={{ width: `${r.share}%` }} />
            </span>
            <span className="num text-right text-[12px] text-muted-foreground md:text-left">{r.unit}</span>
            <span className="num order-4 text-right text-[13px] md:order-none">{r.total}</span>
            <span className="num order-5 hidden text-right text-[12px] text-muted-foreground md:order-none md:block">
              {r.share}%
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-1 grid grid-cols-[1fr_auto] items-center gap-4 border-t border-border pt-3 md:grid-cols-[160px_1fr_110px_120px_44px]">
        <span className="text-[13px] font-semibold">{total.label}</span>
        <span className="hidden md:block" />
        <span className="num hidden text-[12px] text-muted-foreground md:block">{total.unit}</span>
        <span className="num text-right text-[14px] font-semibold">{total.total}</span>
        <span className="hidden md:block" />
      </div>
    </div>
  );
}

/* ---------- DocumentRow ---------- */

export function DocumentRow({
  title,
  version,
  format,
  date,
  onOpen,
}: {
  title: string;
  version?: string | null | undefined;
  format?: string | undefined;
  date?: string | null | undefined;
  onOpen?: (() => void) | undefined;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex min-h-[44px] w-full items-center gap-3 py-2.5 text-left transition-colors hover:bg-muted/40"
    >
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-border bg-muted/50 text-muted-foreground">
        <IconDocument size={14} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium">{title}</span>
        <span className="num mt-0.5 block text-[11px] text-muted-foreground">
          {[format, date].filter(Boolean).join(" · ") || "—"}
        </span>
      </span>
      {version ? <VersionBadge label={version} /> : null}
      <IconDownload size={14} className="ml-1 shrink-0 text-muted-foreground" />
    </button>
  );
}

/* ---------- Timeline ---------- */

export function Timeline({
  items,
}: {
  items: { title: string; date: string; by?: string | null | undefined }[];
}) {
  return (
    <ol className="relative ml-1 border-l border-border pl-5">
      {items.map((it, i) => (
        <li key={i} className="relative pb-4 last:pb-0">
          <span className="absolute -left-[23px] top-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
          <div className="text-[13px]">{it.title}</div>
          <div className="num mt-0.5 text-[11px] text-muted-foreground">
            {[it.date, it.by].filter(Boolean).join(" · ")}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- ModelMark (типографический знак модели вместо фото) ---------- */

export function ModelMark({ code }: { code: string }) {
  const parts = code.split("-");
  return (
    <div className="relative flex h-[88px] items-center justify-center overflow-hidden rounded-[6px] border border-border bg-muted/25">
      <span className="absolute left-0 top-0 h-[2px] w-10 bg-primary/60" />
      <span className="absolute inset-x-3 top-1/2 h-px bg-border" />
      <div className="relative flex flex-col items-center bg-[color-mix(in_oklab,var(--muted)_25%,var(--card))] px-3">
        <span className="num text-[20px] font-semibold tracking-[0.06em]">{parts[0]}</span>
        <span className="num mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {parts[1] ?? ""}
        </span>
      </div>
    </div>
  );
}
