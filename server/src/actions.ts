import { defineAction, z, type ActionsModule } from "@hatch/space-sdk";
import { and, asc, desc, eq, gte, lte, ne } from "drizzle-orm";
import * as schema from "./schema";

// ---------- shared shapes ----------

const settingsShape = z.object({
  businessName: z.string(),
  tagline: z.string(),
  whatsapp: z.string(),
  email: z.string(),
  baseLocation: z.string(),
  serviceAreas: z.string(),
});

const vehicleShape = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  plate: z.string(),
  year: z.number().nullable(),
  transmission: z.string(),
  seats: z.number().nullable(),
  fuel: z.string(),
  dailyRate: z.number(),
  weeklyRate: z.number().nullable(),
  monthlyRate: z.number().nullable(),
  depositWni: z.number(),
  depositWna: z.number(),
  status: z.string(),
  cover: z.string(),
  imageUrl: z.string(),
  featured: z.boolean(),
  notes: z.string(),
});

const bookingShape = z.object({
  id: z.number(),
  vehicleId: z.number(),
  vehicleName: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  nationality: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  days: z.number(),
  totalPrice: z.number(),
  deposit: z.number(),
  status: z.string(),
  pickupLocation: z.string(),
  dropoffLocation: z.string(),
  withDriver: z.boolean(),
  notes: z.string(),
});

type VehicleRow = typeof schema.vehicles.$inferSelect;
type BookingRow = typeof schema.bookings.$inferSelect;

function toVehicle(row: VehicleRow): z.infer<typeof vehicleShape> {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    plate: row.plate,
    year: row.year,
    transmission: row.transmission,
    seats: row.seats,
    fuel: row.fuel,
    dailyRate: row.dailyRate,
    weeklyRate: row.weeklyRate,
    monthlyRate: row.monthlyRate,
    depositWni: row.depositWni,
    depositWna: row.depositWna,
    status: row.status,
    cover: row.cover,
    imageUrl: row.imageUrl,
    featured: row.featured === 1,
    notes: row.notes,
  };
}

function toBooking(
  row: BookingRow,
  vehicleName: string,
): z.infer<typeof bookingShape> {
  return {
    id: row.id,
    vehicleId: row.vehicleId,
    vehicleName,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    nationality: row.nationality,
    startDate: row.startDate,
    endDate: row.endDate,
    days: row.days,
    totalPrice: row.totalPrice,
    deposit: row.deposit,
    status: row.status,
    pickupLocation: row.pickupLocation,
    dropoffLocation: row.dropoffLocation,
    withDriver: row.withDriver === 1,
    notes: row.notes,
  };
}

const dateStr = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal harus format YYYY-MM-DD");

function daysBetween(start: string, end: string): number {
  const s = new Date(`${start}T00:00:00Z`).getTime();
  const e = new Date(`${end}T00:00:00Z`).getTime();
  return Math.round((e - s) / 86400000);
}

const vehicleInput = z.object({
  name: z.string().trim().min(1, "Nama kendaraan wajib diisi").max(120),
  category: z.enum(["skuter", "city", "mpv", "suv", "premium"]),
  plate: z.string().trim().max(20).default(""),
  year: z.number().int().min(1990).max(2100).nullable().default(null),
  transmission: z.enum(["matic", "manual"]).default("matic"),
  seats: z.number().int().min(1).max(60).nullable().default(null),
  fuel: z.string().trim().max(40).default(""),
  dailyRate: z.number().int().min(0).max(100_000_000),
  weeklyRate: z.number().int().min(0).max(1_000_000_000).nullable().default(null),
  monthlyRate: z.number().int().min(0).max(2_000_000_000).nullable().default(null),
  depositWni: z.number().int().min(0).max(1_000_000_000).default(0),
  depositWna: z.number().int().min(0).max(1_000_000_000).default(0),
  status: z.enum(["tersedia", "perawatan", "nonaktif"]).default("tersedia"),
  cover: z.enum(["skuter", "city", "mpv", "suv", "custom"]).default("city"),
  imageUrl: z.string().trim().max(1000).default(""),
  featured: z.boolean().default(false),
  notes: z.string().trim().max(1000).default(""),
});

const bookingInput = z.object({
  vehicleId: z.number().int().positive(),
  customerName: z.string().trim().min(1, "Nama penyewa wajib diisi").max(120),
  customerPhone: z.string().trim().max(30).default(""),
  nationality: z.enum(["WNI", "WNA"]).default("WNI"),
  startDate: dateStr,
  endDate: dateStr,
  deposit: z.number().int().min(0).max(1_000_000_000).nullable().default(null),
  totalPrice: z.number().int().min(0).max(2_000_000_000).nullable().default(null),
  status: z
    .enum(["menunggu", "terkonfirmasi", "berlangsung", "selesai", "batal"])
    .default("menunggu"),
  pickupLocation: z.string().trim().max(200).default(""),
  dropoffLocation: z.string().trim().max(200).default(""),
  withDriver: z.boolean().default(false),
  notes: z.string().trim().max(1000).default(""),
});

const ACTIVE_STATUSES = ["menunggu", "terkonfirmasi", "berlangsung"] as const;

export const Actions = {
  // ---------- settings ----------
  getSettings: defineAction({
    request: z.object({}),
    response: z.object({ settings: settingsShape.nullable() }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.settings).limit(1);
      const row = rows[0];
      return {
        settings: row
          ? {
              businessName: row.businessName,
              tagline: row.tagline,
              whatsapp: row.whatsapp,
              email: row.email,
              baseLocation: row.baseLocation,
              serviceAreas: row.serviceAreas,
            }
          : null,
      };
    },
  }),

  saveSettings: defineAction({
    request: settingsShape,
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ ok: true }> {
      const db = ctx.db<typeof schema>();
      const existing = await db.select().from(schema.settings).limit(1);
      if (existing.length === 0) {
        await db.insert(schema.settings).values({ id: 1, ...args });
      } else {
        await db
          .update(schema.settings)
          .set({ ...args, updatedAt: new Date() })
          .where(eq(schema.settings.id, 1));
      }
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // ---------- fleet ----------
  listFleet: defineAction({
    request: z.object({}),
    response: z.object({ vehicles: z.array(vehicleShape) }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db
        .select()
        .from(schema.vehicles)
        .orderBy(asc(schema.vehicles.name))
        .limit(200);
      return { vehicles: rows.map(toVehicle) };
    },
  }),

  createVehicle: defineAction({
    request: vehicleInput,
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const result = await db
        .insert(schema.vehicles)
        .values({ ...args, featured: args.featured ? 1 : 0 })
        .returning({ id: schema.vehicles.id });
      const inserted = result[0];
      if (!inserted) throw new Error("createVehicle: insert returned no rows");
      ctx.invalidateQueries();
      return { id: inserted.id };
    },
  }),

  updateVehicle: defineAction({
    request: vehicleInput.extend({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ ok: true }> {
      const db = ctx.db<typeof schema>();
      const { id, ...rest } = args;
      await db
        .update(schema.vehicles)
        .set({ ...rest, featured: rest.featured ? 1 : 0, updatedAt: new Date() })
        .where(eq(schema.vehicles.id, id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deleteVehicle: defineAction({
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({
      ok: z.boolean(),
      error: z.string().nullable(),
    }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const linked = await db
        .select({ id: schema.bookings.id })
        .from(schema.bookings)
        .where(eq(schema.bookings.vehicleId, args.id))
        .limit(1);
      if (linked.length > 0) {
        return {
          ok: false,
          error:
            "Kendaraan ini punya riwayat booking dan tidak bisa dihapus. Ubah statusnya jadi Nonaktif saja.",
        };
      }
      await db.delete(schema.vehicles).where(eq(schema.vehicles.id, args.id));
      ctx.invalidateQueries();
      return { ok: true, error: null };
    },
  }),

  // ---------- bookings ----------
  listBookings: defineAction({
    request: z.object({ limit: z.number().int().positive().max(200).default(200) }),
    response: z.object({ bookings: z.array(bookingShape) }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db
        .select()
        .from(schema.bookings)
        .orderBy(desc(schema.bookings.startDate), desc(schema.bookings.id))
        .limit(args.limit);
      const vehicles = await db.select().from(schema.vehicles);
      const nameById = new Map(vehicles.map((v) => [v.id, v.name]));
      return {
        bookings: rows.map((r) =>
          toBooking(r, nameById.get(r.vehicleId) ?? "Kendaraan dihapus"),
        ),
      };
    },
  }),

  createBooking: defineAction({
    request: bookingInput,
    response: z.object({
      ok: z.boolean(),
      id: z.number().nullable(),
      error: z.string().nullable(),
      days: z.number(),
      totalPrice: z.number(),
      deposit: z.number(),
    }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const fail = (error: string) => ({
        ok: false,
        id: null,
        error,
        days: 0,
        totalPrice: 0,
        deposit: 0,
      });
      const days = daysBetween(args.startDate, args.endDate);
      if (days < 1) {
        return fail("Tanggal selesai harus setelah tanggal mulai (minimal 1 hari).");
      }
      const vRows = await db
        .select()
        .from(schema.vehicles)
        .where(eq(schema.vehicles.id, args.vehicleId))
        .limit(1);
      const vehicle = vRows[0];
      if (!vehicle) return fail("Kendaraan tidak ditemukan.");
      if (vehicle.status === "nonaktif") {
        return fail("Kendaraan ini nonaktif dan tidak bisa dibooking.");
      }
      // Overlap check: existing.start < new.end AND existing.end > new.start
      const conflicts = await db
        .select()
        .from(schema.bookings)
        .where(
          and(
            eq(schema.bookings.vehicleId, args.vehicleId),
            ne(schema.bookings.status, "batal"),
            ne(schema.bookings.status, "selesai"),
            lte(schema.bookings.startDate, args.endDate),
            gte(schema.bookings.endDate, args.startDate),
          ),
        );
      const realConflict = conflicts.find(
        (c) => c.startDate < args.endDate && c.endDate > args.startDate,
      );
      if (realConflict) {
        return fail(
          `Bentrok dengan booking ${realConflict.customerName} (${realConflict.startDate} s/d ${realConflict.endDate}). Pilih tanggal atau unit lain.`,
        );
      }
      const totalPrice = args.totalPrice ?? vehicle.dailyRate * days;
      const deposit =
        args.deposit ??
        (args.nationality === "WNA" ? vehicle.depositWna : vehicle.depositWni);
      const result = await db
        .insert(schema.bookings)
        .values({
          vehicleId: args.vehicleId,
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
          withDriver: args.withDriver ? 1 : 0,
          notes: args.notes,
        })
        .returning({ id: schema.bookings.id });
      const inserted = result[0];
      if (!inserted) return fail("Gagal menyimpan booking.");
      ctx.invalidateQueries();
      return { ok: true, id: inserted.id, error: null, days, totalPrice, deposit };
    },
  }),

  updateBooking: defineAction({
    request: bookingInput.extend({
      id: z.number().int().positive(),
      vehicleId: z.number().int().positive().optional(),
      startDate: dateStr.optional(),
      endDate: dateStr.optional(),
    }),
    response: z.object({
      ok: z.boolean(),
      error: z.string().nullable(),
      days: z.number(),
      totalPrice: z.number(),
      deposit: z.number(),
    }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const fail = (error: string) => ({
        ok: false,
        error,
        days: 0,
        totalPrice: 0,
        deposit: 0,
      });
      const rows = await db
        .select()
        .from(schema.bookings)
        .where(eq(schema.bookings.id, args.id))
        .limit(1);
      const existing = rows[0];
      if (!existing) return fail("Booking tidak ditemukan.");
      const vehicleId = args.vehicleId ?? existing.vehicleId;
      const startDate = args.startDate ?? existing.startDate;
      const endDate = args.endDate ?? existing.endDate;
      const days = daysBetween(startDate, endDate);
      if (days < 1) {
        return fail("Tanggal selesai harus setelah tanggal mulai (minimal 1 hari).");
      }
      const vRows = await db
        .select()
        .from(schema.vehicles)
        .where(eq(schema.vehicles.id, vehicleId))
        .limit(1);
      const vehicle = vRows[0];
      if (!vehicle) return fail("Kendaraan tidak ditemukan.");
      if (args.status !== "batal" && args.status !== "selesai") {
        const conflicts = await db
          .select()
          .from(schema.bookings)
          .where(
            and(
              eq(schema.bookings.vehicleId, vehicleId),
              ne(schema.bookings.id, args.id),
              ne(schema.bookings.status, "batal"),
              ne(schema.bookings.status, "selesai"),
              lte(schema.bookings.startDate, endDate),
              gte(schema.bookings.endDate, startDate),
            ),
          );
        const realConflict = conflicts.find(
          (c) => c.startDate < endDate && c.endDate > startDate,
        );
        if (realConflict) {
          return fail(
            `Bentrok dengan booking ${realConflict.customerName} (${realConflict.startDate} s/d ${realConflict.endDate}).`,
          );
        }
      }
      const totalPrice = args.totalPrice ?? vehicle.dailyRate * days;
      const deposit =
        args.deposit ??
        (args.nationality === "WNA" ? vehicle.depositWna : vehicle.depositWni);
      await db
        .update(schema.bookings)
        .set({
          vehicleId,
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
          withDriver: args.withDriver ? 1 : 0,
          notes: args.notes,
          updatedAt: new Date(),
        })
        .where(eq(schema.bookings.id, args.id));
      ctx.invalidateQueries();
      return { ok: true, error: null, days, totalPrice, deposit };
    },
  }),

  deleteBooking: defineAction({
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.literal(true) }),
    async handler(ctx, args): Promise<{ ok: true }> {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.bookings).where(eq(schema.bookings.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  // ---------- availability + dashboard ----------
  getAvailability: defineAction({
    request: z.object({ from: dateStr, to: dateStr }),
    response: z.object({ bookings: z.array(bookingShape) }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db
        .select()
        .from(schema.bookings)
        .where(
          and(
            ne(schema.bookings.status, "batal"),
            lte(schema.bookings.startDate, args.to),
            gte(schema.bookings.endDate, args.from),
          ),
        )
        .orderBy(asc(schema.bookings.startDate));
      const vehicles = await db.select().from(schema.vehicles);
      const nameById = new Map(vehicles.map((v) => [v.id, v.name]));
      return {
        bookings: rows.map((r) =>
          toBooking(r, nameById.get(r.vehicleId) ?? "Kendaraan dihapus"),
        ),
      };
    },
  }),

  getDashboard: defineAction({
    request: z.object({ today: dateStr }),
    response: z.object({
      totalVehicles: z.number(),
      availableToday: z.number(),
      rentedToday: z.number(),
      maintenance: z.number(),
      activeBookings: z.number(),
      pendingBookings: z.number(),
      monthRevenue: z.number(),
      monthBookings: z.number(),
      todayBookings: z.array(bookingShape),
      upcomingBookings: z.array(bookingShape),
    }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const today = args.today;
      const monthPrefix = today.slice(0, 7);
      const vehicles = await db.select().from(schema.vehicles);
      const allBookings = await db.select().from(schema.bookings);
      const nameById = new Map(vehicles.map((v) => [v.id, v.name]));
      const active = allBookings.filter((b) =>
        (ACTIVE_STATUSES as readonly string[]).includes(b.status),
      );
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
        pendingBookings: allBookings.filter((b) => b.status === "menunggu")
          .length,
        monthRevenue: monthBookingsRows.reduce((s, b) => s + b.totalPrice, 0),
        monthBookings: monthBookingsRows.length,
        todayBookings: todayBookings.map((b) =>
          toBooking(b, nameById.get(b.vehicleId) ?? "Kendaraan dihapus"),
        ),
        upcomingBookings: upcoming.map((b) =>
          toBooking(b, nameById.get(b.vehicleId) ?? "Kendaraan dihapus"),
        ),
      };
    },
  }),
} satisfies ActionsModule;
