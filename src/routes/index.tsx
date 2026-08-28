import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, type ScreenKey } from "@/components/gos/shell";
import {
  BatchesScreen,
  FinanceScreen,
  HomeScreen,
  MaterialsScreen,
  ModelsScreen,
  PassportScreen,
  PurchasesScreen,
  SectionEmptyScreen,
  StatesScreen,
} from "@/components/gos/screens";

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
  batches: "Партии",
  passport: "Паспорт партии #158",
  models: "Модели",
  workshops: "Цеха",
  materials: "Материалы",
  purchases: "Закупки",
  warehouses: "Склады",
  suppliers: "Поставщики",
  documents: "Документы",
  finance: "Финансы",
  states: "Состояния интерфейса",
};

function GarmentOS() {
  const [screen, setScreen] = useState<ScreenKey>("home");

  const openBatch = (id: string) => {
    setScreen(id === "158" ? "passport" : "batches");
  };

  return (
    <AppShell active={screen} onNavigate={setScreen} topbarTitle={SCREEN_TITLES[screen]}>
      {screen === "home" ? <HomeScreen onOpenBatch={openBatch} /> : null}
      {screen === "batches" ? <BatchesScreen onOpenBatch={openBatch} /> : null}
      {screen === "passport" ? <PassportScreen onBack={() => setScreen("batches")} /> : null}
      {screen === "models" ? <ModelsScreen /> : null}
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
          title="Документы"
          description="Единый реестр документов пока не сформирован. Документы по партиям доступны в паспорте соответствующей партии."
        />
      ) : null}
    </AppShell>
  );
}
