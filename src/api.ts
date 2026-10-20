import { UNIT_PHOTO } from "./unitPhoto";
// Lapisan data lokal pengganti RPC server.
//
// Versi standalone dari "Manajer Rental Kendaraan Bali": tidak ada server,
// tidak ada @hatch/space-sdk. Semua fungsi meniru tanda tangan dan bentuk
// hasil `server/src/actions.ts` versi aslinya, tetapi berjalan di atas data
// dummy (seed) yang tersimpan di localStorage browser.
//
// Logika bisnis dipertahankan persis seperti server asli:
// - total harga default = tarif harian x jumlah hari
// - deposit default dibedakan WNI vs WNA dari profil kendaraan
// - booking yang tanggalnya bentrok dengan booking aktif (bukan batal /
//   selesai) pada kendaraan yang sama ditolak
// - kendaraan yang punya riwayat booking tidak bisa dihapus
// - statistik dashboard dihitung dari data yang sama

export interface SettingsData {
  businessName: string;
  tagline: string;
  whatsapp: string;
  email: string;
  baseLocation: string;
  serviceAreas: string;
}

export type VehicleCategory = "skuter" | "city" | "mpv" | "suv" | "premium";
export type VehicleStatus = "tersedia" | "perawatan" | "nonaktif";
export type VehicleCover = "skuter" | "city" | "mpv" | "suv" | "custom";

export interface VehicleData {
  id: number;
  name: string;
  category: VehicleCategory;
  plate: string;
  year: number | null;
  transmission: "matic" | "manual";
  seats: number | null;
  fuel: string;
  dailyRate: number;
  weeklyRate: number | null;
  monthlyRate: number | null;
  depositWni: number;
  depositWna: number;
  status: VehicleStatus;
  cover: VehicleCover;
  imageUrl: string;
  featured: boolean;
  notes: string;
}

export type BookingStatus =
  | "menunggu"
  | "terkonfirmasi"
  | "berlangsung"
  | "selesai"
  | "batal";

export interface BookingData {
  id: number;
  vehicleId: number;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  nationality: "WNI" | "WNA";
  startDate: string;
  endDate: string;
  days: number;
  totalPrice: number;
  deposit: number;
  status: BookingStatus;
  pickupLocation: string;
  dropoffLocation: string;
  withDriver: boolean;
  notes: string;
}

export interface DashboardData {
  totalVehicles: number;
  availableToday: number;
  rentedToday: number;
  maintenance: number;
  activeBookings: number;
  pendingBookings: number;
  monthRevenue: number;
  monthBookings: number;
  todayBookings: BookingData[];
  upcomingBookings: BookingData[];
}

export interface VehicleInput {
  name: string;
  category: VehicleCategory;
  plate: string;
  year: number | null;
  transmission: "matic" | "manual";
  seats: number | null;
  fuel: string;
  dailyRate: number;
  weeklyRate: number | null;
  monthlyRate: number | null;
  depositWni: number;
  depositWna: number;
  status: VehicleStatus;
  cover: VehicleCover;
  imageUrl: string;
  featured: boolean;
  notes: string;
}

export interface BookingInput {
  vehicleId: number;
  customerName: string;
  customerPhone: string;
  nationality: "WNI" | "WNA";
  startDate: string;
  endDate: string;
  deposit: number | null;
  totalPrice: number | null;
  status: BookingStatus;
  pickupLocation: string;
  dropoffLocation: string;
  withDriver: boolean;
  notes: string;
}

export type UpdateBookingInput = Omit<
  BookingInput,
  "vehicleId" | "startDate" | "endDate"
> & {
  id: number;
  vehicleId?: number;
  startDate?: string;
  endDate?: string;
};

export interface BookingResult {
  ok: boolean;
  id: number | null;
  error: string | null;
  days: number;
  totalPrice: number;
  deposit: number;
}

// ---------- store ----------

interface Store {
  settings: SettingsData;
  vehicles: VehicleData[];
  bookings: BookingData[];
  nextVehicleId: number;
  nextBookingId: number;
}

const STORAGE_KEY = "zeerental:store:v3";
const ACTIVE_STATUSES: readonly string[] = [
  "menunggu",
  "terkonfirmasi",
  "berlangsung",
];

function seedStore(): Store {
  return {
    settings: {
      businessName: "ZeeRental",
      tagline:
        "Mobil dan motor terawat, harga final tanpa biaya siluman, diantar ke hotel, villa, atau bandara di seluruh Bali.",
      whatsapp: "081234567890",
      email: "halo@zeerental.id",
      baseLocation: "Jl. Gunung Sanghyang No. 88, Denpasar",
      serviceAreas: "Denpasar, Ubud, Canggu, Seminyak, Uluwatu, Sanur, Bandara Ngurah Rai",
    },
    vehicles: [
      {
        id: 1,
        name: "Toyota Avanza 1.5 G",
        category: "mpv",
        plate: "DK 1872 QF",
        year: 2022,
        transmission: "matic",
        seats: 7,
        fuel: "Bensin",
        dailyRate: 350000,
        weeklyRate: 2100000,
        monthlyRate: 6500000,
        depositWni: 500000,
        depositWna: 2000000,
        status: "tersedia",
        cover: "mpv",
        imageUrl: UNIT_PHOTO,
        featured: true,
        notes: "Unit keluarga paling laris, servis rutin di bengkel resmi.",
      },
      {
        id: 2,
        name: "Honda Brio Satya",
        category: "city",
        plate: "DK 1543 KB",
        year: 2021,
        transmission: "matic",
        seats: 5,
        fuel: "Bensin",
        dailyRate: 250000,
        weeklyRate: 1500000,
        monthlyRate: 4500000,
        depositWni: 300000,
        depositWna: 1500000,
        status: "tersedia",
        cover: "city",
        imageUrl: UNIT_PHOTO,
        featured: false,
        notes: "",
      },
      {
        id: 3,
        name: "Toyota Innova Reborn 2.4",
        category: "mpv",
        plate: "DK 1108 ZA",
        year: 2023,
        transmission: "matic",
        seats: 7,
        fuel: "Diesel",
        dailyRate: 550000,
        weeklyRate: 3300000,
        monthlyRate: 9500000,
        depositWni: 1000000,
        depositWna: 3000000,
        status: "tersedia",
        cover: "mpv",
        imageUrl: UNIT_PHOTO,
        featured: true,
        notes: "Favorit untuk tur keluarga dengan sopir.",
      },
      {
        id: 4,
        name: "Toyota Fortuner VRZ",
        category: "suv",
        plate: "DK 9090 WJ",
        year: 2021,
        transmission: "matic",
        seats: 7,
        fuel: "Diesel",
        dailyRate: 850000,
        weeklyRate: 5100000,
        monthlyRate: 15000000,
        depositWni: 1500000,
        depositWna: 5000000,
        status: "perawatan",
        cover: "suv",
        imageUrl: UNIT_PHOTO,
        featured: false,
        notes: "Sedang servis berkala, estimasi selesai 24 Okt 2026.",
      },
      {
        id: 5,
        name: "Honda Vario 160",
        category: "skuter",
        plate: "DK 4321 PL",
        year: 2023,
        transmission: "matic",
        seats: 2,
        fuel: "Bensin",
        dailyRate: 80000,
        weeklyRate: 480000,
        monthlyRate: 1500000,
        depositWni: 200000,
        depositWna: 1000000,
        status: "tersedia",
        cover: "skuter",
        imageUrl: UNIT_PHOTO,
        featured: false,
        notes: "",
      },
      {
        id: 6,
        name: "Yamaha NMAX 155",
        category: "skuter",
        plate: "DK 6789 TR",
        year: 2022,
        transmission: "matic",
        seats: 2,
        fuel: "Bensin",
        dailyRate: 100000,
        weeklyRate: 600000,
        monthlyRate: 1800000,
        depositWni: 300000,
        depositWna: 1500000,
        status: "tersedia",
        cover: "skuter",
        imageUrl: UNIT_PHOTO,
        featured: true,
        notes: "Sudah termasuk dua helm dan jas hujan.",
      },
      {
        id: 7,
        name: "Honda Scoopy Stylish",
        category: "skuter",
        plate: "DK 2210 MN",
        year: 2023,
        transmission: "matic",
        seats: 2,
        fuel: "Bensin",
        dailyRate: 70000,
        weeklyRate: 420000,
        monthlyRate: 1200000,
        depositWni: 200000,
        depositWna: 1000000,
        status: "tersedia",
        cover: "skuter",
        imageUrl: UNIT_PHOTO,
        featured: false,
        notes: "",
      },
      {
        id: 8,
        name: "Daihatsu Ayla 1.0",
        category: "city",
        plate: "DK 1357 CD",
        year: 2018,
        transmission: "manual",
        seats: 5,
        fuel: "Bensin",
        dailyRate: 200000,
        weeklyRate: 1200000,
        monthlyRate: 3500000,
        depositWni: 300000,
        depositWna: 1000000,
        status: "nonaktif",
        cover: "city",
        imageUrl: UNIT_PHOTO,
        featured: false,
        notes: "Unit lama, dijual bertahap.",
      },
    ],
    bookings: [
      {
        id: 1,
        vehicleId: 6,
        vehicleName: "Yamaha NMAX 155",
        customerName: "Jack Thompson",
        customerPhone: "+61 412 555 908",
        nationality: "WNA",
        startDate: "2026-10-19",
        endDate: "2026-10-24",
        days: 5,
        totalPrice: 500000,
        deposit: 1500000,
        status: "berlangsung",
        pickupLocation: "Canggu",
        dropoffLocation: "Canggu",
        withDriver: false,
        notes: "Minta dua helm.",
      },
      {
        id: 2,
        vehicleId: 1,
        vehicleName: "Toyota Avanza 1.5 G",
        customerName: "Made Wirawan",
        customerPhone: "081339028475",
        nationality: "WNI",
        startDate: "2026-10-20",
        endDate: "2026-10-23",
        days: 3,
        totalPrice: 1050000,
        deposit: 500000,
        status: "berlangsung",
        pickupLocation: "Bandara Ngurah Rai",
        dropoffLocation: "Sanur",
        withDriver: true,
        notes: "",
      },
      {
        id: 3,
        vehicleId: 2,
        vehicleName: "Honda Brio Satya",
        customerName: "Ni Luh Ayu Kartika",
        customerPhone: "087761204533",
        nationality: "WNI",
        startDate: "2026-10-25",
        endDate: "2026-10-28",
        days: 3,
        totalPrice: 750000,
        deposit: 300000,
        status: "terkonfirmasi",
        pickupLocation: "Denpasar",
        dropoffLocation: "Denpasar",
        withDriver: false,
        notes: "",
      },
      {
        id: 4,
        vehicleId: 3,
        vehicleName: "Toyota Innova Reborn 2.4",
        customerName: "Emma Wilson",
        customerPhone: "+44 7700 900321",
        nationality: "WNA",
        startDate: "2026-10-28",
        endDate: "2026-11-02",
        days: 5,
        totalPrice: 2750000,
        deposit: 3000000,
        status: "menunggu",
        pickupLocation: "Ubud",
        dropoffLocation: "Bandara Ngurah Rai",
        withDriver: true,
        notes: "Butuh child seat.",
      },
      {
        id: 5,
        vehicleId: 5,
        vehicleName: "Honda Vario 160",
        customerName: "Budi Santoso",
        customerPhone: "085792114608",
        nationality: "WNI",
        startDate: "2026-10-05",
        endDate: "2026-10-08",
        days: 3,
        totalPrice: 240000,
        deposit: 200000,
        status: "selesai",
        pickupLocation: "Kuta",
        dropoffLocation: "Kuta",
        withDriver: false,
        notes: "",
      },
      {
        id: 6,
        vehicleId: 7,
        vehicleName: "Honda Scoopy Stylish",
        customerName: "Lucas Meyer",
        customerPhone: "+49 171 555 2034",
        nationality: "WNA",
        startDate: "2026-10-21",
        endDate: "2026-10-23",
        days: 2,
        totalPrice: 140000,
        deposit: 1000000,
        status: "terkonfirmasi",
        pickupLocation: "Canggu",
        dropoffLocation: "Canggu",
        withDriver: false,
        notes: "",
      },
    ],
    nextVehicleId: 9,
    nextBookingId: 7,
  };
}

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Store;
      if (
        parsed &&
        typeof parsed === "object" &&
        Array.isArray(parsed.vehicles) &&
        Array.isArray(parsed.bookings) &&
        parsed.settings
      ) {
        return parsed;
      }
    }
  } catch {
    // data rusak di localStorage: kembali ke seed
  }
  const fresh = seedStore();
  persist(fresh);
  return fresh;
}

function persist(s: Store): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // localStorage penuh / diblokir: aplikasi tetap jalan dari memori
  }
}

let store: Store = loadStore();

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function daysBetween(start: string, end: string): number {
  const s = new Date(`${start}T00:00:00Z`).getTime();
  const e = new Date(`${end}T00:00:00Z`).getTime();
  return Math.round((e - s) / 86400000);
}

function withVehicleName(b: BookingData): BookingData {
  const names = new Map(store.vehicles.map((v) => [v.id, v.name]));
  return { ...b, vehicleName: names.get(b.vehicleId) ?? "Kendaraan dihapus" };
}

// Cek bentrok persis seperti server asli: kandidat adalah booking pada
// kendaraan yang sama berstatus bukan batal/selesai yang rentangnya
// bersinggungan, lalu bentrok nyata bila start < endBaru dan end > startBaru.
function findConflict(
  vehicleId: number,
  startDate: string,
  endDate: string,
  excludeBookingId?: number,
): BookingData | undefined {
  const candidates = store.bookings.filter(
    (b) =>
      b.vehicleId === vehicleId &&
      b.id !== excludeBookingId &&
      b.status !== "batal" &&
      b.status !== "selesai" &&
      b.startDate <= endDate &&
      b.endDate >= startDate,
  );
  return candidates.find((c) => c.startDate < endDate && c.endDate > startDate);
}

// ---------- api (tanda tangan sama seperti RPC asli) ----------

export const api = {
  // ---------- settings ----------
  async getSettings(
    _args: Record<string, never>,
  ): Promise<{ settings: SettingsData | null }> {
    return { settings: store.settings ? clone(store.settings) : null };
  },

  async saveSettings(args: SettingsData): Promise<{ ok: true }> {
    store.settings = clone(args);
    persist(store);
    return { ok: true as const };
  },

  // ---------- fleet ----------
  async listFleet(
    _args: Record<string, never>,
  ): Promise<{ vehicles: VehicleData[] }> {
    const vehicles = [...store.vehicles]
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 200);
    return { vehicles: clone(vehicles) };
  },

  async createVehicle(args: VehicleInput): Promise<{ id: number }> {
    const id = store.nextVehicleId++;
    store.vehicles.push({ ...clone(args), id });
    persist(store);
    return { id };
  },

  async updateVehicle(
    args: VehicleInput & { id: number },
  ): Promise<{ ok: true }> {
    const { id, ...rest } = args;
    const idx = store.vehicles.findIndex((v) => v.id === id);
    if (idx >= 0) {
      store.vehicles[idx] = { ...clone(rest), id };
      persist(store);
    }
    return { ok: true as const };
  },

  async deleteVehicle(args: {
    id: number;
  }): Promise<{ ok: boolean; error: string | null }> {
    const linked = store.bookings.some((b) => b.vehicleId === args.id);
    if (linked) {
      return {
        ok: false,
        error:
          "Kendaraan ini punya riwayat booking dan tidak bisa dihapus. Ubah statusnya jadi Nonaktif saja.",
      };
    }
    store.vehicles = store.vehicles.filter((v) => v.id !== args.id);
    persist(store);
    return { ok: true, error: null };
  },

  // ---------- bookings ----------
  async listBookings(args: {
    limit: number;
  }): Promise<{ bookings: BookingData[] }> {
    const rows = [...store.bookings]
      .sort((a, b) => b.startDate.localeCompare(a.startDate) || b.id - a.id)
      .slice(0, args.limit);
    return { bookings: clone(rows.map(withVehicleName)) };
  },

  async createBooking(args: BookingInput): Promise<BookingResult> {
    const fail = (error: string): BookingResult => ({
      ok: false,
      id: null,
      error,
      days: 0,
      totalPrice: 0,
      deposit: 0,
    });
    const days = daysBetween(args.startDate, args.endDate);
    if (days < 1) {
      return fail(
        "Tanggal selesai harus setelah tanggal mulai (minimal 1 hari).",
      );
    }
    const vehicle = store.vehicles.find((v) => v.id === args.vehicleId);
    if (!vehicle) return fail("Kendaraan tidak ditemukan.");
    if (vehicle.status === "nonaktif") {
      return fail("Kendaraan ini nonaktif dan tidak bisa dibooking.");
    }
    const conflict = findConflict(args.vehicleId, args.startDate, args.endDate);
    if (conflict) {
      return fail(
        `Bentrok dengan booking ${conflict.customerName} (${conflict.startDate} s/d ${conflict.endDate}). Pilih tanggal atau unit lain.`,
      );
    }
    const totalPrice = args.totalPrice ?? vehicle.dailyRate * days;
    const deposit =
      args.deposit ??
      (args.nationality === "WNA" ? vehicle.depositWna : vehicle.depositWni);
    const id = store.nextBookingId++;
    store.bookings.push({
      id,
      vehicleId: args.vehicleId,
      vehicleName: vehicle.name,
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      nationality: args.nationality,
      startDate: args.startDate,
      endDate: args.endDate,
      days,
      totalPrice,
      deposit,
      status: args.status,
      pickupLocation: args.pickupLocation,
      dropoffLocation: args.dropoffLocation,
      withDriver: args.withDriver,
      notes: args.notes,
    });
    persist(store);
    return { ok: true, id, error: null, days, totalPrice, deposit };
  },

  async updateBooking(
    args: UpdateBookingInput,
  ): Promise<Omit<BookingResult, "id">> {
    const fail = (error: string) => ({
      ok: false,
      error,
      days: 0,
      totalPrice: 0,
      deposit: 0,
    });
    const existing = store.bookings.find((b) => b.id === args.id);
    if (!existing) return fail("Booking tidak ditemukan.");
    const vehicleId = args.vehicleId ?? existing.vehicleId;
    const startDate = args.startDate ?? existing.startDate;
    const endDate = args.endDate ?? existing.endDate;
    const days = daysBetween(startDate, endDate);
    if (days < 1) {
      return fail(
        "Tanggal selesai harus setelah tanggal mulai (minimal 1 hari).",
      );
    }
    const vehicle = store.vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return fail("Kendaraan tidak ditemukan.");
    if (args.status !== "batal" && args.status !== "selesai") {
      const conflict = findConflict(vehicleId, startDate, endDate, args.id);
      if (conflict) {
        return fail(
          `Bentrok dengan booking ${conflict.customerName} (${conflict.startDate} s/d ${conflict.endDate}).`,
        );
      }
    }
    const totalPrice = args.totalPrice ?? vehicle.dailyRate * days;
    const deposit =
      args.deposit ??
      (args.nationality === "WNA" ? vehicle.depositWna : vehicle.depositWni);
    const updated: BookingData = {
      ...existing,
      vehicleId,
      vehicleName: vehicle.name,
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      nationality: args.nationality,
      startDate,
      endDate,
      days,
      totalPrice,
      deposit,
      status: args.status,
      pickupLocation: args.pickupLocation,
      dropoffLocation: args.dropoffLocation,
      withDriver: args.withDriver,
      notes: args.notes,
    };
    store.bookings = store.bookings.map((b) =>
      b.id === args.id ? updated : b,
    );
    persist(store);
    return { ok: true, error: null, days, totalPrice, deposit };
  },

  async deleteBooking(args: { id: number }): Promise<{ ok: true }> {
    store.bookings = store.bookings.filter((b) => b.id !== args.id);
    persist(store);
    return { ok: true as const };
  },

  // ---------- availability + dashboard ----------
  async getAvailability(args: {
    from: string;
    to: string;
  }): Promise<{ bookings: BookingData[] }> {
    const rows = store.bookings
      .filter(
        (b) =>
          b.status !== "batal" &&
          b.startDate <= args.to &&
          b.endDate >= args.from,
      )
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
    return { bookings: clone(rows.map(withVehicleName)) };
  },

  async getDashboard(args: { today: string }): Promise<DashboardData> {
    const today = args.today;
    const monthPrefix = today.slice(0, 7);
    const vehicles = store.vehicles;
    const allBookings = store.bookings;
    const active = allBookings.filter((b) => ACTIVE_STATUSES.includes(b.status));
    const busyToday = new Set(
      active
        .filter((b) => b.startDate <= today && b.endDate > today)
        .map((b) => b.vehicleId),
    );
    const operational = vehicles.filter((v) => v.status !== "nonaktif");
    const availableToday = operational.filter(
      (v) => v.status === "tersedia" && !busyToday.has(v.id),
    ).length;
    const monthBookingsRows = allBookings.filter(
      (b) => b.status !== "batal" && b.startDate.startsWith(monthPrefix),
    );
    const todayBookings = active
      .filter((b) => b.startDate === today || b.endDate === today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
    const upcoming = active
      .filter((b) => b.startDate > today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, 6);
    return {
      totalVehicles: operational.length,
      availableToday,
      rentedToday: busyToday.size,
      maintenance: vehicles.filter((v) => v.status === "perawatan").length,
      activeBookings: active.length,
      pendingBookings: allBookings.filter((b) => b.status === "menunggu").length,
      monthRevenue: monthBookingsRows.reduce((s, b) => s + b.totalPrice, 0),
      monthBookings: monthBookingsRows.length,
      todayBookings: clone(todayBookings.map(withVehicleName)),
      upcomingBookings: clone(upcoming.map(withVehicleName)),
    };
  },

  // ---------- khusus versi standalone ----------
  /** Kembalikan seluruh data ke seed awal (data dummy). */
  async resetData(): Promise<{ ok: true }> {
    store = seedStore();
    persist(store);
    return { ok: true as const };
  },
};
