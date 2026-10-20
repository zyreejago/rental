CREATE TABLE settings (
  id INTEGER PRIMARY KEY,
  business_name TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  base_location TEXT NOT NULL DEFAULT '',
  service_areas TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE vehicles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'city',
  plate TEXT NOT NULL DEFAULT '',
  year INTEGER,
  transmission TEXT NOT NULL DEFAULT 'matic',
  seats INTEGER,
  fuel TEXT NOT NULL DEFAULT '',
  daily_rate INTEGER NOT NULL DEFAULT 0,
  weekly_rate INTEGER,
  monthly_rate INTEGER,
  deposit_wni INTEGER NOT NULL DEFAULT 0,
  deposit_wna INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'tersedia',
  cover TEXT NOT NULL DEFAULT 'city',
  image_url TEXT NOT NULL DEFAULT '',
  featured INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL DEFAULT '',
  nationality TEXT NOT NULL DEFAULT 'WNI',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  days INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL DEFAULT 0,
  deposit INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'menunggu',
  pickup_location TEXT NOT NULL DEFAULT '',
  dropoff_location TEXT NOT NULL DEFAULT '',
  with_driver INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
DROP TABLE entries;
