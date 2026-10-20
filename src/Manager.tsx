import { useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import {
BOOKING_STATUS,
CATEGORIES,
VEHICLE_STATUS,
addDaysStr,
fmtDate,
fmtDateShort,
rp,
rpShort,
todayStr,
waLink,
vehicleImage,
type Booking,
type Settings,
type Vehicle,
} from "./lib";

const inputCls =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25";
const labelCls =
  "mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--dim)]";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      {children}
    </div>
  );
}

function BookingBadge({ status }: { status: string }) {
  const s = BOOKING_STATUS[status];
  if (!s) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${s.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

type Tab = "ringkasan" | "armada" | "booking" | "kalender" | "pengaturan";

export function Manager({ settings }: { settings: Settings | null }) {
  const [tab, setTab] = useState<Tab>("ringkasan");
  const tabs: { id: Tab; label: string }[] = [
    { id: "ringkasan", label: "Ringkasan" },
    { id: "armada", label: "Armada" },
    { id: "booking", label: "Booking" },
    { id: "kalender", label: "Kalender" },
    { id: "pengaturan", label: "Pengaturan" },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-8">
      <div
        className="sticky top-16 z-30 -mx-4 overflow-x-auto border-b border-[var(--border)] bg-[var(--bg)]/95 px-4 backdrop-blur sm:-mx-8 sm:px-8"
        role="tablist"
        aria-label="Menu pengelola"
      >
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px whitespace-nowrap border-b-2 px-3.5 py-3 text-sm font-bold transition ${
                tab === t.id
                  ? "border-[var(--accent)] text-[var(--text)]"
                  : "border-transparent text-[var(--dim)] hover:text-[var(--text)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "ringkasan" && <DashboardView goTab={setTab} />}
      {tab === "armada" && <FleetView />}
      {tab === "booking" && <BookingsView />}
      {tab === "kalender" && <CalendarView />}
      {tab === "pengaturan" && <SettingsForm settings={settings} />}
    </div>
  );
}

/* ================= DASHBOARD ================= */

function DashboardView({ goTab }: { goTab: (t: Tab) => void }) {
  const today = todayStr();
  const dash = useQuery({
    queryKey: ["dashboard", today],
    queryFn: () => api.getDashboard({ today }),
  });
  const d = dash.data;
  const stats = d
    ? [
        { label: "Total unit aktif", value: String(d.totalVehicles), sub: "kendaraan terdaftar" },
        { label: "Tersedia hari ini", value: String(d.availableToday), sub: "siap disewakan" },
        { label: "Sedang disewa", value: String(d.rentedToday), sub: "unit di jalan hari ini" },
        { label: "Dalam perawatan", value: String(d.maintenance), sub: "belum bisa disewa" },
        { label: "Booking aktif", value: String(d.activeBookings), sub: `${d.pendingBookings} menunggu konfirmasi` },
        { label: "Pendapatan bulan ini", value: rpShort(d.monthRevenue), sub: `${d.monthBookings} booking masuk` },
      ]
    : [];

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold text-[var(--text)]">
        Ringkasan hari ini
      </h2>
      <p className="mt-1 text-sm text-[var(--dim)]">
        {new Date().toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      {dash.isPending && (
        <p className="mt-8 text-sm text-[var(--dim)]">Memuat ringkasan…</p>
      )}
      {dash.error && (
        <p className="mt-8 text-sm text-[var(--danger)]">
          Gagal memuat ringkasan. Coba muat ulang halaman.
        </p>
      )}
      {d && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--dim)]">
                  {s.label}
                </p>
                <p className="font-display mt-2 text-3xl font-semibold text-[var(--text)] sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-[var(--dim)]">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text)]">
                  Serah terima hari ini
                </h3>
                <button
                  onClick={() => goTab("kalender")}
                  className="text-xs font-bold text-[var(--accent)]"
                >
                  Lihat kalender
                </button>
              </div>
              {d.todayBookings.length === 0 ? (
                <p className="mt-4 text-sm text-[var(--dim)]">
                  Tidak ada pengambilan atau pengembalian hari ini.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {d.todayBookings.map((b) => (
                    <li
                      key={b.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-2)] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[var(--text)]">
                          {b.customerName} · {b.vehicleName}
                        </p>
                        <p className="text-xs text-[var(--dim)]">
                          {b.startDate === today ? "Ambil" : "Kembali"} ·{" "}
                          {fmtDateShort(b.startDate)} s/d {fmtDateShort(b.endDate)}
                          {b.pickupLocation ? ` · ${b.pickupLocation}` : ""}
                        </p>
                      </div>
                      <BookingBadge status={b.status} />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text)]">
                  Booking berikutnya
                </h3>
                <button
                  onClick={() => goTab("booking")}
                  className="text-xs font-bold text-[var(--accent)]"
                >
                  Semua booking
                </button>
              </div>
              {d.upcomingBookings.length === 0 ? (
                <p className="mt-4 text-sm text-[var(--dim)]">
                  Belum ada booking mendatang. Tambahkan dari tab Booking.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {d.upcomingBookings.map((b) => (
                    <li
                      key={b.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-2)] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[var(--text)]">
                          {b.customerName} · {b.vehicleName}
                        </p>
                        <p className="text-xs text-[var(--dim)]">
                          {fmtDate(b.startDate)} · {b.days} hari · {rp(b.totalPrice)}
                        </p>
                      </div>
                      <BookingBadge status={b.status} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= FLEET ================= */

type VehicleFormState = {
  name: string;
  category: string;
  plate: string;
  year: string;
  transmission: string;
  seats: string;
  fuel: string;
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  depositWni: string;
  depositWna: string;
  status: string;
  cover: string;
  imageUrl: string;
  featured: boolean;
  notes: string;
};

const emptyVehicleForm: VehicleFormState = {
  name: "",
  category: "city",
  plate: "",
  year: "",
  transmission: "matic",
  seats: "",
  fuel: "Bensin",
  dailyRate: "",
  weeklyRate: "",
  monthlyRate: "",
  depositWni: "",
  depositWna: "",
  status: "tersedia",
  cover: "city",
  imageUrl: "",
  featured: false,
  notes: "",
};

function vehicleToForm(v: Vehicle): VehicleFormState {
  return {
    name: v.name,
    category: v.category,
    plate: v.plate,
    year: v.year ? String(v.year) : "",
    transmission: v.transmission,
    seats: v.seats ? String(v.seats) : "",
    fuel: v.fuel,
    dailyRate: String(v.dailyRate),
    weeklyRate: v.weeklyRate ? String(v.weeklyRate) : "",
    monthlyRate: v.monthlyRate ? String(v.monthlyRate) : "",
    depositWni: String(v.depositWni),
    depositWna: String(v.depositWna),
    status: v.status,
    cover: v.cover,
    imageUrl: v.imageUrl,
    featured: v.featured,
    notes: v.notes,
  };
}

function numOrNull(s: string): number | null {
  const t = s.replace(/[^\d]/g, "");
  return t === "" ? null : Number(t);
}
function numOrZero(s: string): number {
  return numOrNull(s) ?? 0;
}

function FleetView() {
  const qc = useQueryClient();
  const fleet = useQuery({
    queryKey: ["fleet"],
    queryFn: () => api.listFleet({}),
  });
  const bookings = useQuery({
    queryKey: ["bookings"],
    queryFn: () => api.listBookings({ limit: 200 }),
  });
  const [filter, setFilter] = useState("semua");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Vehicle | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["fleet"] });
    void qc.invalidateQueries({ queryKey: ["bookings"] });
    void qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const createMut = useMutation({
    mutationFn: (f: VehicleFormState) =>
      api.createVehicle({
        name: f.name,
        category: f.category as "city",
        plate: f.plate,
        year: numOrNull(f.year),
        transmission: f.transmission as "matic",
        seats: numOrNull(f.seats),
        fuel: f.fuel,
        dailyRate: numOrZero(f.dailyRate),
        weeklyRate: numOrNull(f.weeklyRate),
        monthlyRate: numOrNull(f.monthlyRate),
        depositWni: numOrZero(f.depositWni),
        depositWna: numOrZero(f.depositWna),
        status: f.status as "tersedia",
        cover: f.cover as "city",
        imageUrl: f.imageUrl,
        featured: f.featured,
        notes: f.notes,
      }),
    onSuccess: () => {
      refresh();
      setShowForm(false);
      setFormError(null);
    },
    onError: (e) => setFormError(String(e)),
  });

  const updateMut = useMutation({
    mutationFn: (args: { id: number; f: VehicleFormState }) =>
      api.updateVehicle({
        id: args.id,
        name: args.f.name,
        category: args.f.category as "city",
        plate: args.f.plate,
        year: numOrNull(args.f.year),
        transmission: args.f.transmission as "matic",
        seats: numOrNull(args.f.seats),
        fuel: args.f.fuel,
        dailyRate: numOrZero(args.f.dailyRate),
        weeklyRate: numOrNull(args.f.weeklyRate),
        monthlyRate: numOrNull(args.f.monthlyRate),
        depositWni: numOrZero(args.f.depositWni),
        depositWna: numOrZero(args.f.depositWna),
        status: args.f.status as "tersedia",
        cover: args.f.cover as "city",
        imageUrl: args.f.imageUrl,
        featured: args.f.featured,
        notes: args.f.notes,
      }),
    onSuccess: () => {
      refresh();
      setEditing(null);
      setFormError(null);
    },
    onError: (e) => setFormError(String(e)),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.deleteVehicle({ id }),
    onSuccess: (res) => {
      if (!res.ok) {
        setDeleteError(res.error);
        return;
      }
      setConfirmDelete(null);
      setDeleteError(null);
      refresh();
    },
    onError: (e) => setDeleteError(String(e)),
  });

  const today = todayStr();
  const busyVehicleIds = useMemo(() => {
    const set = new Set<number>();
    for (const b of bookings.data?.bookings ?? []) {
      if (
        ["menunggu", "terkonfirmasi", "berlangsung"].includes(b.status) &&
        b.startDate <= today &&
        b.endDate > today
      ) {
        set.add(b.vehicleId);
      }
    }
    return set;
  }, [bookings.data, today]);

  const vehicles = fleet.data?.vehicles ?? [];
  const shown =
    filter === "semua" ? vehicles : vehicles.filter((v) => v.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[var(--text)]">
            Armada
          </h2>
          <p className="mt-1 text-sm text-[var(--dim)]">
            {vehicles.length} kendaraan terdaftar. Yang tampil di landing page
            adalah unit berstatus bukan Nonaktif.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setFormError(null);
          }}
          className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-5 py-2.5 text-sm font-bold text-white"
        >
          + Tambah kendaraan
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter status kendaraan">
        {(
          [
            ["semua", "Semua"],
            ["tersedia", "Tersedia"],
            ["perawatan", "Perawatan"],
            ["nonaktif", "Nonaktif"],
          ] as [string, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
            className={`rounded-full px-4 py-1.5 text-xs font-bold ${
              filter === id
                ? "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
                : "border border-[var(--border)] bg-[var(--surface)] text-[var(--dim)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {showForm && (
        <VehicleForm
          title="Tambah kendaraan baru"
          initial={emptyVehicleForm}
          saving={createMut.isPending}
          error={formError}
          onCancel={() => setShowForm(false)}
          onSubmit={(f) => createMut.mutate(f)}
        />
      )}
      {editing && (
        <VehicleForm
          title={`Ubah ${editing.name}`}
          initial={vehicleToForm(editing)}
          saving={updateMut.isPending}
          error={formError}
          onCancel={() => setEditing(null)}
          onSubmit={(f) => updateMut.mutate({ id: editing.id, f })}
        />
      )}

      {fleet.isPending && (
        <p className="mt-8 text-sm text-[var(--dim)]">Memuat armada…</p>
      )}
      {fleet.data && vehicles.length === 0 && !showForm && (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center">
          <p className="font-display text-2xl font-semibold text-[var(--text)]">
            Belum ada kendaraan
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--dim)]">
            Tambahkan unit pertamamu: nama kendaraan, plat, tarif harian, dan
            deposit untuk penyewa WNI dan WNA.
          </p>
        </div>
      )}
      {fleet.data && shown.length > 0 && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((v) => {
            const busy = busyVehicleIds.has(v.id) && v.status === "tersedia";
            const st = busy
              ? { label: "Sedang disewa", badge: "bg-sky-100 text-sky-900 border border-sky-300" }
              : VEHICLE_STATUS[v.status];
            return (
              <article
                key={v.id}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="relative aspect-[16/9]">
                  <img
                    src={vehicleImage(v)}
                    alt={`Foto ilustrasi kategori untuk ${v.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {v.featured && (
                    <span className="absolute right-3 top-3 rounded-full bg-[var(--text)] px-3 py-1 text-[11px] font-bold text-[var(--bg)]">
                      Unggulan
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-[var(--text)]">
                        {v.name}
                      </h3>
                      <p className="text-xs text-[var(--dim)]">
                        {v.plate || "Plat belum diisi"}
                        {v.year ? ` · ${v.year}` : ""} ·{" "}
                        {CATEGORIES[v.category] ?? v.category}
                      </p>
                    </div>
                    {st && (
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${st.badge}`}
                      >
                        {st.label}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-extrabold text-[var(--accent)]">
                    {rp(v.dailyRate)}
                    <span className="text-xs font-medium text-[var(--dim)]"> /hari</span>
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--dim)]">
                    Deposit WNI {rpShort(v.depositWni)} · WNA {rpShort(v.depositWna)}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(v);
                        setShowForm(false);
                        setFormError(null);
                      }}
                      aria-label={`Ubah ${v.name}`}
                      className="flex-1 rounded-full border border-[var(--border)] py-2 text-xs font-bold text-[var(--text)]"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => {
                        setConfirmDelete(v);
                        setDeleteError(null);
                      }}
                      aria-label={`Hapus ${v.name}`}
                      className="flex-1 rounded-full border border-rose-300 py-2 text-xs font-bold text-[var(--danger)]"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {fleet.data && vehicles.length > 0 && shown.length === 0 && (
        <p className="mt-8 rounded-xl bg-[var(--surface)] px-6 py-10 text-center text-sm text-[var(--dim)]">
          Tidak ada kendaraan dengan status ini.
        </p>
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="alertdialog"
          aria-label={`Konfirmasi hapus ${confirmDelete.name}`}
        >
          <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] p-6 shadow-2xl">
            <h3 className="font-display text-xl font-semibold text-[var(--text)]">
              Hapus {confirmDelete.name}?
            </h3>
            <p className="mt-2 text-sm text-[var(--dim)]">
              Kendaraan tanpa riwayat booking akan dihapus permanen.
            </p>
            {deleteError && (
              <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-[var(--danger)]">
                {deleteError}
              </p>
            )}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-full border border-[var(--border)] py-2.5 text-sm font-bold text-[var(--text)]"
              >
                Batal
              </button>
              <button
                onClick={() => deleteMut.mutate(confirmDelete.id)}
                disabled={deleteMut.isPending}
                className="flex-1 rounded-full bg-[var(--danger)] py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {deleteMut.isPending ? "Menghapus…" : "Ya, hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VehicleForm({
  title,
  initial,
  saving,
  error,
  onCancel,
  onSubmit,
}: {
  title: string;
  initial: VehicleFormState;
  saving: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (f: VehicleFormState) => void;
}) {
  const [f, setF] = useState<VehicleFormState>(initial);
  const set = (k: keyof VehicleFormState) => (e: { target: { value: string } }) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));
  const localError =
    f.name.trim() === ""
      ? "Nama kendaraan wajib diisi."
      : f.dailyRate.trim() === ""
        ? "Tarif harian wajib diisi."
        : null;

  return (
    <form
      className="mt-6 rounded-2xl border border-[var(--accent)]/50 bg-[var(--surface)] p-5 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!localError) onSubmit(f);
      }}
    >
      <h3 className="font-display text-xl font-semibold text-[var(--text)]">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Nama kendaraan *">
          <input aria-label="Nama kendaraan" className={inputCls} value={f.name} onChange={set("name")} placeholder="Toyota Innova Reborn" />
        </Field>
        <Field label="Kategori">
          <select aria-label="Kategori kendaraan" className={inputCls} value={f.category} onChange={set("category")}>
            {Object.entries(CATEGORIES).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </Field>
        <Field label="Plat nomor">
          <input aria-label="Plat nomor" className={inputCls} value={f.plate} onChange={set("plate")} placeholder="DK 1234 AB" />
        </Field>
        <Field label="Tahun">
          <input aria-label="Tahun kendaraan" className={inputCls} inputMode="numeric" value={f.year} onChange={set("year")} placeholder="2022" />
        </Field>
        <Field label="Transmisi">
          <select aria-label="Transmisi" className={inputCls} value={f.transmission} onChange={set("transmission")}>
            <option value="matic">Matic</option>
            <option value="manual">Manual</option>
          </select>
        </Field>
        <Field label="Jumlah kursi">
          <input aria-label="Jumlah kursi" className={inputCls} inputMode="numeric" value={f.seats} onChange={set("seats")} placeholder="7" />
        </Field>
        <Field label="Bahan bakar">
          <input aria-label="Bahan bakar" className={inputCls} value={f.fuel} onChange={set("fuel")} placeholder="Bensin / Diesel / Listrik" />
        </Field>
        <Field label="Tarif harian (Rp) *">
          <input aria-label="Tarif harian dalam rupiah" className={inputCls} inputMode="numeric" value={f.dailyRate} onChange={set("dailyRate")} placeholder="450000" />
        </Field>
        <Field label="Tarif mingguan (Rp)">
          <input aria-label="Tarif mingguan dalam rupiah" className={inputCls} inputMode="numeric" value={f.weeklyRate} onChange={set("weeklyRate")} placeholder="2700000" />
        </Field>
        <Field label="Tarif bulanan (Rp)">
          <input aria-label="Tarif bulanan dalam rupiah" className={inputCls} inputMode="numeric" value={f.monthlyRate} onChange={set("monthlyRate")} placeholder="8000000" />
        </Field>
        <Field label="Deposit WNI (Rp)">
          <input aria-label="Deposit penyewa WNI dalam rupiah" className={inputCls} inputMode="numeric" value={f.depositWni} onChange={set("depositWni")} placeholder="500000" />
        </Field>
        <Field label="Deposit WNA (Rp)">
          <input aria-label="Deposit penyewa WNA dalam rupiah" className={inputCls} inputMode="numeric" value={f.depositWna} onChange={set("depositWna")} placeholder="2000000" />
        </Field>
        <Field label="Status unit">
          <select aria-label="Status unit" className={inputCls} value={f.status} onChange={set("status")}>
            <option value="tersedia">Tersedia</option>
            <option value="perawatan">Perawatan</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </Field>
        <Field label="Foto sampul">
          <select aria-label="Foto sampul" className={inputCls} value={f.cover} onChange={set("cover")}>
            <option value="skuter">Preset skuter</option>
            <option value="city">Preset city car</option>
            <option value="mpv">Preset MPV</option>
            <option value="suv">Preset SUV premium</option>
            <option value="custom">Foto sendiri (URL)</option>
          </select>
        </Field>
        {f.cover === "custom" && (
          <Field label="URL foto kendaraan">
            <input aria-label="URL foto kendaraan" className={inputCls} value={f.imageUrl} onChange={set("imageUrl")} placeholder="https://…" />
          </Field>
        )}
        <Field label="Catatan">
          <input aria-label="Catatan kendaraan" className={inputCls} value={f.notes} onChange={set("notes")} placeholder="Kondisi, servis terakhir, dll." />
        </Field>
      </div>
      <label className="mt-4 flex items-center gap-2.5 text-sm font-semibold text-[var(--text)]">
        <input
          type="checkbox"
          aria-label="Tampilkan sebagai unggulan di landing page"
          checked={f.featured}
          onChange={(e) => setF((p) => ({ ...p, featured: e.target.checked }))}
          className="h-4 w-4 accent-[#4b3bff]"
        />
        Tampilkan sebagai unggulan di landing page
      </label>
      {(localError || error) && (
        <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-[var(--danger)]">
          {error ?? localError}
        </p>
      )}
      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          disabled={saving || !!localError}
          className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {saving ? "Menyimpan…" : "Simpan kendaraan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-[var(--border)] px-6 py-2.5 text-sm font-bold text-[var(--text)]"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

/* ================= BOOKINGS ================= */

type BookingFormState = {
  vehicleId: string;
  customerName: string;
  customerPhone: string;
  nationality: string;
  startDate: string;
  endDate: string;
  deposit: string;
  totalPrice: string;
  status: string;
  pickupLocation: string;
  dropoffLocation: string;
  withDriver: boolean;
  notes: string;
};

function bookingToForm(b: Booking): BookingFormState {
  return {
    vehicleId: String(b.vehicleId),
    customerName: b.customerName,
    customerPhone: b.customerPhone,
    nationality: b.nationality,
    startDate: b.startDate,
    endDate: b.endDate,
    deposit: String(b.deposit),
    totalPrice: String(b.totalPrice),
    status: b.status,
    pickupLocation: b.pickupLocation,
    dropoffLocation: b.dropoffLocation,
    withDriver: b.withDriver,
    notes: b.notes,
  };
}

function BookingsView() {
  const qc = useQueryClient();
  const fleet = useQuery({
    queryKey: ["fleet"],
    queryFn: () => api.listFleet({}),
  });
  const bookings = useQuery({
    queryKey: ["bookings"],
    queryFn: () => api.listBookings({ limit: 200 }),
  });
  const settings = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.getSettings({}),
  });
  const [statusFilter, setStatusFilter] = useState("semua");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Booking | null>(null);

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["bookings"] });
    void qc.invalidateQueries({ queryKey: ["dashboard"] });
    void qc.invalidateQueries({ queryKey: ["availability"] });
  };

  const vehicles = fleet.data?.vehicles ?? [];
  const list = (bookings.data?.bookings ?? []).filter((b) => {
    if (statusFilter !== "semua" && b.status !== statusFilter) return false;
    if (
      search.trim() &&
      !`${b.customerName} ${b.vehicleName}`.toLowerCase().includes(search.trim().toLowerCase())
    )
      return false;
    return true;
  });

  const saveMut = useMutation({
    mutationFn: async (args: { id: number | null; f: BookingFormState }) => {
      const payload = {
        vehicleId: Number(args.f.vehicleId),
        customerName: args.f.customerName,
        customerPhone: args.f.customerPhone,
        nationality: args.f.nationality as "WNI" | "WNA",
        startDate: args.f.startDate,
        endDate: args.f.endDate,
        deposit: args.f.deposit.trim() === "" ? null : numOrZero(args.f.deposit),
        totalPrice: args.f.totalPrice.trim() === "" ? null : numOrZero(args.f.totalPrice),
        status: args.f.status as "menunggu",
        pickupLocation: args.f.pickupLocation,
        dropoffLocation: args.f.dropoffLocation,
        withDriver: args.f.withDriver,
        notes: args.f.notes,
      };
      return args.id
        ? api.updateBooking({ id: args.id, ...payload })
        : api.createBooking(payload);
    },
    onSuccess: (res) => {
      if (!res.ok) {
        setServerError(res.error);
        return;
      }
      setServerError(null);
      setShowForm(false);
      setEditing(null);
      refresh();
    },
    onError: (e) => setServerError(String(e)),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.deleteBooking({ id }),
    onSuccess: () => {
      setConfirmDelete(null);
      refresh();
    },
  });

  const ownerWa = settings.data?.settings?.whatsapp ?? "";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[var(--text)]">
            Booking
          </h2>
          <p className="mt-1 text-sm text-[var(--dim)]">
            Tanggal yang bentrok dengan booking aktif akan ditolak otomatis.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setServerError(null);
          }}
          disabled={vehicles.length === 0}
          className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          + Booking baru
        </button>
      </div>
      {vehicles.length === 0 && (
        <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Tambahkan kendaraan dulu di tab Armada sebelum membuat booking.
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter status booking">
          {["semua", ...Object.keys(BOOKING_STATUS)].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              aria-pressed={statusFilter === s}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${
                statusFilter === s
                  ? "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
                  : "border border-[var(--border)] bg-[var(--surface)] text-[var(--dim)]"
              }`}
            >
              {s === "semua" ? "Semua" : BOOKING_STATUS[s]?.label}
            </button>
          ))}
        </div>
        <input
          aria-label="Cari booking berdasarkan nama penyewa atau kendaraan"
          className={`${inputCls} max-w-xs`}
          placeholder="Cari nama penyewa…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <BookingForm
          title="Booking baru"
          vehicles={vehicles}
          initial={{
            vehicleId: vehicles[0] ? String(vehicles[0].id) : "",
            customerName: "",
            customerPhone: "",
            nationality: "WNI",
            startDate: todayStr(),
            endDate: addDaysStr(todayStr(), 1),
            deposit: "",
            totalPrice: "",
            status: "menunggu",
            pickupLocation: "",
            dropoffLocation: "",
            withDriver: false,
            notes: "",
          }}
          saving={saveMut.isPending}
          serverError={serverError}
          onCancel={() => setShowForm(false)}
          onSubmit={(f) => saveMut.mutate({ id: null, f })}
        />
      )}
      {editing && (
        <BookingForm
          title={`Ubah booking ${editing.customerName}`}
          vehicles={vehicles}
          initial={bookingToForm(editing)}
          saving={saveMut.isPending}
          serverError={serverError}
          onCancel={() => setEditing(null)}
          onSubmit={(f) => saveMut.mutate({ id: editing.id, f })}
        />
      )}

      {bookings.isPending && (
        <p className="mt-8 text-sm text-[var(--dim)]">Memuat booking…</p>
      )}
      {bookings.data && list.length === 0 && !showForm && (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center">
          <p className="font-display text-2xl font-semibold text-[var(--text)]">
            Belum ada booking
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--dim)]">
            Booking yang kamu catat akan muncul di sini dan otomatis menandai
            kalender ketersediaan.
          </p>
        </div>
      )}
      {list.length > 0 && (
        <div className="mt-6 space-y-3">
          {list.map((b) => (
            <article
              key={b.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-bold text-[var(--text)]">
                    {b.customerName}
                    <span className="ml-2 rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[11px] font-bold text-[var(--dim)]">
                      {b.nationality}
                    </span>
                    {b.withDriver && (
                      <span className="ml-1.5 rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[11px] font-bold text-[var(--dim)]">
                        Dengan sopir
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-[var(--dim)]">
                    {b.vehicleName} · {fmtDate(b.startDate)} s/d {fmtDate(b.endDate)} ·{" "}
                    {b.days} hari
                  </p>
                  <p className="mt-0.5 text-sm text-[var(--dim)]">
                    Total {rp(b.totalPrice)} · Deposit {rp(b.deposit)}
                    {b.pickupLocation ? ` · Ambil: ${b.pickupLocation}` : ""}
                    {b.dropoffLocation ? ` · Kembali: ${b.dropoffLocation}` : ""}
                  </p>
                  {b.notes && (
                    <p className="mt-0.5 text-xs italic text-[var(--dim)]">{b.notes}</p>
                  )}
                </div>
                <BookingBadge status={b.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <select
                  aria-label={`Ubah status booking ${b.customerName}`}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--text)]"
                  value={b.status}
                  onChange={(e) =>
                    saveMut.mutate({
                      id: b.id,
                      f: { ...bookingToForm(b), status: e.target.value },
                    })
                  }
                >
                  {Object.entries(BOOKING_STATUS).map(([id, s]) => (
                    <option key={id} value={id}>{s.label}</option>
                  ))}
                </select>
                {b.customerPhone && (
                  <a
                    href={waLink(
                      b.customerPhone,
                      `Halo ${b.customerName}, ini dari rental kami. Booking ${b.vehicleName} tanggal ${fmtDate(b.startDate)} s/d ${fmtDate(b.endDate)} statusnya: ${BOOKING_STATUS[b.status]?.label ?? b.status}.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Chat WhatsApp ${b.customerName}`}
                    className="rounded-full border border-emerald-300 px-3.5 py-1.5 text-xs font-bold text-emerald-800"
                  >
                    Chat penyewa
                  </a>
                )}
                <button
                  onClick={() => {
                    setEditing(b);
                    setShowForm(false);
                    setServerError(null);
                  }}
                  aria-label={`Ubah booking ${b.customerName}`}
                  className="rounded-full border border-[var(--border)] px-3.5 py-1.5 text-xs font-bold text-[var(--text)]"
                >
                  Ubah
                </button>
                <button
                  onClick={() => setConfirmDelete(b)}
                  aria-label={`Hapus booking ${b.customerName}`}
                  className="rounded-full border border-rose-300 px-3.5 py-1.5 text-xs font-bold text-[var(--danger)]"
                >
                  Hapus
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="alertdialog"
          aria-label={`Konfirmasi hapus booking ${confirmDelete.customerName}`}
        >
          <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] p-6 shadow-2xl">
            <h3 className="font-display text-xl font-semibold text-[var(--text)]">
              Hapus booking ini?
            </h3>
            <p className="mt-2 text-sm text-[var(--dim)]">
              {confirmDelete.customerName} · {confirmDelete.vehicleName} ·{" "}
              {fmtDate(confirmDelete.startDate)} s/d {fmtDate(confirmDelete.endDate)}.
              Jadwal kendaraan akan bebas lagi.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-full border border-[var(--border)] py-2.5 text-sm font-bold text-[var(--text)]"
              >
                Batal
              </button>
              <button
                onClick={() => deleteMut.mutate(confirmDelete.id)}
                disabled={deleteMut.isPending}
                className="flex-1 rounded-full bg-[var(--danger)] py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {deleteMut.isPending ? "Menghapus…" : "Ya, hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
      {ownerWa === "" && (
        <p className="mt-6 text-xs text-[var(--dim)]">
          Tips: isi nomor WhatsApp usaha di tab Pengaturan agar tombol sewa di
          landing page aktif.
        </p>
      )}
    </div>
  );
}

function BookingForm({
  title,
  vehicles,
  initial,
  saving,
  serverError,
  onCancel,
  onSubmit,
}: {
  title: string;
  vehicles: Vehicle[];
  initial: BookingFormState;
  saving: boolean;
  serverError: string | null;
  onCancel: () => void;
  onSubmit: (f: BookingFormState) => void;
}) {
  const [f, setF] = useState<BookingFormState>(initial);
  const set = (k: keyof BookingFormState) => (e: { target: { value: string } }) =>
    setF((p) => ({ ...p, [k]: e.target.value }));
  const vehicle = vehicles.find((v) => String(v.id) === f.vehicleId);
  const days = useMemo(() => {
    const s = new Date(`${f.startDate}T00:00:00Z`).getTime();
    const e = new Date(`${f.endDate}T00:00:00Z`).getTime();
    return Math.round((e - s) / 86400000);
  }, [f.startDate, f.endDate]);
  const suggestedTotal = vehicle && days > 0 ? vehicle.dailyRate * days : 0;
  const suggestedDeposit = vehicle
    ? f.nationality === "WNA"
      ? vehicle.depositWna
      : vehicle.depositWni
    : 0;
  const localError =
    f.customerName.trim() === ""
      ? "Nama penyewa wajib diisi."
      : !f.vehicleId
        ? "Pilih kendaraan dulu."
        : days < 1
          ? "Tanggal selesai harus setelah tanggal mulai."
          : null;

  return (
    <form
      className="mt-6 rounded-2xl border border-[var(--accent)]/50 bg-[var(--surface)] p-5 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!localError) onSubmit(f);
      }}
    >
      <h3 className="font-display text-xl font-semibold text-[var(--text)]">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Kendaraan *">
          <select aria-label="Kendaraan yang dibooking" className={inputCls} value={f.vehicleId} onChange={set("vehicleId")}>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
                {v.plate ? ` (${v.plate})` : ""}
                {v.status !== "tersedia" ? ` — ${VEHICLE_STATUS[v.status]?.label}` : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Nama penyewa *">
          <input aria-label="Nama penyewa" className={inputCls} value={f.customerName} onChange={set("customerName")} placeholder="Nama lengkap" />
        </Field>
        <Field label="WhatsApp penyewa">
          <input aria-label="Nomor WhatsApp penyewa" className={inputCls} value={f.customerPhone} onChange={set("customerPhone")} placeholder="08xxxxxxxxxx / +61…" />
        </Field>
        <Field label="Kewarganegaraan">
          <select aria-label="Kewarganegaraan penyewa" className={inputCls} value={f.nationality} onChange={set("nationality")}>
            <option value="WNI">WNI</option>
            <option value="WNA">WNA</option>
          </select>
        </Field>
        <Field label="Tanggal mulai *">
          <input aria-label="Tanggal mulai sewa" type="date" className={inputCls} value={f.startDate} onChange={set("startDate")} />
        </Field>
        <Field label="Tanggal selesai *">
          <input aria-label="Tanggal selesai sewa" type="date" className={inputCls} value={f.endDate} onChange={set("endDate")} />
        </Field>
        <Field label="Status booking">
          <select aria-label="Status booking" className={inputCls} value={f.status} onChange={set("status")}>
            {Object.entries(BOOKING_STATUS).map(([id, s]) => (
              <option key={id} value={id}>{s.label}</option>
            ))}
          </select>
        </Field>
        <Field label={`Total harga (Rp)${suggestedTotal ? ` — saran ${rp(suggestedTotal)}` : ""}`}>
          <input aria-label="Total harga dalam rupiah, kosongkan untuk hitung otomatis" className={inputCls} inputMode="numeric" value={f.totalPrice} onChange={set("totalPrice")} placeholder="Kosongkan = tarif harian × hari" />
        </Field>
        <Field label={`Deposit (Rp)${suggestedDeposit ? ` — saran ${rp(suggestedDeposit)}` : ""}`}>
          <input aria-label="Deposit dalam rupiah, kosongkan untuk pakai deposit kendaraan" className={inputCls} inputMode="numeric" value={f.deposit} onChange={set("deposit")} placeholder="Kosongkan = deposit kendaraan" />
        </Field>
        <Field label="Lokasi pengambilan">
          <input aria-label="Lokasi pengambilan" className={inputCls} value={f.pickupLocation} onChange={set("pickupLocation")} placeholder="Bandara Ngurah Rai / hotel…" />
        </Field>
        <Field label="Lokasi pengembalian">
          <input aria-label="Lokasi pengembalian" className={inputCls} value={f.dropoffLocation} onChange={set("dropoffLocation")} placeholder="Sama seperti pengambilan" />
        </Field>
        <Field label="Catatan">
          <input aria-label="Catatan booking" className={inputCls} value={f.notes} onChange={set("notes")} placeholder="Permintaan khusus penyewa" />
        </Field>
      </div>
      <label className="mt-4 flex items-center gap-2.5 text-sm font-semibold text-[var(--text)]">
        <input
          type="checkbox"
          aria-label="Sewa dengan sopir"
          checked={f.withDriver}
          onChange={(e) => setF((p) => ({ ...p, withDriver: e.target.checked }))}
          className="h-4 w-4 accent-[#4b3bff]"
        />
        Sewa dengan sopir
      </label>
      {days > 0 && vehicle && (
        <p className="mt-3 rounded-xl bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--text)]">
          Pratinjau: {days} hari × {rp(vehicle.dailyRate)} ={" "}
          <strong>{rp(suggestedTotal)}</strong> · deposit {f.nationality}{" "}
          {rp(suggestedDeposit)}
          {f.totalPrice.trim() !== "" || f.deposit.trim() !== ""
            ? " (nilai manualmu yang akan dipakai)"
            : ""}
        </p>
      )}
      {(localError || serverError) && (
        <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-[var(--danger)]">
          {serverError ?? localError}
        </p>
      )}
      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          disabled={saving || !!localError}
          className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {saving ? "Menyimpan…" : "Simpan booking"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-[var(--border)] px-6 py-2.5 text-sm font-bold text-[var(--text)]"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

/* ================= CALENDAR ================= */

function CalendarView() {
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState<Booking | null>(null);
  const first = new Date(cursor.y, cursor.m, 1);
  const gridStart = addDaysStr(todayStr(first), -first.getDay());
  const gridEnd = addDaysStr(gridStart, 41);
  const avail = useQuery({
    queryKey: ["availability", gridStart, gridEnd],
    queryFn: () => api.getAvailability({ from: gridStart, to: gridEnd }),
  });
  const bookings = avail.data?.bookings ?? [];
  const today = todayStr();
  const monthLabel = first.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const move = (delta: number) => {
    setCursor((c) => {
      const d = new Date(c.y, c.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
    setSelected(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[var(--text)]">
            Kalender ketersediaan
          </h2>
          <p className="mt-1 text-sm text-[var(--dim)]">{monthLabel}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => move(-1)}
            aria-label="Bulan sebelumnya"
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--text)]"
          >
            ← Prev
          </button>
          <button
            onClick={() => {
              setCursor({ y: now.getFullYear(), m: now.getMonth() });
              setSelected(null);
            }}
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--text)]"
          >
            Hari ini
          </button>
          <button
            onClick={() => move(1)}
            aria-label="Bulan berikutnya"
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--text)]"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-[var(--dim)]">
        {Object.entries(BOOKING_STATUS)
          .filter(([id]) => id !== "batal")
          .map(([id, s]) => (
            <span key={id} className="inline-flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--surface-2)] text-center text-[11px] font-bold uppercase tracking-wider text-[var(--dim)]">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
            <div key={d} className="py-2.5">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: 42 }, (_, i) => {
            const dateStr = addDaysStr(gridStart, i);
            const d = new Date(`${dateStr}T00:00:00`);
            const inMonth = d.getMonth() === cursor.m;
            const cellBookings = bookings.filter(
              (b) => b.startDate <= dateStr && b.endDate > dateStr,
            );
            const isToday = dateStr === today;
            return (
              <div
                key={dateStr}
                className={`min-h-[76px] border-b border-r border-[var(--border)] p-1.5 sm:min-h-[96px] ${
                  inMonth ? "" : "bg-[var(--surface-2)]/50"
                } ${isToday ? "bg-[var(--accent)]/10" : ""}`}
              >
                <p
                  className={`text-xs font-bold ${
                    isToday
                      ? "text-[var(--accent)]"
                      : inMonth
                        ? "text-[var(--text)]"
                        : "text-[var(--dim)]"
                  }`}
                >
                  {d.getDate()}
                  {isToday ? " · hari ini" : ""}
                </p>
                <div className="mt-1 space-y-1">
                  {cellBookings.slice(0, 3).map((b) => {
                    const s = BOOKING_STATUS[b.status];
                    return (
                      <button
                        key={b.id}
                        onClick={() => setSelected(b)}
                        aria-label={`Booking ${b.customerName}, ${b.vehicleName}, ${fmtDate(b.startDate)} sampai ${fmtDate(b.endDate)}`}
                        className={`block w-full truncate rounded-xl px-1.5 py-0.5 text-left text-[10px] font-bold ${s?.cal ?? ""}`}
                      >
                        {b.vehicleName} — {b.customerName}
                      </button>
                    );
                  })}
                  {cellBookings.length > 3 && (
                    <p className="px-1 text-[10px] font-semibold text-[var(--dim)]">
                      +{cellBookings.length - 3} lagi
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {avail.isPending && (
        <p className="mt-3 text-sm text-[var(--dim)]">Memuat kalender…</p>
      )}

      {selected && (
        <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-base font-bold text-[var(--text)]">
                {selected.customerName} · {selected.vehicleName}
              </p>
              <p className="mt-0.5 text-sm text-[var(--dim)]">
                {fmtDate(selected.startDate)} s/d {fmtDate(selected.endDate)} ·{" "}
                {selected.days} hari · Total {rp(selected.totalPrice)} · Deposit{" "}
                {rp(selected.deposit)}
              </p>
              <p className="mt-0.5 text-sm text-[var(--dim)]">
                {selected.nationality}
                {selected.pickupLocation ? ` · Ambil: ${selected.pickupLocation}` : ""}
                {selected.dropoffLocation ? ` · Kembali: ${selected.dropoffLocation}` : ""}
                {selected.withDriver ? " · Dengan sopir" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BookingBadge status={selected.status} />
              <button
                onClick={() => setSelected(null)}
                aria-label="Tutup detail booking"
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-bold text-[var(--text)]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= SETTINGS ================= */

function SettingsForm({ settings }: { settings: Settings | null }) {
  const qc = useQueryClient();
  const [f, setF] = useState<Settings>({
    businessName: settings?.businessName ?? "",
    tagline: settings?.tagline ?? "",
    whatsapp: settings?.whatsapp ?? "",
    email: settings?.email ?? "",
    baseLocation: settings?.baseLocation ?? "",
    serviceAreas: settings?.serviceAreas ?? "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveMut = useMutation({
    mutationFn: () => api.saveSettings(f),
    onSuccess: () => {
      setSaved(true);
      setError(null);
      void qc.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (e) => setError(String(e)),
  });
  const [resetDone, setResetDone] = useState(false);
  const resetMut = useMutation({
    mutationFn: () => api.resetData(),
    onSuccess: () => {
      setResetDone(true);
      void qc.invalidateQueries();
    },
  });
  const set =
    (k: keyof Settings) =>
    (e: { target: { value: string } }) => {
      setSaved(false);
      setF((p) => ({ ...p, [k]: e.target.value }));
    };

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-3xl font-semibold text-[var(--text)]">
        Pengaturan usaha
      </h2>
      <p className="mt-1 text-sm text-[var(--dim)]">
        Nama, tagline, dan kontak ini tampil langsung di landing page untuk
        calon penyewa.
      </p>
      <form
        className="mt-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          saveMut.mutate();
        }}
      >
        <Field label="Nama usaha">
          <input aria-label="Nama usaha" className={inputCls} value={f.businessName} onChange={set("businessName")} placeholder="Bali Wheels Rent" />
        </Field>
        <Field label="Tagline landing page">
          <input aria-label="Tagline landing page" className={inputCls} value={f.tagline} onChange={set("tagline")} placeholder="Armada premium untuk menjelajahi Bali tanpa ribet" />
        </Field>
        <Field label="WhatsApp usaha">
          <input aria-label="Nomor WhatsApp usaha" className={inputCls} value={f.whatsapp} onChange={set("whatsapp")} placeholder="0812xxxxxxx / +62…" />
        </Field>
        <Field label="Email usaha">
          <input aria-label="Email usaha" className={inputCls} value={f.email} onChange={set("email")} placeholder="halo@usahamu.id" />
        </Field>
        <Field label="Lokasi garasi / base">
          <input aria-label="Lokasi garasi atau base" className={inputCls} value={f.baseLocation} onChange={set("baseLocation")} placeholder="Jl. Raya Canggu No. 88, Badung" />
        </Field>
        <Field label="Area layanan (pisahkan koma)">
          <input aria-label="Area layanan, pisahkan dengan koma" className={inputCls} value={f.serviceAreas} onChange={set("serviceAreas")} placeholder="Denpasar, Canggu, Seminyak, Ubud, Uluwatu, Bandara Ngurah Rai" />
        </Field>
        {error && (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-[var(--danger)]">{error}</p>
        )}
        {saved && (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
            Pengaturan tersimpan dan sudah tampil di landing page.
          </p>
        )}
        <button
          type="submit"
          disabled={saveMut.isPending}
          className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {saveMut.isPending ? "Menyimpan…" : "Simpan pengaturan"}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h3 className="text-sm font-bold text-[var(--text)]">Data demo</h3>
        <p className="mt-1 text-sm text-[var(--dim)]">
          Versi standalone ini menyimpan data di browser (localStorage).
          Kembalikan armada, booking, dan pengaturan ke contoh awal kapan pun.
        </p>
        {resetDone && (
          <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
            Data sudah dikembalikan ke contoh awal.
          </p>
        )}
        <button
          type="button"
          onClick={() => resetMut.mutate()}
          disabled={resetMut.isPending}
          className="mt-4 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-bold text-[var(--text)] disabled:opacity-60"
        >
          {resetMut.isPending ? "Mengembalikan…" : "Reset ke data contoh"}
        </button>
      </div>
    </div>
  );
}
