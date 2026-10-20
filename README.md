# Manajer Rental Kendaraan Bali

Sistem manajemen rental kendaraan untuk usaha rental di Bali. Satu aplikasi berisi dua tampilan:

**Landing page pelanggan**
- Hero dan katalog armada dengan tarif harian, mingguan, bulanan
- Deposit berbeda untuk penyewa WNI dan WNA
- Area layanan antar jemput dan langkah cara sewa
- Tombol sewa per unit yang mengarah ke WhatsApp

**Panel Kelola Rental**
- Ringkasan: statistik armada, serah terima hari ini, pendapatan bulan berjalan
- Armada: tambah, ubah, hapus kendaraan (plat, tarif, deposit ganda, status, foto sampul)
- Booking: pencatatan penyewa WNI/WNA, harga dan deposit terhitung otomatis, booking dengan tanggal bentrok otomatis ditolak
- Kalender ketersediaan bulanan berkode warna
- Pengaturan: nama usaha, tagline, nomor WhatsApp, area layanan (langsung tampil di landing page)

## Catatan

File gambar di `client/src/assets/` dan `icon.webp` tidak ikut terunggah lewat jalur API dan perlu ditambahkan manual bila repo ini mau dijalankan standalone. Database lokal `app.db` juga tidak disertakan; skema ada di folder `drizzle/`.
