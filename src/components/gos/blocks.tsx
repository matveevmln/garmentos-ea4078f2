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
      <div className="text-[11px] uppercase tracking-[0.06em] text-muted-foreground">{label}</div>
      <div
        className={cn(
          "num mt-1.5 text-[20px] font-semibold leading-none",
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

/* ---------- ProductionStepper ---------- */

export function ProductionStepper({ current }: { current: ProductionStage }) {
  const idx = PRODUCTION_STAGES.indexOf(current);
  return (
    <ol className="flex flex-col gap-0 md:flex-row md:items-stretch md:gap-0">
      {PRODUCTION_STAGES.map((stage, i) => {
        const state = i < idx ? "done" : i === idx ? "current" : "next";
        return (
          <li key={stage} className="flex flex-1 items-start gap-2.5 py-2 md:flex-col md:gap-2 md:py-0">
            <div className="flex items-center md:w-full">
              <span
                className={cn(
                  "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                  state === "done" && "border-success/30 bg-success/[0.1] text-success",
                  state === "current" && "border-primary bg-primary text-primary-foreground",
                  state === "next" && "border-border bg-card text-muted-foreground",
                )}
              >
                {state === "done" ? <IconCheck size={12} /> : <span className="num">{i + 1}</span>}
              </span>
              <span
                className={cn(
                  "ml-2 hidden h-[2px] flex-1 rounded md:block",
                  i === PRODUCTION_STAGES.length - 1 && "md:hidden",
                  i < idx ? "bg-success/40" : i === idx ? "bg-primary/30" : "bg-border",
                )}
              />
            </div>
            <div className="min-w-0 md:pr-4">
              <div
                className={cn(
                  "text-[13px] leading-tight",
                  state === "current" ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {stage}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
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
    <div className="relative flex h-[88px] items-center justify-center overflow-hidden rounded-[6px] border border-border bg-muted/30">
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-border) 0 1px, transparent 1px 9px)",
        }}
      />
      <div className="relative flex flex-col items-center">
        <span className="num text-[20px] font-semibold tracking-[0.06em]">{parts[0]}</span>
        <span className="num mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {parts[1] ?? ""}
        </span>
      </div>
    </div>
  );
}
