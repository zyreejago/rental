import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import { Landing } from "./Landing";
import { Manager } from "./Manager";

export function App() {
  const [view, setView] = useState<"landing" | "kelola">("landing");
  const settings = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.getSettings({}),
  });
  const fleet = useQuery({
    queryKey: ["fleet"],
    queryFn: () => api.listFleet({}),
  });
  const s = settings.data?.settings ?? null;
  const brand = s?.businessName || "Rental Bali";

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans text-[var(--text)]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/92 pt-safe backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
          <button
            onClick={() => setView("landing")}
            className="flex min-w-0 items-center gap-2.5 text-left"
            aria-label="Ke halaman utama"
          >
            <span className="font-display flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[var(--text)] text-base font-extrabold text-[var(--bg)]">
              {brand.charAt(0).toUpperCase()}
            </span>
            <span className="truncate">
              <span className="font-display block truncate text-base font-bold leading-tight">
                {brand}
              </span>
              <span className="hidden font-mono text-[10px] font-medium text-[var(--dim)] min-[420px]:block">
                Rental kendaraan · Bali
              </span>
            </span>
          </button>
          <nav
            className="flex shrink-0 items-center gap-0.5 rounded-md border border-[var(--border)] bg-[var(--surface)] p-0.5"
            aria-label="Pindah tampilan"
          >
            <button
              onClick={() => setView("landing")}
              aria-pressed={view === "landing"}
              className={`rounded px-3.5 py-1.5 text-xs font-bold transition sm:px-4 sm:text-sm ${
                view === "landing"
                  ? "bg-[var(--text)] text-[var(--bg)]"
                  : "text-[var(--dim)] hover:text-[var(--text)]"
              }`}
            >
              <span className="sm:hidden">Landing</span>
              <span className="hidden sm:inline">Landing Page</span>
            </button>
            <button
              onClick={() => setView("kelola")}
              aria-pressed={view === "kelola"}
              className={`rounded px-3.5 py-1.5 text-xs font-bold transition sm:px-4 sm:text-sm ${
                view === "kelola"
                  ? "bg-[var(--text)] text-[var(--bg)]"
                  : "text-[var(--dim)] hover:text-[var(--text)]"
              }`}
            >
              <span className="sm:hidden">Kelola</span>
              <span className="hidden sm:inline">Kelola Rental</span>
            </button>
          </nav>
        </div>
      </header>

      {view === "landing" ? (
        <main>
          <Landing
            settings={s}
            vehicles={fleet.data?.vehicles ?? []}
            onOpenManager={() => setView("kelola")}
          />
        </main>
      ) : (
        <main>
          <Manager settings={s} />
        </main>
      )}

      <footer className="border-t border-[var(--border)] bg-[var(--ink)] py-8 text-[var(--ink-dim)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 text-xs sm:px-8">
          <p>
            <span className="font-display text-sm font-bold text-[var(--ink-text)]">
              {brand}
            </span>{" "}
            · Rental kendaraan di Bali
            {s?.baseLocation ? ` · ${s.baseLocation}` : ""}
          </p>
          <p className="font-mono text-[11px]">
            {s?.whatsapp ? `WhatsApp ${s.whatsapp}` : ""}
            {s?.whatsapp && s?.email ? " · " : ""}
            {s?.email ?? ""}
          </p>
        </div>
      </footer>
    </div>
  );
}
