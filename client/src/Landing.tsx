import { useMemo, useState } from "react";
import heroBali from "./assets/hero-bali.jpg";
import ubudImg from "./assets/ubud.jpg";
import cangguImg from "./assets/canggu.jpg";
import uluwatuImg from "./assets/uluwatu.jpg";
import gateImg from "./assets/gate.webp";
import coverSkuter from "./assets/cover-skuter.jpg";
import coverCity from "./assets/cover-city.jpg";
import coverMpv from "./assets/cover-mpv.jpg";
import coverSuv from "./assets/cover-suv.png";
import {
CATEGORIES,
rp,
waLink,
type Settings,
type Vehicle,
} from "./lib";

export const COVERS: Record<string, string> = {
  skuter: coverSkuter,
  city: coverCity,
  mpv: coverMpv,
  suv: coverSuv,
  premium: coverSuv,
};

export function vehicleImage(v: Vehicle): string {
  if (v.cover === "custom" && v.imageUrl) return v.imageUrl;
  return COVERS[v.cover] ?? COVERS[v.category] ?? coverCity;
}

const AREAS = [
  {
    name: "Ubud",
    desc: "Sawah berundak, galeri seni, dan jalan pegunungan yang tenang.",
    img: ubudImg,
    alt: "Sawah berundak Tegallalang di Ubud saat pagi berkabut",
  },
  {
    name: "Canggu",
    desc: "Pantai surf, kafe, dan suasana santai untuk tinggal lebih lama.",
    img: cangguImg,
    alt: "Peselancar di Pantai Canggu, Bali",
  },
  {
    name: "Uluwatu",
    desc: "Tebing dramatis, pura di atas karang, dan matahari terbenam terbaik.",
    img: uluwatuImg,
    alt: "Pura Uluwatu di atas tebing saat matahari terbenam",
  },
  {
    name: "Bali Timur",
    desc: "Gerbang Lempuyang dan jalur gunung untuk penjelajah sejati.",
    img: gateImg,
    alt: "Gerbang Pura Lempuyang dengan latar Gunung Agung",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Pilih kendaraan & tanggal",
    desc: "Lihat armada yang tampil di halaman ini, catat nama unit dan tanggal sewa yang kamu mau.",
  },
  {
    n: "02",
    title: "Chat WhatsApp",
    desc: "Kirim pesan lewat tombol WhatsApp. Tim kami cek ketersediaan dan kunci jadwal untukmu.",
  },
  {
    n: "03",
    title: "Serah terima di lokasimu",
    desc: "Unit diantar bersih dan siap jalan ke hotel, villa, atau bandara. Deposit sesuai ketentuan WNI atau WNA.",
  },
  {
    n: "04",
    title: "Jelajahi Bali, kembali santai",
    desc: "Perpanjang sewa cukup lewat chat. Pengembalian bisa di lokasi berbeda sesuai kesepakatan.",
  },
];

function SectionHead({
  index,
  title,
  aside,
}: {
  index: string;
  title: string;
  aside?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2 border-b-2 border-[var(--text)] pb-4">
      <h2 className="font-display flex items-baseline gap-3 text-3xl font-bold text-[var(--text)] sm:text-4xl">
        <span className="font-mono text-sm font-semibold text-[var(--accent)]">
          {index}
        </span>
        {title}
      </h2>
      {aside ? (
        <p className="max-w-sm text-sm leading-relaxed text-[var(--dim)]">
          {aside}
        </p>
      ) : null}
    </div>
  );
}

export function Landing({
  settings,
  vehicles,
  onOpenManager,
}: {
  settings: Settings | null;
  vehicles: Vehicle[];
  onOpenManager: () => void;
}) {
  const [category, setCategory] = useState<string>("semua");

  const active = useMemo(
    () => vehicles.filter((v) => v.status !== "nonaktif"),
    [vehicles],
  );
  const featured = useMemo(() => active.filter((v) => v.featured), [active]);
  const shown = useMemo(() => {
    const base = featured.length > 0 ? featured : active;
    return category === "semua"
      ? base
      : base.filter((v) => v.category === category);
  }, [active, featured, category]);
  const availableCount = active.filter((v) => v.status === "tersedia").length;
  const cats = useMemo(
    () => ["semua", ...Array.from(new Set(active.map((v) => v.category)))],
    [active],
  );
  const name = settings?.businessName || "Rental Kendaraan Bali";
  const wa = settings?.whatsapp ?? "";
  const areas = settings?.serviceAreas
    ? settings.serviceAreas.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-24 sm:px-8 sm:pt-28">
          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7 lg:pt-4">
              <p className="flex items-center gap-2.5 font-mono text-xs font-medium text-[var(--dim)]">
                <span className="h-2 w-2 bg-[var(--accent)]" aria-hidden="true" />
                Rental kendaraan — Bali, Indonesia
              </p>
              <h1 className="font-display mt-5 text-[42px] font-extrabold leading-[1.02] text-[var(--text)] sm:text-6xl lg:text-[64px]">
                Jelajahi Bali dengan kendaraan terbaiknya.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--dim)] sm:text-lg">
                {settings?.tagline ||
                  "Armada terawat, harga transparan, dan antar jemput ke seluruh Bali. Dari skuter lincah untuk Canggu sampai SUV premium untuk keluarga."}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {wa ? (
                  <a
                    href={waLink(wa, `Halo ${name}, saya mau tanya ketersediaan kendaraan untuk sewa di Bali.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-white transition hover:brightness-110"
                  >
                    Booking via WhatsApp
                  </a>
                ) : null}
                <a
                  href="#armada"
                  className="rounded-md border border-[var(--text)] px-6 py-3.5 text-sm font-bold text-[var(--text)] transition hover:bg-[var(--text)] hover:text-[var(--bg)]"
                >
                  Lihat armada
                </a>
              </div>
              <p className="mt-8 font-mono text-xs leading-relaxed text-[var(--dim)]">
                Antar ke hotel, villa &amp; bandara / Deposit jelas di awal /
                Lepas kunci atau dengan sopir
              </p>
            </div>
            <figure className="lg:col-span-5">
              <img
                src={heroBali}
                alt="Pantai berpasir putih dan laut toska dilihat dari atas di Bali"
                className="aspect-[4/3] w-full rounded-lg object-cover lg:aspect-auto lg:h-[420px]"
              />
              <figcaption className="mt-2.5 flex items-center justify-between font-mono text-[11px] text-[var(--dim)]">
                <span>Pantai pasir putih, Bali selatan</span>
                <span>
                  {settings?.baseLocation
                    ? `Base: ${settings.baseLocation}`
                    : "Antar se-Bali"}
                </span>
              </figcaption>
            </figure>
          </div>

          {/* fleet figures — plain ruled row, values come from the fleet data */}
          <dl className="mt-12 grid grid-cols-3 divide-x divide-[var(--border)] border-y border-[var(--border)]">
            <div className="px-4 py-5 sm:px-6">
              <dd className="font-display text-3xl font-extrabold text-[var(--text)] sm:text-4xl">
                {active.length}
              </dd>
              <dt className="mt-1 text-xs font-medium text-[var(--dim)]">
                Unit armada
              </dt>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <dd className="font-display text-3xl font-extrabold text-[var(--accent)] sm:text-4xl">
                {availableCount}
              </dd>
              <dt className="mt-1 text-xs font-medium text-[var(--dim)]">
                Siap sewa hari ini
              </dt>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <dd className="font-display text-3xl font-extrabold text-[var(--text)] sm:text-4xl">
                {areas.length > 0 ? areas.length : "—"}
              </dd>
              <dt className="mt-1 text-xs font-medium text-[var(--dim)]">
                Area antar jemput
              </dt>
            </div>
          </dl>
        </div>
      </section>

      {/* ---------- FLEET ---------- */}
      <section id="armada" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20">
        <SectionHead
          index="01"
          title="Armada"
          aside="Tarif per hari tampil apa adanya, termasuk tarif mingguan dan bulanan bila tersedia. Deposit dibedakan untuk penyewa WNI dan WNA."
        />

        {cats.length > 2 && (
          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter kategori armada">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`rounded-md px-4 py-2 text-xs font-bold transition ${
                  category === c
                    ? "bg-[var(--text)] text-[var(--bg)]"
                    : "border border-[var(--border)] bg-[var(--surface)] text-[var(--dim)] hover:border-[var(--text)] hover:text-[var(--text)]"
                }`}
              >
                {c === "semua" ? "Semua" : (CATEGORIES[c] ?? c)}
              </button>
            ))}
          </div>
        )}

        {active.length === 0 ? (
          <div className="mt-10 border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center">
            <p className="font-display text-2xl font-bold text-[var(--text)]">
              Armada sedang disiapkan
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--dim)]">
              Pemilik belum menampilkan kendaraan. Kalau kamu pemilik usaha ini,
              masuk ke panel pengelola untuk menambahkan unit pertamamu, lengkap
              dengan tarif dan deposit.
            </p>
            <button
              onClick={onOpenManager}
              className="mt-6 rounded-md bg-[var(--text)] px-6 py-3 text-sm font-bold text-[var(--bg)]"
            >
              Buka panel pengelola
            </button>
          </div>
        ) : shown.length === 0 ? (
          <p className="mt-10 bg-[var(--surface)] px-6 py-10 text-center text-sm text-[var(--dim)]">
            Belum ada unit di kategori ini.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((v) => (
              <article
                key={v.id}
                className="flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--text)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={vehicleImage(v)}
                    alt={`Foto ilustrasi kategori untuk ${v.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute left-3 top-3 flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-bold ${
                      v.status === "tersedia"
                        ? "bg-white text-emerald-800"
                        : "bg-white text-orange-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        v.status === "tersedia" ? "bg-emerald-600" : "bg-orange-500"
                      }`}
                      aria-hidden="true"
                    />
                    {v.status === "tersedia" ? "Siap sewa" : "Dalam perawatan"}
                  </span>
                  {v.featured && (
                    <span className="absolute right-3 top-3 rounded bg-[var(--text)] px-2.5 py-1 text-[11px] font-bold text-[var(--bg)]">
                      Unggulan
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-bold leading-snug text-[var(--text)]">
                    {v.name}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] font-medium uppercase text-[var(--dim)]">
                    {CATEGORIES[v.category] ?? v.category}
                    {v.year ? ` · ${v.year}` : ""} ·{" "}
                    {v.transmission === "matic" ? "Matic" : "Manual"}
                    {v.seats ? ` · ${v.seats} kursi` : ""}
                    {v.fuel ? ` · ${v.fuel}` : ""}
                  </p>
                  <div className="mt-4 border-t border-[var(--border)] pt-4">
                    <p className="flex items-baseline gap-1.5">
                      <span className="font-display text-[22px] font-extrabold text-[var(--text)]">
                        {rp(v.dailyRate)}
                      </span>
                      <span className="text-xs text-[var(--dim)]">/ hari</span>
                    </p>
                    {(v.weeklyRate || v.monthlyRate) && (
                      <p className="mt-1 text-xs text-[var(--dim)]">
                        {v.weeklyRate ? `Mingguan ${rp(v.weeklyRate)}` : ""}
                        {v.weeklyRate && v.monthlyRate ? " · " : ""}
                        {v.monthlyRate ? `Bulanan ${rp(v.monthlyRate)}` : ""}
                      </p>
                    )}
                    <p className="mt-2 font-mono text-[11px] text-[var(--dim)]">
                      Deposit WNI {rp(v.depositWni)} · WNA {rp(v.depositWna)}
                    </p>
                  </div>
                  {wa && v.status === "tersedia" ? (
                    <a
                      href={waLink(
                        wa,
                        `Halo ${name}, saya mau sewa ${v.name}. Boleh info ketersediaannya?`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Sewa ${v.name} via WhatsApp`}
                      className="mt-5 block rounded-md bg-[var(--accent)] py-3 text-center text-sm font-bold text-white transition hover:brightness-110"
                    >
                      Sewa unit ini
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
        {featured.length > 0 && active.length > featured.length && (
          <p className="mt-6 text-xs text-[var(--dim)]">
            Menampilkan unit unggulan. Semua unit dan tarif lengkap tersedia saat
            chat dengan tim kami.
          </p>
        )}
      </section>

      {/* ---------- AREAS ---------- */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <SectionHead
            index="02"
            title="Area antar jemput"
            aside="Unit diantar ke tempatmu menginap dan dijemput saat selesai, tanpa perlu datang ke garasi."
          />
          {areas.length > 0 && (
            <p className="mt-5 font-mono text-xs leading-loose text-[var(--dim)]">
              {areas.join("  ·  ")}
            </p>
          )}
          <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {AREAS.map((a) => (
              <figure key={a.name}>
                <img
                  src={a.img}
                  alt={a.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
                <figcaption className="mt-3">
                  <p className="font-display text-lg font-bold text-[var(--text)]">
                    {a.name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--dim)]">
                    {a.desc}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS + CTA ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHead
          index="03"
          title="Cara sewa"
          aside="Empat langkah dari pilih unit sampai kendaraan kembali. Semua lewat WhatsApp, tanpa formulir panjang."
        />
        <ol className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="border-t-2 border-[var(--text)] pt-4">
              <p className="font-mono text-sm font-semibold text-[var(--accent)]">
                {s.n}
              </p>
              <h3 className="mt-2.5 text-base font-bold text-[var(--text)]">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--dim)]">
                {s.desc}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-16 rounded-lg bg-[var(--ink)] px-6 py-10 text-[var(--ink-text)] sm:px-10">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
                Siap mulai perjalananmu di Bali?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-dim)]">
                Ceritakan tanggal dan area menginapmu, tim kami carikan unit
                yang paling pas. Tanpa biaya tersembunyi, deposit jelas di awal.
              </p>
              <p className="mt-4 font-mono text-[11px] text-[var(--ink-dim)]">
                {settings?.baseLocation
                  ? `Garasi utama: ${settings.baseLocation}`
                  : "Antar jemput: bandara, hotel, dan villa di seluruh Bali"}
                {settings?.email ? ` · ${settings.email}` : ""}
              </p>
            </div>
            {wa ? (
              <a
                href={waLink(wa, `Halo ${name}, saya mau sewa kendaraan di Bali. Boleh dibantu?`)}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-md bg-[var(--accent)] px-7 py-4 text-sm font-bold text-white transition hover:brightness-110"
              >
                Chat WhatsApp sekarang
              </a>
            ) : (
              <button
                onClick={onOpenManager}
                className="shrink-0 rounded-md bg-[var(--accent)] px-7 py-4 text-sm font-bold text-white"
              >
                Atur kontak di panel pengelola
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
