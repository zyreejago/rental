import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey(),
  businessName: text("business_name").notNull().default(""),
  tagline: text("tagline").notNull().default(""),
  whatsapp: text("whatsapp").notNull().default(""),
  email: text("email").notNull().default(""),
  baseLocation: text("base_location").notNull().default(""),
  serviceAreas: text("service_areas").notNull().default(""),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const vehicles = sqliteTable("vehicles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category", {
    enum: ["skuter", "city", "mpv", "suv", "premium"],
  })
    .notNull()
    .default("city"),
  plate: text("plate").notNull().default(""),
  year: integer("year"),
  transmission: text("transmission", { enum: ["matic", "manual"] })
    .notNull()
    .default("matic"),
  seats: integer("seats"),
  fuel: text("fuel").notNull().default(""),
  dailyRate: integer("daily_rate").notNull().default(0),
  weeklyRate: integer("weekly_rate"),
  monthlyRate: integer("monthly_rate"),
  depositWni: integer("deposit_wni").notNull().default(0),
  depositWna: integer("deposit_wna").notNull().default(0),
  status: text("status", {
    enum: ["tersedia", "perawatan", "nonaktif"],
  })
    .notNull()
    .default("tersedia"),
  cover: text("cover", {
    enum: ["skuter", "city", "mpv", "suv", "custom"],
  })
    .notNull()
    .default("city"),
  imageUrl: text("image_url").notNull().default(""),
  featured: integer("featured").notNull().default(0),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vehicleId: integer("vehicle_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull().default(""),
  nationality: text("nationality", { enum: ["WNI", "WNA"] })
    .notNull()
    .default("WNI"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  days: integer("days").notNull().default(1),
  totalPrice: integer("total_price").notNull().default(0),
  deposit: integer("deposit").notNull().default(0),
  status: text("status", {
    enum: ["menunggu", "terkonfirmasi", "berlangsung", "selesai", "batal"],
  })
    .notNull()
    .default("menunggu"),
  pickupLocation: text("pickup_location").notNull().default(""),
  dropoffLocation: text("dropoff_location").notNull().default(""),
  withDriver: integer("with_driver").notNull().default(0),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});
