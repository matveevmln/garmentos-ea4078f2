/**
 * GarmentOS — mock data (frontend prototype only).
 * Единственный источник данных прототипа. Никаких выдуманных значений.
 */

export type ProductionStage =
  | "Черновик"
  | "Размещён"
  | "В производстве"
  | "Готово к отгрузке"
  | "Принято";

export type BatchStatus = ProductionStage | "Отменён";

/** Ровно пять производственных этапов. «Отменён» — не этап. */
export const PRODUCTION_STAGES: ProductionStage[] = [
  "Черновик",
  "Размещён",
  "В производстве",
  "Готово к отгрузке",
  "Принято",
];

export type Batch = {
  id: string;
  model: string;
  workshop: string;
  qty: number;
  status: BatchStatus;
  amount: number | null;
  due: string | null;
  overdueDays?: number;
};

export const batches: Batch[] = [
  {
    id: "158",
    model: "Платье «Лана»",
    workshop: "Промода",
    qty: 3000,
    status: "В производстве",
    amount: 2880000,
    due: "28.08.2026",
  },
  {
    id: "157",
    model: "Костюм «Лира»",
    workshop: "Ак-Сай",
    qty: 1800,
    status: "Размещён",
    amount: 1542600,
    due: "25.08.2026",
  },
  {
    id: "156",
    model: "Платье «Миа»",
    workshop: "Швей-Цех",
    qty: 2500,
    status: "В производстве",
    amount: 2145750,
    due: "30.08.2026",
  },
  {
    id: "155",
    model: "Платье «Эми»",
    workshop: "Промода",
    qty: 1200,
    status: "Готово к отгрузке",
    amount: 918240,
    due: "20.08.2026",
    overdueDays: 3,
  },
  {
    id: "154",
    model: "Костюм «Элла»",
    workshop: "Ак-Сай",
    qty: 800,
    status: "Принято",
    amount: 612320,
    due: "15.08.2026",
  },
  {
    id: "153",
    model: "Топ «Софт»",
    workshop: "Швей-Цех",
    qty: 3200,
    status: "Черновик",
    amount: null,
    due: null,
  },
  {
    id: "152",
    model: "Платье «Нора»",
    workshop: "Промода",
    qty: 2000,
    status: "Отменён",
    amount: null,
    due: null,
  },
];

export const dashboardMetrics = [
  { label: "Партий в работе", value: "4" },
  { label: "Просрочено", value: "1", tone: "danger" as const },
  { label: "Неоплаченных счетов", value: "1", tone: "warning" as const },
  { label: "Партий всего", value: "7" },
];

export const attentionItems = [
  {
    id: "a1",
    tone: "danger" as const,
    title: "Партия #155 — Платье «Эми»",
    meta: "Просрочка 3 дн.",
    sub: "Цех Промода",
  },
  {
    id: "a2",
    tone: "warning" as const,
    title: "Счёт по партии #158",
    meta: "864 000 ₽",
    sub: "срок до 28.08.2026",
  },
];

export const recentDocuments = [
  { title: "Спецификация №12", version: "актуальная" as const, date: "10.06.2026" },
  { title: "Спецификация №11", version: "версия 1" as const, date: "08.06.2026" },
  { title: "Спецификация №10", version: null, date: null },
  { title: "Спецификация №9", version: null, date: null },
];

export const recentEvents = [
  "Цех сообщил: в работе",
  "Спецификация №12 сформирована (версия 2)",
  "Заказ подтверждён, Snapshot зафиксирован",
];

/* ---------- Паспорт партии #158 ---------- */

export const passport158 = {
  id: "158",
  model: "Платье «Лана»",
  workshop: "Цех «Промода»",
  qty: 3000,
  status: "В производстве" as ProductionStage,
  money: {
    factCostPerUnit: "988,81 ₽",
    specPricePerUnit: "960,00 ₽",
    note: "себестоимость выше на 28,81 ₽",
    total: "2 880 000 ₽",
    totalFormula: "3 000 шт × 960,00 ₽",
    paid: "2 016 000 ₽",
    paidShare: "70% от суммы",
    rest: "864 000 ₽",
    restShare: "30%",
    restDue: "срок до 28.08.2026",
  },
  attention: {
    title: "Неоплаченный счёт",
    amount: "864 000 ₽",
    due: "срок до 28.08.2026",
  },
  snapshotAt: "10.06.2026 11:20",
  cost: [
    { label: "Ткань", unit: "662,00 ₽/шт", total: "1 986 000 ₽", share: 67 },
    { label: "Пошив", unit: "180,00 ₽/шт", total: "540 000 ₽", share: 18 },
    { label: "Фурнитура", unit: "76,00 ₽/шт", total: "228 000 ₽", share: 8 },
    { label: "Упаковка", unit: "32,00 ₽/шт", total: "96 000 ₽", share: 3 },
    { label: "Прочее", unit: "38,81 ₽/шт", total: "116 430 ₽", share: 4 },
  ],
  costTotal: { label: "Итого себестоимость", unit: "988,81 ₽/шт", total: "2 966 430 ₽" },
  documents: [
    { title: "Спецификация №12", version: "Актуальная" as const, format: "PDF", date: "10.06.2026" },
    { title: "Спецификация №11", version: "Предыдущая версия" as const, format: "PDF", date: "08.06.2026" },
  ],
  colors: [
    { name: "Пудровый", sizes: ["42", "44", "46"], qty: [400, 600, 500] },
    { name: "Графит", sizes: ["42", "44", "46"], qty: [400, 650, 450] },
  ],
  contract: {
    number: "№П-22-04",
    date: "от 22.04.2026",
    customer: "ООО «Мода Лав»",
    contractor: "Цех «Промода»",
    delivery: "Самовывоз",
    terms: [
      "70% в течение 3 рабочих дней после получения счёта",
      "30% при отгрузке",
    ],
  },
  history: [
    { title: "Заказ создан", date: "10.06.2026 09:15", by: "Богдан М." },
    { title: "Заказ подтверждён, Snapshot зафиксирован", date: "11:20", by: null },
    { title: "Спецификация №11 сформирована", date: "08.06.2026", by: null },
    { title: "Спецификация №12 сформирована, версия 2", date: "11:22", by: null },
    { title: "Цех сообщил: в работе", date: "14.06.2026", by: "Цех «Промода»" },
  ],
};

/* ---------- Модели ---------- */

export const models = [
  { name: "Платье «Лана»", code: "DR-LANA", sku: 6, bom: "BOM утверждён" as const },
  { name: "Платье «Миа»", code: "DR-MIA", sku: 9, bom: "BOM утверждён" as const },
  { name: "Костюм «Лира»", code: "ST-LIRA", sku: 6, bom: "BOM утверждён" as const },
  { name: "Топ «Софт»", code: "TP-SOFT", sku: 8, bom: "BOM черновик" as const },
];

/* ---------- Материалы ---------- */

export const materials = [
  { name: "Ткань футер 2-х нитка", code: "FTR-220-001", kind: "ткань", unit: "м", supplier: "Текстиль Плюс" },
  { name: "Подклад вискоза", code: "VSC-130-001", kind: "ткань", unit: "м", supplier: "Текстиль Плюс" },
  { name: "Нитки армированные", code: "THR-40-001", kind: "фурнитура", unit: "шт", supplier: "Фурнитура М" },
  { name: "Бирка тканевая", code: "LBL-01", kind: "фурнитура", unit: "шт", supplier: "Фурнитура М" },
];

/* ---------- Закупки ---------- */

export const purchases = [
  { id: "З-341", supplier: "Текстиль Плюс", positions: "3 позиции", amount: "1 986 000 ₽", status: "Получена", date: "05.06.2026" },
  { id: "З-342", supplier: "Фурнитура М", positions: "2 позиции", amount: "228 000 ₽", status: "Отправлена", date: "18.08.2026" },
  { id: "З-343", supplier: "ПакСервис", positions: "1 позиция", amount: "96 000 ₽", status: "Черновик", date: "срока нет" },
];

export const formatMoney = (v: number | null) =>
  v === null ? "—" : v.toLocaleString("ru-RU").replace(/,/g, " ") + " ₽";

export const formatQty = (v: number) => v.toLocaleString("ru-RU").replace(/,/g, " ");
