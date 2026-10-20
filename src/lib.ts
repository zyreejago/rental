import type {
  BookingData,
  DashboardData,
  SettingsData,
  VehicleData,
} from "./api";

export type Vehicle = VehicleData;
export type Booking = BookingData;
export type Settings = SettingsData;
export type Dashboard = DashboardData;

export const CATEGORIES: Record<string, string> = {
  skuter: "Skuter",
  city: "City Car",
  mpv: "MPV Keluarga",
  suv: "SUV",
  premium: "Premium",
};

export const BOOKING_STATUS: Record<
  string,
  { label: string; badge: string; dot: string; cal: string }
> = {
  menunggu: {
    label: "Menunggu",
    badge: "bg-amber-100 text-amber-900 border border-amber-300",
    dot: "bg-amber-500",
    cal: "bg-amber-400/80 text-amber-950",
  },
  terkonfirmasi: {
    label: "Terkonfirmasi",
    badge: "bg-emerald-100 text-emerald-900 border border-emerald-300",
    dot: "bg-emerald-600",
    cal: "bg-emerald-600/85 text-white",
  },
  berlangsung: {
    label: "Berlangsung",
    badge: "bg-sky-100 text-sky-900 border border-sky-300",
    dot: "bg-sky-600",
    cal: "bg-sky-600/85 text-white",
  },
  selesai: {
    label: "Selesai",
    badge: "bg-stone-200 text-stone-700 border border-stone-300",
    dot: "bg-stone-400",
    cal: "bg-stone-400/70 text-stone-900",
  },
  batal: {
    label: "Batal",
    badge: "bg-rose-100 text-rose-900 border border-rose-300",
    dot: "bg-rose-500",
    cal: "bg-rose-400/70 text-rose-950",
  },
};

export const VEHICLE_STATUS: Record<string, { label: string; badge: string }> = {
  tersedia: {
    label: "Tersedia",
    badge: "bg-emerald-100 text-emerald-900 border border-emerald-300",
  },
  perawatan: {
    label: "Perawatan",
    badge: "bg-orange-100 text-orange-900 border border-orange-300",
  },
  nonaktif: {
    label: "Nonaktif",
    badge: "bg-stone-200 text-stone-600 border border-stone-300",
  },
};

export function rp(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export function rpShort(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1).replace(".", ",")} M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace(".", ",")} jt`;
  if (n >= 1_000) return `Rp ${Math.round(n / 1_000)} rb`;
  return rp(n);
}

export function todayStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDaysStr(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return todayStr(d);
}

export function fmtDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function fmtDateShort(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function waLink(phone: string, text: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

// Foto sampul preset per kategori kendaraan (Unsplash, URL terverifikasi).
const COVER_URLS: Record<string, string> = {
  skuter:
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop",
  city: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop",
  mpv: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop",
  suv: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
  premium:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
};

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop";

export function vehicleImage(v: VehicleData): string {
  if (v.cover === "custom" && v.imageUrl) return v.imageUrl;
  return COVER_URLS[v.cover] ?? COVER_URLS[v.category] ?? FALLBACK_COVER;
}
