# BaliRide Rental — Manajer Rental Kendaraan Bali (Standalone Frontend)

Versi frontend mandiri dari aplikasi "Manajer Rental Kendaraan Bali":
landing page rental kendaraan di Bali plus panel pengelola (ringkasan,
armada, booking, kalender ketersediaan, pengaturan) dalam satu aplikasi
Vite + React + TypeScript.

Tidak ada backend. Seluruh data berjalan di browser:

- Data awal adalah data dummy realistis (8 unit armada, 6 booking contoh
  di Oktober 2026, pengaturan usaha "BaliRide Rental").
- Setiap perubahan tersimpan otomatis di `localStorage`, jadi tetap ada
  setelah halaman dimuat ulang.
- Logika bisnis sama seperti versi server: total harga dari tarif harian,
  deposit berbeda untuk WNI dan WNA, booking yang tanggalnya bentrok
  ditolak otomatis, dan statistik ringkasan dihitung dari data yang sama.
- Data bisa dikembalikan ke contoh awal lewat tombol "Reset ke data
  contoh" di tab Pengaturan.
- Foto memakai URL Unsplash jarak jauh, tidak ada aset gambar lokal.

## Menjalankan

```bash
bun install
bun run dev      # server pengembangan
bun run build    # build produksi ke dist/
bun run preview  # pratinjau hasil build
```

`npm install` / `npm run build` juga bisa dipakai bila tidak ada Bun.

## Deploy ke Vercel

1. Push folder ini ke repo GitHub.
2. Di Vercel, pilih "Add New Project" dan impor repo tersebut.
3. Framework preset: **Vite**. Build command `bun run build` (atau
   `npm run build`), output directory `dist`.
4. Deploy. Tidak perlu environment variable apa pun.

Karena ini aplikasi satu halaman (SPA) tanpa routing berbasis URL, tidak
ada konfigurasi rewrite tambahan yang dibutuhkan.
