import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  attentionItems,
  formatQty,
  modelProduction,
  models,
  productionBatches,
  recentDocuments,
  recentEvents,
  type ColorBreakdown,
  type ProductionBatch,
} from "@/data/garmentos";
import lanaImage from "@/assets/model-lana.jpg";
import liraImage from "@/assets/model-lira.jpg";
import miaImage from "@/assets/model-mia.jpg";
import softImage from "@/assets/model-soft.jpg";
import { IconAlert, IconBatch, IconChevronDown, IconChevronRight, IconDocument, IconModel } from "./icons";
import { AttentionList, Breadcrumbs, Button, Card, CardHeader, Drawer, PageHeader, StatusBadge } from "./ui";
import { DocumentRow, Timeline } from "./blocks";

const modelImages: Record<string, string> = {
  "DR-LANA": lanaImage,
  "ST-LIRA": liraImage,
  "DR-MIA": miaImage,
  "TP-SOFT": softImage,
  "DR-EMI": miaImage,
};

const toneClass: Record<ColorBreakdown["tone"], string> = {
  powder: "bg-swatch-powder",
  graphite: "bg-swatch-graphite",
  wine: "bg-swatch-wine",
  ivory: "bg-swatch-ivory",
  sage: "bg-swatch-sage",
};

function ModelThumb({ code, name, large = false }: { code: string; name: string; large?: boolean }) {
  return (
    <div className={cn("shrink-0 overflow-hidden border border-border bg-muted", large ? "h-28 w-24 rounded-[16px] sm:h-36 sm:w-28" : "h-[68px] w-[58px] rounded-[10px]") }>
      <img src={modelImages[code] ?? lanaImage} alt={name} width={768} height={768} loading="lazy" className="h-full w-full object-cover" />
    </div>
  );
}

function SizePill({ size, qty }: { size: string; qty: number }) {
  return (
    <span className="size-pill inline-grid h-9 grid-cols-[auto_auto] overflow-hidden rounded-[8px] border border-border bg-card text-[12px]">
      <span className="num grid min-w-11 place-items-center bg-muted px-2.5 font-medium text-muted-foreground">{size}</span>
      <span className="num grid min-w-11 place-items-center px-2.5 font-semibold text-foreground">{qty}</span>
    </span>
  );
}

export function Breakdown({ colors }: { colors: ColorBreakdown[] }) {
  return (
    <div className="space-y-2.5">
      {colors.map((color) => (
        <section key={color.name} className="breakdown-color rounded-[12px] border border-border p-3.5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className={cn("swatch-dot h-3.5 w-3.5 shrink-0 rounded-full border border-foreground/10", toneClass[color.tone])} />
              <h4 className="truncate text-[14px] font-semibold">{color.name}</h4>
            </div>
            <span className="num rounded-[6px] border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-foreground shadow-[var(--shadow-1)]">{formatQty(color.total)} шт.</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {color.sizes.map((item) => <SizePill key={item.size} {...item} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

export function BatchCard({ batch, onOpen }: { batch: ProductionBatch; onOpen?: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [completed, setCompleted] = useState(batch.status === "Принято");
  const inSheet = batch.colors.length >= 3;
  const toggleBreakdown = () => inSheet ? setSheetOpen(true) : setExpanded((value) => !value);

  return (
    <article className="surface-card batch-card overflow-hidden rounded-[16px]">
      <div className="batch-card__top p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <button type="button" onClick={() => onOpen?.(batch.id)} className="focus-ring min-w-0 rounded-[6px] text-left">
            <span className="t-id block text-[11px] font-medium text-primary">{batch.number}</span>
            <span className="mt-1.5 block truncate text-[17px] font-semibold leading-tight">{batch.model}</span>
          </button>
          <StatusBadge status={batch.status} className="shrink-0 max-[390px]:px-2" />
        </div>

        <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-3">
          <ModelThumb code={batch.modelCode} name={batch.model} />
          <div className="min-w-0 self-center">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <span className="eyebrow block text-[9px]">Спецификация</span>
                <strong className="num mt-1 block truncate text-[12px] font-medium">{batch.specification}</strong>
              </div>
              <div className="min-w-0 text-right">
                <span className="eyebrow block text-[9px]">Цех</span>
                <strong className="mt-1 block truncate text-[12px] font-medium">{batch.workshop}</strong>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 border-t border-border/70 pt-2.5">
              {batch.colors.slice(0, 3).map((color) => <span key={color.name} className={cn("swatch-dot h-2.5 w-2.5 rounded-full border border-foreground/10", toneClass[color.tone])} title={color.name} />)}
              <span className="t-meta ml-1 truncate">{batch.colors.map((color) => color.name).join(" · ")}</span>
            </div>
          </div>
        </div>

        <div className="batch-metrics mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-[11px] border border-border bg-border">
          <div className="bg-card px-3 py-3"><span className="eyebrow text-[9px]">Срок</span><strong className={cn("num mt-1.5 block text-[13px]", batch.overdueDays && "text-danger")}>{batch.due ?? "не назначен"}</strong></div>
          <div className="bg-card px-3 py-3 text-right"><span className="eyebrow text-[9px]">Всего единиц</span><strong className="num mt-1 block text-[21px] leading-none">{formatQty(batch.qty)} <small className="text-[10px] font-normal text-muted-foreground">шт.</small></strong></div>
        </div>
      </div>

      <div className="batch-card__actions grid grid-cols-[auto_minmax(0,1fr)] items-center border-t border-border">
        <button type="button" role="switch" aria-checked={completed} aria-label="Завершён" onClick={() => setCompleted((value) => !value)} className="completion-toggle focus-ring group flex min-h-12 items-center gap-2 border-r border-border px-3.5 text-[10px] font-semibold uppercase text-muted-foreground">
          <span className={cn("toggle-track relative h-5 w-9 rounded-full", completed && "is-on")}><span className="absolute left-[3px] top-[3px] h-3.5 w-3.5 rounded-full bg-card shadow-[var(--shadow-1)]" /></span>
          <span>Завершён</span>
        </button>
        <button type="button" onClick={toggleBreakdown} aria-expanded={inSheet ? sheetOpen : expanded} className="interactive focus-ring flex min-h-12 min-w-0 items-center justify-end gap-2 px-3.5 text-[12.5px] font-medium text-primary hover:bg-primary/[0.06]">
          <span className="truncate">{expanded && !inSheet ? "Скрыть раскладку" : "Показать раскладку"}</span>
          <IconChevronDown size={15} className={cn("shrink-0 transition-transform duration-200", expanded && !inSheet && "rotate-180", inSheet && "-rotate-90")} />
        </button>
      </div>
      {!inSheet ? <div className={cn("collapsible", expanded && "collapsible-open")}><div><div className="border-t border-border p-3.5"><Breakdown colors={batch.colors} /></div></div></div> : null}
      <Drawer open={sheetOpen} onClose={() => setSheetOpen(false)} title={`${batch.number} · раскладка`}>
        <div className="batch-sheet-summary mb-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[12px] border border-border p-3"><ModelThumb code={batch.modelCode} name={batch.model} /><div className="min-w-0"><div className="t-object truncate">{batch.model}</div><div className="mt-1 text-[11px] text-muted-foreground">{batch.colors.length} цвета</div></div><div className="text-right"><span className="eyebrow text-[9px]">Итого</span><strong className="num mt-1 block text-[20px] leading-none">{formatQty(batch.qty)}</strong></div></div>
        <Breakdown colors={batch.colors} />
      </Drawer>
    </article>
  );
}

export function ProductionHome({ onOpenBatch, onNavigate }: { onOpenBatch: (id: string) => void; onNavigate: (key: "models" | "documents" | "batches") => void }) {
  const inWork = productionBatches.filter((batch) => batch.status === "В производстве").reduce((sum, batch) => sum + batch.qty, 0);
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Производство" subtitle="Оперативная картина по моделям и партиям" breadcrumbs={<Breadcrumbs items={[{ label: "GarmentOS" }, { label: "Главная" }]} />} />
      <section className="production-summary overflow-hidden rounded-[16px] bg-sidebar p-5 text-sidebar-foreground md:p-7">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div><span className="eyebrow text-sidebar-foreground/45">Сейчас в работе</span><div className="num mt-3 text-[42px] font-medium leading-none sm:text-[52px]">{formatQty(inWork)} <small className="text-[15px] font-normal text-sidebar-foreground/55">изделий</small></div><p className="mt-3 max-w-xl text-[13px] text-sidebar-foreground/60">2 партии находятся непосредственно в производстве, ещё 2 требуют контроля до завершения.</p></div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[12px] border border-sidebar-border bg-sidebar-border"><div className="bg-sidebar-accent px-4 py-3"><span className="micro text-sidebar-foreground/40">Активно</span><strong className="num mt-2 block text-[22px]">4</strong></div><div className="bg-sidebar-accent px-4 py-3"><span className="micro text-sidebar-foreground/40">Моделей</span><strong className="num mt-2 block text-[22px]">4</strong></div><div className="bg-sidebar-accent px-4 py-3"><span className="micro text-sidebar-foreground/40">Просрочено</span><strong className="num mt-2 block text-[22px] text-danger">1</strong></div></div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.8fr)]">
        <section><div className="mb-3 flex items-center justify-between"><div><h2 className="t-section">Активные партии</h2><p className="t-meta mt-1">Сначала ближайшие сроки и отклонения</p></div><Button variant="ghost" size="sm" onClick={() => onNavigate("batches")}>Все партии</Button></div><div className="grid gap-3 lg:grid-cols-2">{productionBatches.map((batch) => <BatchCard key={batch.id} batch={batch} onOpen={onOpenBatch} />)}</div></section>
        <aside className="space-y-4">
          <Card padded={false} className="overflow-hidden"><div className="flex items-center gap-2 bg-sidebar px-4 py-3.5 text-sidebar-foreground"><IconAlert size={15} className="text-sidebar-primary" /><CardHeader title="Требует внимания" hint="2" /></div><div className="px-4"><AttentionList items={attentionItems} onSelect={(id) => onOpenBatch(id === "a1" ? "155" : "158")} /></div></Card>
          <Card><CardHeader title="Быстрые действия" /><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => onNavigate("models")} className="quick-action"><IconModel size={18} /><span>Модели</span></button><button onClick={() => onNavigate("documents")} className="quick-action"><IconDocument size={18} /><span>Спецификации</span></button><button onClick={() => onNavigate("batches")} className="quick-action col-span-2"><IconBatch size={18} /><span>Все производственные партии</span></button></div></Card>
          <Card padded={false}><div className="px-4 pt-4"><CardHeader title="Последние спецификации" /></div><div className="divide-y divide-border px-4">{recentDocuments.slice(0, 3).map((doc) => <DocumentRow key={doc.title} title={doc.title} version={doc.version} date={doc.date} />)}</div></Card>
        </aside>
      </div>
    </div>
  );
}

export function ProductionBatches({ onOpenBatch }: { onOpenBatch: (id: string) => void }) {
  const [filter, setFilter] = useState("Все");
  const shown = useMemo(() => filter === "Все" ? productionBatches : productionBatches.filter((batch) => batch.status === filter), [filter]);
  return <div className="mx-auto max-w-[1200px]"><PageHeader title="Производственные партии" subtitle="Цвето-размерная раскладка доступна прямо из списка" breadcrumbs={<Breadcrumbs items={[{ label: "GarmentOS" }, { label: "Заказы" }]} />} /><div className="mb-4 flex flex-wrap gap-2">{["Все", "В производстве", "Размещён", "Готово к отгрузке"].map((item) => <button key={item} onClick={() => setFilter(item)} className={cn("interactive focus-ring min-h-9 rounded-full border px-3 text-[12px]", filter === item ? "border-primary/30 bg-primary/[0.1] text-primary" : "border-border bg-card text-muted-foreground")}>{item}</button>)}</div><div className="grid gap-3 lg:grid-cols-2">{shown.map((batch) => <BatchCard key={batch.id} batch={batch} onOpen={onOpenBatch} />)}</div></div>;
}

export function ProductionModels({ onOpenModel }: { onOpenModel: (code: string) => void }) {
  return <div className="mx-auto max-w-[1400px]"><PageHeader title="Модели" subtitle="Коллекция через призму производственной активности" breadcrumbs={<Breadcrumbs items={[{ label: "GarmentOS" }, { label: "Модели" }]} />} /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{models.map((model) => { const stats = modelProduction.find((item) => item.code === model.code); return <button key={model.code} onClick={() => onOpenModel(model.code)} className="model-card focus-ring group overflow-hidden rounded-[16px] text-left"><div className="aspect-[4/3] overflow-hidden bg-muted"><img src={modelImages[model.code]} alt={model.name} width={768} height={768} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" /></div><div className="p-4"><div className="flex items-start justify-between gap-2"><div><h2 className="text-[15px] font-semibold">{model.name}</h2><p className="t-id mt-1">{model.code}</p></div><IconChevronRight size={16} className="mt-1 text-muted-foreground transition-transform group-hover:translate-x-1" /></div><StatusBadge status={model.bom} className="mt-3" /><div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-border bg-border"><div className="bg-card p-2.5"><span className="eyebrow text-[9px]">Партий</span><strong className="num mt-1 block text-[16px]">{stats?.batches ?? 0}</strong></div><div className="bg-card p-2.5"><span className="eyebrow text-[9px]">В работе</span><strong className="num mt-1 block text-[16px] text-primary">{stats?.active ?? 0}</strong></div></div></div></button>; })}</div></div>;
}

export function ModelDetail({ code, onBack, onOpenBatch }: { code: string; onBack: () => void; onOpenBatch: (id: string) => void }) {
  const model = models.find((item) => item.code === code);
  const stats = modelProduction.find((item) => item.code === code);
  const [tab, setTab] = useState<"production" | "passport" | "materials" | "history">("production");
  if (!model || !stats) return null;
  const linked = productionBatches.filter((batch) => batch.modelCode === model.code);
  const tabs = [{ key: "production", label: "Производство" }, { key: "passport", label: "Паспорт" }, { key: "materials", label: "Материалы" }, { key: "history", label: "История" }] as const;
  return <div className="mx-auto max-w-[1200px]"><button onClick={onBack} className="focus-ring mb-3 rounded-[6px] text-[12px] text-muted-foreground hover:text-foreground">← К моделям</button><section className="surface-card rounded-[16px] p-4 sm:p-6"><div className="flex items-start gap-4 sm:gap-6"><ModelThumb code={model.code} name={model.name} large /><div className="min-w-0 flex-1"><span className="eyebrow">{stats.category}</span><h1 className="t-page mt-2">{model.name}</h1><p className="t-id mt-2">{model.code}</p><StatusBadge status={stats.status} className="mt-4" /></div></div><div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-border bg-border sm:grid-cols-5">{[{ label: "Произведено", value: formatQty(stats.produced) }, { label: "Партий", value: stats.batches }, { label: "В работе", value: stats.active }, { label: "Цветов", value: stats.colors }, { label: "Размеров", value: stats.sizes }].map((item) => <div key={item.label} className="bg-card p-3"><span className="eyebrow text-[9px]">{item.label}</span><strong className="num mt-2 block text-[19px]">{item.value}</strong></div>)}</div></section><div className="sticky top-[60px] z-10 mt-4 flex overflow-hidden rounded-[12px] border border-border bg-card/90 p-1 backdrop-blur-xl">{tabs.map((item) => <button key={item.key} onClick={() => setTab(item.key)} className={cn("focus-ring min-h-10 flex-1 rounded-[9px] px-2 text-[11.5px] font-medium", tab === item.key ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted")}>{item.label}</button>)}</div><div key={tab} className="anim-content mt-4">{tab === "production" ? <div className="grid gap-3 lg:grid-cols-2">{linked.length ? linked.map((batch) => <BatchCard key={batch.id} batch={batch} onOpen={onOpenBatch} />) : <Card><CardHeader title="Активных партий нет" hint="модель готова к размещению" /></Card>}</div> : tab === "passport" ? <Card><CardHeader title="Паспорт модели" /><dl className="mt-4 grid grid-cols-[auto_1fr] gap-3 text-[13px]"><dt className="text-muted-foreground">Артикул</dt><dd className="num text-right">{model.code}</dd><dt className="text-muted-foreground">Категория</dt><dd className="text-right">{stats.category}</dd><dt className="text-muted-foreground">Спецификация</dt><dd className="text-right">{model.bom}</dd></dl></Card> : tab === "materials" ? <Card><CardHeader title="Нормы расхода материалов" /><p className="t-secondary mt-3">Детализация материалов доступна в актуальной спецификации модели.</p></Card> : <Card><CardHeader title="История модели" /><div className="mt-4"><Timeline items={recentEvents.map((title, index) => ({ title, date: ["14.06.2026", "10.06.2026", "10.06.2026"][index] ?? "10.06.2026" }))} /></div></Card>}</div></div>;
}