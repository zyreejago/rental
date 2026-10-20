import { useState, type ReactNode } from "react";
import {
  BUSINESS,
  FAQS,
  IMAGES,
  INCLUDED,
  STEPS,
  TESTIMONIALS,
  VEHICLES,
  WA_GENERAL,
  formatRupiah,
  waLink,
  type VehicleKind,
} from "./data";

/* ---------- potongan kecil bergaya tikuma ---------- */

function Marker({ children }: { children: ReactNode }) {
  return <span className="marker">{children}</span>;
}

function Scribble({
  text,
  className = "",
  flip = false,
  bob = false,
}: {
  text: string;
  className?: string;
  flip?: boolean;
  bob?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 hidden select-none lg:block ${className}`}
    >
      <div className="-rotate-6">
        <div className={bob ? "animate-bob" : ""}>
          <p className="font-hand text-[27px] leading-none text-ink">{text}</p>
          <svg
            width="54"
            height="42"
            viewBox="0 0 54 42"
            fill="none"
            className={`mt-1.5 ${flip ? "-scale-x-100" : ""}`}
          >
            <path
              d="M7 3 C 17 20, 27 30, 44 34"
              stroke="#0e1433"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M35 26 L45 35 L32 37"
              stroke="#0e1433"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
      {children}
    </p>
  );
}

const HERO_STATS = [
  { value: "±15 menit", label: "unit diantar ke area kota Denpasar" },
  { value: "100%", label: "harga final, tanpa biaya siluman" },
  { value: "5 hari kerja", label: "batas maksimal deposit Anda kembali" },
];

const AREAS = [
  "Denpasar",
  "Ubud",
  "Canggu",
  "Seminyak",
  "Uluwatu",
  "Sanur",
  "Bandara Ngurah Rai",
];

/* ---------- halaman situs ---------- */

export function Landing({
  onOpenManager,
}: {
  onOpenManager: () => void;
}) {
  const [kind, setKind] = useState<"Semua" | VehicleKind>("Semua");
  const [openFaq, setOpenFaq] = useState(0);
  const shown =
    kind === "Semua" ? VEHICLES : VEHICLES.filter((v) => v.kind === kind);

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="bg-grid relative overflow-hidden">
        <Scribble
          text="beneran diantar, bukan janji"
          bob
          className="right-[2%] top-28 xl:right-[6%]"
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-32 text-center sm:px-8 sm:pt-40">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-muted">
            Sewa mobil &amp; motor · Denpasar, Bali
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-[42px] font-extrabold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[72px]">
            Keliling Bali tanpa drama,
            <br className="hidden sm:block" /> kendaraannya{" "}
            <Marker>kami yang urus</Marker>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            ZeeRental mengantar mobil dan motor terawat ke hotel, villa, atau
            bandara Anda. Harga yang disepakati di chat adalah harga yang Anda
            bayar, dan depositnya jelas dari awal. Tidak ada tambahan diam-diam
            di akhir.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#armada"
              className="shadow-hard rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              Lihat armada
            </a>
            <a
              href={WA_GENERAL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#0e14331a] bg-white px-7 py-3.5 text-sm font-bold text-ink transition hover:bg-lavender"
            >
              Chat WhatsApp
            </a>
          </div>

          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 border-t border-[#0e14331a] pt-9 min-[560px]:grid-cols-3">
            {HERO_STATS.map((s) => (
              <div key={s.label}>
                <dd className="font-display text-4xl font-extrabold tracking-tight text-ink">
                  {s.value}
                </dd>
                <dt className="mx-auto mt-1.5 max-w-[210px] text-sm leading-snug text-ink-muted">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= STRIP AREA ================= */}
      <section
        aria-label="Area layanan"
        className="overflow-hidden border-y border-[#0e14331a] bg-white py-6"
      >
        <p className="px-5 text-center font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink-muted">
          Area yang sudah kami layani setiap hari
        </p>
        <div className="marquee-mask relative mt-4 overflow-hidden">
          <div className="animate-marquee flex w-max items-center">
            {[...AREAS, ...AREAS].map((a, i) => (
              <span
                key={`${a}-${i}`}
                className="flex items-center whitespace-nowrap font-display text-lg font-bold text-ink"
              >
                <span className="px-6">{a}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ARMADA ================= */}
      <section id="armada" className="mx-auto max-w-6xl scroll-mt-24 px-3 py-8 sm:px-5">
        <div className="relative rounded-[2.5rem] bg-fog px-5 py-14 sm:px-10 sm:py-20">
          <Scribble
            text="depositnya tertulis, bukan kira-kira"
            flip
            className="right-[3%] top-8"
          />
          <div className="max-w-2xl">
            <SectionLabel>Armada ZeeRental</SectionLabel>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Mau sewa apa?
            </h2>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Mobil buat rombongan, motor buat berdua. Semua harga di bawah ini
              harga lepas kunci per hari, sudah termasuk antar ke area kota.
              Tinggal pilih, sisanya kami yang jalan.
            </p>
          </div>

          <div
            className="mt-8 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter jenis kendaraan"
          >
            {(["Semua", "Mobil", "Motor"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                aria-pressed={kind === k}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                  kind === k
                    ? "bg-ink text-white"
                    : "border border-[#0e14331a] bg-white text-ink-muted hover:bg-lavender hover:text-ink"
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((v) => (
              <article
                key={v.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#0e14331a] bg-white"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={v.image}
                    alt={`Foto ${v.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-mono text-[11px] font-semibold text-ink backdrop-blur">
                    {v.kind}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 transition-colors group-hover:bg-lavender">
                  <h3 className="font-display text-xl font-extrabold leading-snug text-ink">
                    {v.name}
                  </h3>
                  <p className="mt-1.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                    {v.specs.join(" · ")}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                    {v.note}
                  </p>
                  <div className="mt-4 border-t border-[#0e14331a] pt-4">
                    <p className="flex items-baseline gap-1.5">
                      <span className="font-mono text-[22px] font-semibold text-ink">
                        {formatRupiah(v.pricePerDay)}
                      </span>
                      <span className="text-xs text-ink-muted">/ hari</span>
                    </p>
                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-ink-muted">
                      Deposit WNI {formatRupiah(v.depositWni)}
                      <br />
                      Deposit WNA {formatRupiah(v.depositWna)}
                    </p>
                  </div>
                  <a
                    href={waLink(
                      `Halo ZeeRental, saya mau sewa ${v.name} (${formatRupiah(v.pricePerDay)}/hari). Boleh info ketersediaannya?`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Sewa ${v.name} via WhatsApp`}
                    className="shadow-hard mt-5 block rounded-full bg-primary py-3 text-center text-sm font-bold text-white transition hover:bg-primary-hover"
                  >
                    Sewa unit ini
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= KEUNGGULAN ================= */}
      <section id="keunggulan" className="bg-grid scroll-mt-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2">
          <div>
            <SectionLabel>Keunggulan</SectionLabel>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Yang selalu Anda dapat
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-ink-muted">
              Ini bukan bonus dan bukan janji manis. Lima hal ini standar di
              setiap sewa, mau Anda ambil motor termurah atau mobil termahal
              kami.
            </p>
            <ul className="mt-8 space-y-5">
              {INCLUDED.map((item) => (
                <li key={item.title} className="flex gap-3.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 12.5 L9.5 18 L20 6.5"
                        stroke="#0a7a55"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="font-bold text-ink">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <Scribble
              text="selalu serinci ini"
              bob
              className="-top-11 left-2"
            />
            <div className="shadow-hard overflow-hidden rounded-2xl border border-[#0e14331a] bg-white">
              <img
                src={IMAGES.gate}
                alt="Gerbang pura di Bali dengan latar pegunungan"
                loading="lazy"
                className="h-44 w-full object-cover"
              />
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
                    Ringkasan booking · contoh
                  </p>
                  <span className="rounded-full bg-mint px-3 py-1 text-[11px] font-bold text-emerald-800">
                    Terkonfirmasi
                  </span>
                </div>
                <dl className="mt-4 text-sm">
                  <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[#0e14331a] py-2.5">
                    <dt className="text-ink-muted">Unit</dt>
                    <dd className="text-right font-semibold text-ink">
                      Toyota Avanza · 3 hari
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[#0e14331a] py-2.5">
                    <dt className="text-ink-muted">Serah terima</dt>
                    <dd className="text-right font-semibold text-ink">
                      Bandara Ngurah Rai
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[#0e14331a] py-2.5">
                    <dt className="text-ink-muted">Tarif</dt>
                    <dd className="text-right font-mono text-[13px] text-ink">
                      3 × Rp350.000
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[#0e14331a] py-2.5">
                    <dt className="text-ink-muted">Deposit WNI</dt>
                    <dd className="text-right font-mono text-[13px] text-ink">
                      Rp500.000 · kembali penuh
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 pt-4">
                    <dt className="font-bold text-ink">Total sewa, final</dt>
                    <dd className="font-mono text-2xl font-semibold text-ink">
                      Rp1.050.000
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                  Persis seperti ini yang Anda terima di chat sebelum membayar.
                  Angkanya tidak berubah di tengah jalan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CARA SEWA ================= */}
      <section id="cara-sewa" className="mx-auto max-w-6xl scroll-mt-24 px-3 py-8 sm:px-5">
        <div className="rounded-[2.5rem] bg-fog px-5 py-14 sm:px-10 sm:py-20">
          <div className="max-w-2xl">
            <SectionLabel>Cara sewa</SectionLabel>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Begini kira-kira perjalanannya
            </h2>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Dari chat pertama sampai deposit kembali, semua lewat WhatsApp.
              Tidak ada formulir panjang, tidak ada antre di garasi.
            </p>
          </div>
          <ol className="mt-6">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="grid gap-3 border-t border-[#0e14331a] py-7 sm:grid-cols-[84px_1fr] lg:grid-cols-[110px_1fr_190px]"
              >
                <p className="font-display text-[44px] font-extrabold leading-none text-primary">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-display text-xl font-extrabold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 max-w-2xl leading-relaxed text-ink-muted">
                    {step.text}
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">
                    <span className="font-bold text-ink">Anda:</span>{" "}
                    {step.yourPart}
                  </p>
                </div>
                <p className="font-mono text-xs font-medium text-ink-muted lg:pt-2 lg:text-right">
                  {step.duration}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= TESTIMONI ================= */}
      <section id="testimoni" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8">
        <Scribble
          text="kata mereka, bukan kata kami"
          flip
          className="right-[2%] top-6"
        />
        <div className="max-w-2xl">
          <SectionLabel>Testimoni</SectionLabel>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Yang sudah jalan pakai ZeeRental
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-[#0e14331a] bg-white p-6 transition-colors hover:bg-lavender"
            >
              <p aria-hidden="true" className="font-display text-4xl font-extrabold leading-none text-primary">
                &ldquo;
              </p>
              <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-[#0e14331a] pt-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display text-sm font-extrabold text-primary">
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">
                    {t.name}
                  </span>
                  <span className="block font-mono text-[11px] text-ink-muted">
                    {t.origin} · {t.detail}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-3 pb-8 sm:px-5">
        <div className="rounded-[2.5rem] bg-fog px-5 py-14 sm:px-10 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                Yang sering ditanyakan sebelum berangkat
              </h2>
            </div>
            <div className="mt-10">
              {FAQS.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <div key={faq.question} className="border-b border-[#0e14331a]">
                    <button
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="font-display text-lg font-bold text-ink">
                        {faq.question}
                      </span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0e14331a] bg-white transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                        aria-hidden="true"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 4 V20 M4 12 H20"
                            stroke="#0e1433"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-6 leading-relaxed text-ink-muted">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-8 text-center text-sm text-ink-muted">
              Pertanyaan lain?{" "}
              <a
                href={WA_GENERAL}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-primary underline underline-offset-4 hover:text-primary-hover"
              >
                WhatsApp saja
              </a>
              , tulis seadanya.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-6xl px-3 pb-10 pt-2 sm:px-5">
        <div className="bg-grid-dark relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-center text-white sm:py-20">
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Ceritakan tanggal dan tujuan Anda, kami balas dengan{" "}
            <span className="marker text-ink">harga final</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/70">
            Bukan perkiraan, bukan &ldquo;nanti dikabari&rdquo;. Ketersediaan,
            total harga, dan deposit kami tulis jelas dalam satu chat.
          </p>
          <a
            href={WA_GENERAL}
            target="_blank"
            rel="noreferrer"
            className="shadow-hard-light mt-9 inline-block rounded-full bg-primary px-8 py-4 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            Mulai chat WhatsApp
          </a>
          <p className="mt-6 font-mono text-[11px] text-white/50">
            Dibalas ±1 jam · {BUSINESS.workHours} · {BUSINESS.whatsappDisplay}
          </p>
          <button
            onClick={onOpenManager}
            className="mt-8 text-xs font-semibold text-white/50 underline underline-offset-4 transition hover:text-white"
          >
            Pemilik usaha? Masuk ke panel pengelola
          </button>
        </div>
      </section>
    </div>
  );
}
