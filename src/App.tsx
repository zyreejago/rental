import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import { Landing } from "./Landing";
import { Manager } from "./Manager";
import { WA_GENERAL } from "./data";

type View = "situs" | "kelola";

const NAV_ITEMS = [
  { id: "armada", label: "Armada" },
  { id: "keunggulan", label: "Keunggulan" },
  { id: "cara-sewa", label: "Cara Sewa" },
  { id: "testimoni", label: "Testimoni" },
  { id: "faq", label: "FAQ" },
] as const;

export function App() {
  const [view, setView] = useState<View>("situs");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  const settings = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.getSettings({}),
  });
  const s = settings.data?.settings ?? null;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y > lastY.current && y > 180) {
        setHidden(true);
      } else if (y < lastY.current) {
        setHidden(false);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goSection = (id: string) => {
    setView("situs");
    window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 90);
  };

  const goHome = () => {
    setView("situs");
    window.setTimeout(
      () => window.scrollTo({ top: 0, behavior: "smooth" }),
      60,
    );
  };

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`transition-colors duration-300 ${
            scrolled
              ? "border-b border-[#0e14331a] bg-white/85 backdrop-blur-md"
              : "border-b border-transparent bg-white/0"
          }`}
        >
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
            <button
              onClick={goHome}
              aria-label="ZeeRental, kembali ke atas"
              className="shrink-0 font-display text-[22px] font-extrabold tracking-tight text-ink"
            >
              ZeeRental<span className="text-primary">.</span>
            </button>

            {view === "situs" && (
              <nav
                className="hidden items-center gap-1 lg:flex"
                aria-label="Navigasi situs"
              >
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => goSection(item.id)}
                    className="rounded-full px-3.5 py-2 text-sm font-semibold text-ink-muted transition hover:bg-lavender hover:text-ink"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            )}

            <div className="flex shrink-0 items-center gap-2.5">
              <div
                className="flex items-center gap-1 rounded-full border border-[#0e14331a] bg-fog p-1"
                role="group"
                aria-label="Pindah tampilan"
              >
                <button
                  onClick={() => setView("situs")}
                  aria-pressed={view === "situs"}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-bold transition ${
                    view === "situs"
                      ? "bg-primary text-white"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  Situs
                </button>
                <button
                  onClick={() => setView("kelola")}
                  aria-pressed={view === "kelola"}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-bold transition ${
                    view === "kelola"
                      ? "bg-primary text-white"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className="sm:hidden">Kelola</span>
                  <span className="hidden sm:inline">Kelola Rental</span>
                </button>
              </div>
              <a
                href={WA_GENERAL}
                target="_blank"
                rel="noreferrer"
                className="shadow-hard hidden rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover md:inline-flex"
              >
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </header>

      {view === "situs" ? (
        <main>
          <Landing onOpenManager={() => setView("kelola")} />
        </main>
      ) : (
        <main>
          <Manager settings={s} />
        </main>
      )}

      <footer className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-9 sm:px-8">
          <p className="text-sm text-white/60">
            <span className="font-display text-base font-extrabold text-white">
              ZeeRental
            </span>{" "}
            · Sewa mobil dan motor di Bali
            {s?.baseLocation ? ` · ${s.baseLocation}` : ""}
          </p>
          <p className="font-mono text-[11px] text-white/50">
            {s?.whatsapp ? `WhatsApp ${s.whatsapp}` : ""}
            {s?.whatsapp && s?.email ? " · " : ""}
            {s?.email ?? ""}
          </p>
        </div>
      </footer>
    </div>
  );
}
