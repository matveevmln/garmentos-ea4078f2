import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  attentionItems,
  batches,
  dashboardMetrics,
  formatMoney,
  formatQty,
  materials,
  models,
  purchases,
  recentDocuments,
  recentEvents,
  type Batch,
} from "@/data/garmentos";
import {
  AccessDeniedState,
  Accordion,
  AttentionList,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  DataTable,
  Drawer,
  EmptyState,
  ErrorState,
  FilterChips,
  LoadingState,
  MetricStrip,
  MobileListItem,
  PageHeader,
  SearchField,
  SectionLabel,
  StatusBadge,
  Td,
} from "./ui";
import { CostBreakdown, DocumentRow, ModelMark, MoneyBlock, ProductionStepper, Timeline } from "./blocks";
import {
  IconAlert,
  IconChevronRight,
  IconDocument,
  IconFinance,
  IconInbox,
  IconMaterial,
} from "./icons";
import { passport158 } from "@/data/garmentos";

/* =========================== ГЛАВНАЯ =========================== */

export function HomeScreen({ onOpenBatch }: { onOpenBatch: (id: string) => void }) {
  const inWork = batches.filter((b) => ["158", "157", "156", "155"].includes(b.id));

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Главная"
        subtitle="Что требует внимания сегодня"
        breadcrumbs={<Breadcrumbs items={[{ label: "GarmentOS" }, { label: "Главная" }]} />}
      />

      <MetricStrip items={dashboardMetrics} />

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card padded={false}>
            <div className="px-4 pt-4 md:px-5">
              <CardHeader title="Требует внимания" hint="2 позиции" />
            </div>
            <div className="px-4 md:px-5">
              <AttentionList
                items={attentionItems}
                onSelect={(id) => onOpenBatch(id === "a1" ? "155" : "158")}
              />
            </div>
          </Card>

          <Card padded={false}>
            <div className="flex items-baseline justify-between px-4 pt-4 md:px-5">
              <CardHeader title="Партии в работе" hint="4" />
            </div>

            {/* desktop / tablet */}
            <div className="mt-3 hidden md:block">
              <table className="w-full border-collapse text-[13px]">
                <tbody className="divide-y divide-border border-t border-border">
                  {inWork.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => onOpenBatch(b.id)}
                      className="cursor-pointer transition-colors hover:bg-muted/40"
                    >
                      <Td className="w-[68px]">
                        <span className="num font-medium">#{b.id}</span>
                      </Td>
                      <Td>{b.model}</Td>
                      <Td className="text-muted-foreground">{b.workshop}</Td>
                      <Td align="right" className="num w-[110px] text-muted-foreground">
                        {formatQty(b.qty)} шт
                      </Td>
                      <Td align="right" className="num w-[130px] text-muted-foreground">
                        {b.due ? `до ${b.due}` : "—"}
                      </Td>
                      <Td align="right" className="w-[180px]">
                        <StatusBadge status={b.status} />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* mobile */}
            <div className="mt-3 space-y-2 px-4 pb-4 md:hidden">
              {inWork.map((b) => (
                <MobileListItem key={b.id} onClick={() => onOpenBatch(b.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="num text-[12px] text-muted-foreground">#{b.id}</div>
                      <div className="mt-0.5 text-[13px] font-medium">{b.model}</div>
                      <div className="mt-1 text-[12px] text-muted-foreground">{b.workshop}</div>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="num mt-2.5 flex items-center justify-between border-t border-border pt-2 text-[12px] text-muted-foreground">
                    <span>{formatQty(b.qty)} шт</span>
                    <span>{b.due ? `до ${b.due}` : "срока нет"}</span>
                  </div>
                </MobileListItem>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card padded={false}>
            <div className="px-4 pt-4 md:px-5">
              <CardHeader title="Последние документы" />
            </div>
            <div className="divide-y divide-border px-4 md:px-5">
              {recentDocuments.map((d) => (
                <DocumentRow key={d.title} title={d.title} version={d.version} date={d.date} />
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Последние события" />
            <ul className="mt-3 space-y-2.5">
              {recentEvents.map((e) => (
                <li key={e} className="flex gap-2.5 text-[13px]">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =========================== ПАРТИИ =========================== */

const FILTERS = ["Все", "В производстве", "Размещены", "Готовы", "Принято"];
const FILTER_MAP: Record<string, string | null> = {
  Все: null,
  "В производстве": "В производстве",
  Размещены: "Размещён",
  Готовы: "Готово к отгрузке",
  Принято: "Принято",
};

export function BatchesScreen({ onOpenBatch }: { onOpenBatch: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Все");

  const rows = useMemo(() => {
    const status = FILTER_MAP[filter];
    const q = query.trim().toLowerCase();
    return batches.filter((b) => {
      if (status && b.status !== status) return false;
      if (!q) return true;
      return (
        b.id.includes(q) ||
        b.model.toLowerCase().includes(q) ||
        b.workshop.toLowerCase().includes(q)
      );
    });
  }, [query, filter]);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Партии"
        subtitle={`${batches.length} партий в системе`}
        breadcrumbs={<Breadcrumbs items={[{ label: "GarmentOS" }, { label: "Партии" }]} />}
      />

      <div className="mb-3 flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Поиск по номеру, модели или цеху"
          className="md:w-[340px]"
        />
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="Ничего не найдено"
          description="По заданным условиям поиска и фильтрам партий нет. Измените запрос или сбросьте фильтр."
          action={
            <Button
              onClick={() => {
                setQuery("");
                setFilter("Все");
              }}
            >
              Сбросить фильтры
            </Button>
          }
          compact
        />
      ) : (
        <>
          {/* desktop / tablet table */}
          <div className="hidden md:block">
            <DataTable
              columns={[
                { key: "id", label: "№", width: "72px" },
                { key: "model", label: "Модель" },
                { key: "workshop", label: "Цех", width: "140px" },
                { key: "qty", label: "Кол-во", align: "right", width: "100px" },
                { key: "status", label: "Статус", width: "180px" },
                { key: "amount", label: "Сумма", align: "right", width: "150px" },
                { key: "due", label: "Срок", align: "right", width: "150px" },
              ]}
            >
              {rows.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => onOpenBatch(b.id)}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  <Td>
                    <span className="num font-medium">#{b.id}</span>
                  </Td>
                  <Td>{b.model}</Td>
                  <Td className="text-muted-foreground">{b.workshop}</Td>
                  <Td align="right" className="num">
                    {formatQty(b.qty)}
                  </Td>
                  <Td>
                    <StatusBadge status={b.status} />
                  </Td>
                  <Td align="right" className={cn("num", b.amount === null && "text-muted-foreground")}>
                    {b.amount === null ? "не определена" : formatMoney(b.amount)}
                  </Td>
                  <Td align="right">
                    {b.due ? (
                      <span className="num">
                        {b.due}
                        {b.overdueDays ? (
                          <span className="mt-0.5 block text-[11px] text-danger">
                            просрочено на {b.overdueDays} дня
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">срока нет</span>
                    )}
                  </Td>
                </tr>
              ))}
            </DataTable>
          </div>

          {/* mobile list cards */}
          <div className="space-y-2 md:hidden">
            {rows.map((b) => (
              <MobileListItem key={b.id} onClick={() => onOpenBatch(b.id)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="num text-[12px] text-muted-foreground">#{b.id}</div>
                    <div className="mt-0.5 text-[13px] font-medium">{b.model}</div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <dl className="num mt-2.5 grid grid-cols-2 gap-y-1.5 border-t border-border pt-2.5 text-[12px]">
                  <dt className="text-muted-foreground">Цех</dt>
                  <dd className="text-right">{b.workshop}</dd>
                  <dt className="text-muted-foreground">Количество</dt>
                  <dd className="text-right">{formatQty(b.qty)} шт</dd>
                  <dt className="text-muted-foreground">Сумма</dt>
                  <dd className="text-right">{b.amount === null ? "не определена" : formatMoney(b.amount)}</dd>
                  <dt className="text-muted-foreground">Срок</dt>
                  <dd className={cn("text-right", b.overdueDays && "text-danger")}>
                    {b.due ?? "срока нет"}
                    {b.overdueDays ? ` · просрочено на ${b.overdueDays} дня` : ""}
                  </dd>
                </dl>
              </MobileListItem>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* =========================== ПАСПОРТ ПАРТИИ =========================== */

export function PassportScreen({ onBack }: { onBack: () => void }) {
  const p = passport158;
  const [tab, setTab] = useState<"cost" | "docs" | "colors" | "contract" | "history">("cost");
  const [sheet, setSheet] = useState<null | "invoice">(null);

  const tabs = [
    { key: "cost", label: "Себестоимость" },
    { key: "docs", label: "Документы" },
    { key: "colors", label: "Размеры и цвета" },
    { key: "contract", label: "Договор" },
    { key: "history", label: "История" },
  ] as const;

  const detail = (key: typeof tab) => {
    if (key === "cost")
      return (
        <div>
          <div className="num mb-3 text-[11px] text-muted-foreground">
            Snapshot зафиксирован: {p.snapshotAt} · больше не пересчитывается
          </div>
          <CostBreakdown rows={p.cost} total={p.costTotal} />
        </div>
      );
    if (key === "docs")
      return (
        <div className="divide-y divide-border">
          {p.documents.map((d) => (
            <DocumentRow key={d.title} title={d.title} version={d.version} format={d.format} date={d.date} />
          ))}
        </div>
      );
    if (key === "colors")
      return (
        <div className="space-y-4">
          {p.colors.map((c) => (
            <div key={c.name}>
              <SectionLabel>{c.name}</SectionLabel>
              <div className="mt-2 grid grid-cols-3 gap-px overflow-hidden rounded-[6px] border border-border bg-border">
                {c.sizes.map((s, i) => (
                  <div key={s} className="bg-card px-3 py-2.5 text-center">
                    <div className="num text-[11px] text-muted-foreground">{s}</div>
                    <div className="num mt-1 text-[16px] font-semibold">{c.qty[i]}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    if (key === "contract")
      return (
        <dl className="grid grid-cols-1 gap-y-2.5 text-[13px] sm:grid-cols-[180px_1fr]">
          <dt className="text-muted-foreground">Договор</dt>
          <dd className="num">
            {p.contract.number} {p.contract.date}
          </dd>
          <dt className="text-muted-foreground">Заказчик</dt>
          <dd>{p.contract.customer}</dd>
          <dt className="text-muted-foreground">Исполнитель</dt>
          <dd>{p.contract.contractor}</dd>
          <dt className="text-muted-foreground">Доставка</dt>
          <dd>{p.contract.delivery}</dd>
          <dt className="text-muted-foreground">Условия оплаты</dt>
          <dd>
            {p.contract.terms.map((t) => (
              <div key={t}>{t}</div>
            ))}
          </dd>
        </dl>
      );
    return <Timeline items={p.history} />;
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "GarmentOS" },
              { label: "Партии", onClick: onBack },
              { label: `#${p.id}` },
            ]}
          />
        }
        title={`#${p.id} · ${p.model}`}
        subtitle={
          <span className="num">
            {p.workshop} · {formatQty(p.qty)} изделий
          </span>
        }
        actions={
          <>
            <Button onClick={onBack}>К списку</Button>
            <Button variant="primary" onClick={() => setSheet("invoice")}>
              Счёт к оплате
            </Button>
          </>
        }
      />

      {/* 1. Идентичность */}
      <Card className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-3">
          <span className="num inline-flex h-9 items-center rounded-[6px] border border-border bg-muted/50 px-2.5 text-[16px] font-semibold">
            #{p.id}
          </span>
          <div>
            <div className="text-[16px] font-semibold leading-tight">{p.model}</div>
            <div className="text-[12px] text-muted-foreground">{p.workshop}</div>
          </div>
        </div>
        <div className="h-8 w-px bg-border max-md:hidden" />
        <div>
          <SectionLabel>Количество</SectionLabel>
          <div className="num mt-1 text-[14px] font-medium">{formatQty(p.qty)} изделий</div>
        </div>
        <div className="ml-auto">
          <StatusBadge status={p.status} />
        </div>
      </Card>

      {/* 2. Деньги */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card padded={false}>
          <div className="px-4 pt-4 md:px-5">
            <CardHeader title="Деньги" hint="по партии" />
          </div>
          <div className="mt-2 grid grid-cols-1 gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
            <div className="bg-card">
              <MoneyBlock
                label="Сумма партии"
                value={p.money.total}
                sub={p.money.totalFormula}
              />
            </div>
            <div className="bg-card">
              <MoneyBlock label="Оплачено" value={p.money.paid} sub={p.money.paidShare} />
            </div>
            <div className="bg-card">
              <MoneyBlock
                label="Остаток к оплате"
                value={p.money.rest}
                sub={`${p.money.restShare} · ${p.money.restDue}`}
                tone="warning"
              />
            </div>
            <div className="bg-card">
              <MoneyBlock
                label="Себестоимость факт"
                value={p.money.factCostPerUnit}
                sub={`цена спецификации ${p.money.specPricePerUnit} · ${p.money.note}`}
              />
            </div>
          </div>
        </Card>

        {/* 4. Требует внимания */}
        <Card className="border-warning/30 bg-warning/[0.03]">
          <CardHeader title="Требует внимания" hint="1 позиция" />
          <div className="mt-3 flex items-start gap-3">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-warning/[0.1] text-warning">
              <IconAlert size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium">{p.attention.title}</div>
              <div className="num mt-1 text-[20px] font-semibold text-warning">{p.attention.amount}</div>
              <div className="num mt-1 text-[11px] text-muted-foreground">{p.attention.due}</div>
            </div>
          </div>
          <div className="mt-4">
            <Button size="sm" onClick={() => setSheet("invoice")}>
              Открыть счёт
            </Button>
          </div>
        </Card>
      </div>

      {/* 3. Производство */}
      <Card className="mt-4">
        <CardHeader title="Производство" hint="5 этапов" />
        <div className="mt-4">
          <ProductionStepper current={p.status} />
        </div>
      </Card>

      {/* 5. Детали — desktop tabs */}
      <div className="mt-4 hidden md:block">
        <Card padded={false}>
          <div className="flex flex-wrap gap-1 border-b border-border px-3 pt-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "relative -mb-px h-9 rounded-t-[6px] px-3 text-[13px] transition-colors",
                  tab === t.key
                    ? "border-b-2 border-primary font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="p-5">{detail(tab)}</div>
        </Card>
      </div>

      {/* 5. Детали — mobile accordions */}
      <div className="mt-4 space-y-2 md:hidden">
        {tabs.map((t) => (
          <Accordion key={t.key} title={t.label}>
            {detail(t.key)}
          </Accordion>
        ))}
      </div>

      <Drawer open={sheet === "invoice"} onClose={() => setSheet(null)} title="Счёт по партии #158">
        <div className="space-y-4">
          <MoneyBlock
            label="К оплате"
            value={p.attention.amount}
            sub={`${p.money.restShare} · ${p.money.restDue}`}
            tone="warning"
            className="rounded-[6px] border border-border"
          />
          <div className="divide-y divide-border rounded-[6px] border border-border px-3">
            <div className="flex items-center justify-between py-2.5 text-[13px]">
              <span className="text-muted-foreground">Сумма партии</span>
              <span className="num">{p.money.total}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 text-[13px]">
              <span className="text-muted-foreground">Оплачено</span>
              <span className="num">{p.money.paid}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 text-[13px]">
              <span className="text-muted-foreground">Остаток</span>
              <span className="num font-medium">{p.money.rest}</span>
            </div>
          </div>
          <div className="divide-y divide-border rounded-[6px] border border-border px-3">
            {p.documents.map((d) => (
              <DocumentRow key={d.title} title={d.title} version={d.version} format={d.format} date={d.date} />
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
}

/* =========================== МОДЕЛИ =========================== */

export function ModelsScreen() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Модели"
        subtitle={`${models.length} модели в системе`}
        breadcrumbs={<Breadcrumbs items={[{ label: "GarmentOS" }, { label: "Модели" }]} />}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {models.map((m) => (
          <Card key={m.code} className="transition-colors hover:border-primary/30">
            <ModelMark code={m.code} />
            <div className="mt-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[13px] font-semibold">{m.name}</div>
                <div className="num mt-0.5 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  {m.code}
                </div>
              </div>
              <span className="num text-[12px] text-muted-foreground">{m.sku} SKU</span>
            </div>
            <div className="mt-3 border-t border-border pt-3">
              <StatusBadge status={m.bom} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* =========================== МАТЕРИАЛЫ =========================== */

export function MaterialsScreen() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Материалы"
        subtitle={`${materials.length} позиции в справочнике`}
        breadcrumbs={<Breadcrumbs items={[{ label: "GarmentOS" }, { label: "Материалы" }]} />}
      />

      <div className="hidden md:block">
        <DataTable
          columns={[
            { key: "name", label: "Наименование" },
            { key: "code", label: "Артикул", width: "180px" },
            { key: "kind", label: "Тип", width: "140px" },
            { key: "unit", label: "Ед.", width: "80px" },
            { key: "supplier", label: "Поставщик", width: "200px" },
          ]}
        >
          {materials.map((m) => (
            <tr key={m.code} className="transition-colors hover:bg-muted/40">
              <Td className="font-medium">{m.name}</Td>
              <Td className="num text-muted-foreground">{m.code}</Td>
              <Td className="text-muted-foreground">{m.kind}</Td>
              <Td className="num text-muted-foreground">{m.unit}</Td>
              <Td className="text-muted-foreground">{m.supplier}</Td>
            </tr>
          ))}
        </DataTable>
      </div>

      <div className="space-y-2 md:hidden">
        {materials.map((m) => (
          <MobileListItem key={m.code}>
            <div className="text-[13px] font-medium">{m.name}</div>
            <div className="num mt-0.5 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              {m.code}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[12px] text-muted-foreground">
              <span>
                {m.kind} · {m.unit}
              </span>
              <span>{m.supplier}</span>
            </div>
          </MobileListItem>
        ))}
      </div>

      <div className="mt-4">
        <EmptyState
          icon={<IconMaterial size={18} />}
          title="Остатки материалов пока не подключены"
          description="Справочник материалов уже ведётся, но складской учёт остатков в системе не активирован. Данные по наличию и расходу появятся после подключения складов."
          compact
        />
      </div>
    </div>
  );
}

/* =========================== ЗАКУПКИ =========================== */

export function PurchasesScreen() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Закупки"
        subtitle={`${purchases.length} заказа поставщикам`}
        breadcrumbs={<Breadcrumbs items={[{ label: "GarmentOS" }, { label: "Закупки" }]} />}
      />

      <div className="hidden md:block">
        <DataTable
          columns={[
            { key: "id", label: "№", width: "110px" },
            { key: "supplier", label: "Поставщик" },
            { key: "pos", label: "Позиции", width: "140px" },
            { key: "amount", label: "Сумма", align: "right", width: "160px" },
            { key: "status", label: "Статус", width: "160px" },
            { key: "date", label: "Дата", align: "right", width: "140px" },
          ]}
        >
          {purchases.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-muted/40">
              <Td className="num font-medium">{p.id}</Td>
              <Td>{p.supplier}</Td>
              <Td className="text-muted-foreground">{p.positions}</Td>
              <Td align="right" className="num">
                {p.amount}
              </Td>
              <Td>
                <StatusBadge status={p.status} />
              </Td>
              <Td align="right" className="num text-muted-foreground">
                {p.date}
              </Td>
            </tr>
          ))}
        </DataTable>
      </div>

      <div className="space-y-2 md:hidden">
        {purchases.map((p) => (
          <MobileListItem key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="num text-[13px] font-medium">{p.id}</div>
                <div className="mt-0.5 text-[12px] text-muted-foreground">{p.supplier}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="num mt-2.5 flex items-center justify-between border-t border-border pt-2 text-[12px]">
              <span className="text-muted-foreground">{p.positions}</span>
              <span>{p.amount}</span>
            </div>
            <div className="num mt-1 text-right text-[11px] text-muted-foreground">{p.date}</div>
          </MobileListItem>
        ))}
      </div>
    </div>
  );
}

/* =========================== ФИНАНСЫ =========================== */

export function FinanceScreen() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Финансы"
        subtitle="Раздел подготовлен, данные ещё не подключены"
        breadcrumbs={<Breadcrumbs items={[{ label: "GarmentOS" }, { label: "Финансы" }]} />}
      />
      <EmptyState
        icon={<IconFinance size={18} />}
        title="Финансовых данных в системе пока нет"
        description="Раздел будет заполнен, когда в GarmentOS появятся подтверждённые платежи и счета. До этого момента система намеренно не показывает расчётных показателей — только фактические данные."
      />
    </div>
  );
}

/* =========================== ПУСТЫЕ РАЗДЕЛЫ =========================== */

export function SectionEmptyScreen({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title={title}
        subtitle="Данных в системе пока нет"
        breadcrumbs={<Breadcrumbs items={[{ label: "GarmentOS" }, { label: title }]} />}
      />
      <EmptyState
        icon={<IconInbox size={18} />}
        title={`Раздел «${title}» пока пуст`}
        description={description}
      />
    </div>
  );
}

/* =========================== СОСТОЯНИЯ =========================== */

export function StatesScreen() {
  const [reloadKey, setReloadKey] = useState(0);
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Состояния интерфейса"
        subtitle="Демонстрационная область: загрузка, пустой список, ошибка загрузки, нет прав доступа"
        breadcrumbs={<Breadcrumbs items={[{ label: "GarmentOS" }, { label: "Состояния" }]} />}
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Загрузка" hint="скелетоны" />
          <div className="mt-4">
            <LoadingState />
          </div>
        </Card>
        <Card>
          <CardHeader title="Пустой список" />
          <div className="mt-4">
            <EmptyState
              icon={<IconDocument size={18} />}
              title="Партий пока нет"
              description="Здесь появятся партии, как только вы разместите первый заказ в цехе."
              compact
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Ошибка загрузки" />
          <div className="mt-4" key={reloadKey}>
            <ErrorState onRetry={() => setReloadKey((k) => k + 1)} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Нет прав доступа" />
          <div className="mt-4">
            <AccessDeniedState />
          </div>
        </Card>
      </div>
    </div>
  );
}

export type { Batch };
export const BatchArrow = IconChevronRight;
