import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, type ScreenKey } from "@/components/gos/shell";
import {
  FinanceScreen,
  MaterialsScreen,
  PassportScreen,
  PurchasesScreen,
  SectionEmptyScreen,
  StatesScreen,
} from "@/components/gos/screens";
import { ModelDetail, ProductionBatches, ProductionHome, ProductionModels } from "@/components/gos/production-lab";

const TITLE = "GarmentOS — операционная система бренда одежды";
const DESCRIPTION =
  "GarmentOS — рабочая среда владельца бренда одежды: партии в подрядных цехах, паспорт партии, модели, материалы, закупки и финансы в одном интерфейсе.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GarmentOS,
});

const SCREEN_TITLES: Record<ScreenKey, string> = {
  home: "Главная",
  batches: "Заказы",
  passport: "Паспорт партии #158",
  models: "Модели",
  modelDetail: "Модель",
  workshops: "Цеха",
  materials: "Материалы",
  purchases: "Закупки",
  warehouses: "Склады",
  suppliers: "Поставщики",
  documents: "Спецификации",
  finance: "Финансы",
  states: "Состояния интерфейса",
};

function GarmentOS() {
  const [screen, setScreen] = useState<ScreenKey>("home");
  const [modelCode, setModelCode] = useState("DR-LANA");

  const openBatch = (id: string) => {
    setScreen(id === "158" ? "passport" : "batches");
  };

  return (
    <AppShell active={screen} onNavigate={setScreen} topbarTitle={SCREEN_TITLES[screen]}>
      <div key={screen} className="anim-content">
      {screen === "home" ? <ProductionHome onOpenBatch={openBatch} onNavigate={setScreen} /> : null}
      {screen === "batches" ? <ProductionBatches onOpenBatch={openBatch} /> : null}
      {screen === "passport" ? <PassportScreen onBack={() => setScreen("batches")} /> : null}
      {screen === "models" ? <ProductionModels onOpenModel={(code) => { setModelCode(code); setScreen("modelDetail"); }} /> : null}
      {screen === "modelDetail" ? <ModelDetail code={modelCode} onBack={() => setScreen("models")} onOpenBatch={openBatch} /> : null}
      {screen === "materials" ? <MaterialsScreen /> : null}
      {screen === "purchases" ? <PurchasesScreen /> : null}
      {screen === "finance" ? <FinanceScreen /> : null}
      {screen === "states" ? <StatesScreen /> : null}
      {screen === "workshops" ? (
        <SectionEmptyScreen
          title="Цеха"
          description="Справочник подрядных цехов пока не заполнен. Здесь появятся цеха, с которыми работает бренд, вместе с их партиями."
        />
      ) : null}
      {screen === "warehouses" ? (
        <SectionEmptyScreen
          title="Склады"
          description="Складской учёт пока не подключён. Здесь появятся склады и остатки, когда раздел будет активирован."
        />
      ) : null}
      {screen === "suppliers" ? (
        <SectionEmptyScreen
          title="Поставщики"
          description="Карточки поставщиков пока не заведены. Здесь появятся контрагенты, у которых бренд закупает материалы и фурнитуру."
        />
      ) : null}
      {screen === "documents" ? (
        <SectionEmptyScreen
          title="Спецификации"
          description="В реестре появятся утверждённые спецификации и нормы расхода материалов по моделям."
        />
      ) : null}
      </div>
    </AppShell>
  );
}
