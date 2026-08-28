import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IconSearch } from "./icons";
import type { ScreenKey } from "./shell";

export type PaletteItem = {
  key: ScreenKey;
  label: string;
  group: string;
  hint?: string;
};

export function CommandPalette({
  open,
  onClose,
  items,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  items: PaletteItem[];
  onSelect: (k: ScreenKey) => void;
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) => i.label.toLowerCase().includes(q) || (i.hint ?? "").toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setCursor(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(results.length - 1, c + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(0, c - 1));
      }
      if (e.key === "Enter") {
        const it = results[cursor];
        if (it) {
          e.preventDefault();
          onSelect(it.key);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, cursor, onClose, onSelect]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="anim-overlay absolute inset-0 bg-foreground/35 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-label="Быстрый переход"
        className="anim-dialog glass-panel relative w-full max-w-[560px] overflow-hidden rounded-[12px]"
      >
        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <IconSearch size={16} className="shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder="Перейти к разделу…"
            className="h-12 w-full bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
          />
          <kbd className="micro hidden shrink-0 rounded-[4px] border border-border px-1.5 py-1 sm:block">
            esc
          </kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto py-1.5">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-[12.5px] text-muted-foreground">
              Ничего не найдено
            </p>
          ) : (
            results.map((it, i) => (
              <button
                key={it.key}
                type="button"
                onMouseEnter={() => setCursor(i)}
                onClick={() => {
                  onSelect(it.key);
                  onClose();
                }}
                className={cn(
                  "flex min-h-[44px] w-full items-center gap-3 px-4 text-left transition-colors duration-150",
                  i === cursor ? "bg-primary/[0.08]" : "hover:bg-muted",
                )}
              >
                <span
                  className={cn(
                    "h-4 w-[2px] rounded-full transition-opacity duration-150",
                    i === cursor ? "bg-primary opacity-100" : "opacity-0",
                  )}
                />
                <span className="t-object flex-1 truncate">{it.label}</span>
                <span className="micro shrink-0">{it.group}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
