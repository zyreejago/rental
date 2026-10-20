# ZeeRental

Situs satu halaman untuk bisnis rental mobil dan motor di Bali. Frontend saja
(React + TypeScript + Tailwind CSS lewat Vite), tanpa backend dan tanpa panel
admin. Semua tombol sewa mengarah ke WhatsApp dengan pesan otomatis.

## Menjalankan

```bash
bun install
bun run dev
```

## Build produksi

```bash
bun run build
```

Hasil build ada di folder `dist/`.

## Deploy ke Vercel

Impor repo ini di Vercel, framework preset pilih **Vite**, build command
`bun run build` (atau `npm run build`), output directory `dist`. Tidak ada
environment variable yang perlu diatur.

## Mengubah data

Armada, testimoni, FAQ, dan teks utama ada di `src/data.ts`. Nomor WhatsApp
tujuan tombol sewa juga diatur di file itu (`BUSINESS.whatsapp`).
