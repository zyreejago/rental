import { UNIT_PHOTO } from "./unitPhoto";
// Data dummy ZeeRental. Semua konten situs dibaca dari file ini,
// jadi pemilik tinggal mengedit di sini tanpa menyentuh komponen.

export const BUSINESS = {
  name: "ZeeRental",
  tagline: "Sewa mobil dan motor di Bali",
  whatsapp: "6281234567890",
  whatsappDisplay: "0812 3456 7890",
  city: "Denpasar, Bali",
  workHours: "08.00–21.00 WITA",
} as const;

export function waLink(message: string): string {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const WA_GENERAL = waLink(
  "Halo ZeeRental, saya mau tanya-tanya dulu soal sewa kendaraan di Bali.",
);

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const IMAGES = {
  hero: img("photo-1507525428034-b723cf961d3e", 1600),
  gate: img("photo-1537996194471-e657df975ab4", 1000),
  terrace: img("photo-1512100356356-de1b84283e18", 1000),
} as const;

export interface TrustStat {
  value: string;
  label: string;
}

export const TRUST_STATS: TrustStat[] = [
  { value: "±15 menit", label: "unit diantar ke area kota Denpasar" },
  { value: "100%", label: "harga final, tanpa biaya siluman" },
  { value: "24 jam", label: "dukungan WhatsApp selama masa sewa" },
  { value: "5 hari kerja", label: "batas maksimal deposit Anda kembali" },
];

export type VehicleKind = "Mobil" | "Motor";

export interface Vehicle {
  id: string;
  name: string;
  kind: VehicleKind;
  image: string;
  pricePerDay: number;
  specs: string[];
  note: string;
  depositWni: number;
  depositWna: number;
}

export const VEHICLES: Vehicle[] = [
  {
    id: "avanza",
    name: "Toyota Avanza",
    kind: "Mobil",
    image: UNIT_PHOTO,
    pricePerDay: 350_000,
    specs: ["7 kursi", "Matic", "Bensin"],
    note: "Andalan keluarga dan rombongan kecil. Bagasi lega, AC dingin sampai baris belakang.",
    depositWni: 500_000,
    depositWna: 3_000_000,
  },
  {
    id: "brio",
    name: "Honda Brio",
    kind: "Mobil",
    image: UNIT_PHOTO,
    pricePerDay: 300_000,
    specs: ["5 kursi", "Matic", "Bensin"],
    note: "Kecil, lincah, gampang parkir di gang Kuta sekalipun. Irit buat keliling kota.",
    depositWni: 500_000,
    depositWna: 2_500_000,
  },
  {
    id: "innova",
    name: "Toyota Innova Reborn",
    kind: "Mobil",
    image: UNIT_PHOTO,
    pricePerDay: 550_000,
    specs: ["7 kursi", "Matic", "Diesel"],
    note: "Buat perjalanan jauh ke Kintamani atau Bedugul tanpa pegal. Kabin senyap, tenaga enak.",
    depositWni: 1_000_000,
    depositWna: 3_000_000,
  },
  {
    id: "fortuner",
    name: "Toyota Fortuner",
    kind: "Mobil",
    image: UNIT_PHOTO,
    pricePerDay: 850_000,
    specs: ["7 kursi", "Matic", "Diesel"],
    note: "Tinggi, gagah, pede di jalur tanah menuju pantai tersembunyi. Favorit buat trip serius.",
    depositWni: 1_500_000,
    depositWna: 5_000_000,
  },
  {
    id: "vario",
    name: "Honda Vario 160",
    kind: "Motor",
    image: UNIT_PHOTO,
    pricePerDay: 100_000,
    specs: ["Matic", "2 helm", "Bagasi lega"],
    note: "Pas buat berdua keliling Denpasar sampai Sanur. Tarikan enteng, bagasi muat belanjaan.",
    depositWni: 300_000,
    depositWna: 1_000_000,
  },
  {
    id: "nmax",
    name: "Yamaha NMAX",
    kind: "Motor",
    image: UNIT_PHOTO,
    pricePerDay: 150_000,
    specs: ["Matic", "2 helm", "Jok lebar"],
    note: "Buat rute jauh ke Ubud atau Uluwatu. Duduknya santai, nggak bikin pinggang protes.",
    depositWni: 300_000,
    depositWna: 1_000_000,
  },
  {
    id: "scoopy",
    name: "Honda Scoopy",
    kind: "Motor",
    image: UNIT_PHOTO,
    pricePerDay: 90_000,
    specs: ["Matic", "2 helm", "Paling irit"],
    note: "Paling ringan dan paling irit di garasi kami. Andalan anak kos sampai wisatawan solo.",
    depositWni: 300_000,
    depositWna: 1_000_000,
  },
];

export interface IncludedItem {
  title: string;
  text: string;
}

export const INCLUDED: IncludedItem[] = [
  {
    title: "Unit dicuci dan dicek sebelum diantar",
    text: "Ban, rem, lampu, dan oli kami periksa satu-satu. Anda terima unit dalam keadaan siap jalan, bukan siap masuk bengkel.",
  },
  {
    title: "Antar jemput Denpasar dan bandara",
    text: "Kami yang datang ke hotel, villa, atau lobi bandara. Anda tidak perlu naik taksi dulu cuma buat ambil kendaraan.",
  },
  {
    title: "Bensin awal yang cukup",
    text: "Unit berangkat dengan bensin cukup untuk langsung jalan. Tidak ada cerita mogok di pom pertama gara-gara tangki kosong.",
  },
  {
    title: "Helm dan jas hujan untuk motor",
    text: "Dua helm bersih dan jas hujan selalu ada di bagasi. Cuaca Bali memang suka berubah pikiran.",
  },
  {
    title: "Deposit kembali maksimal 5 hari kerja",
    text: "Setelah unit kami cek, deposit ditransfer balik utuh. Kalau ada potongan, rinciannya kami kirim terang-terangan, tanpa potongan misterius.",
  },
];

export interface Step {
  title: string;
  duration: string;
  text: string;
  yourPart: string;
}

export const STEPS: Step[] = [
  {
    title: "Chat dan pilih unit",
    duration: "±5 menit",
    text: "Ceritakan tanggal, lokasi menginap, dan rencana perjalanan Anda. Kami jawab dengan unit yang tersedia dan harga finalnya, bukan harga kira-kira.",
    yourPart: "tulis seadanya lewat WhatsApp, tidak perlu format khusus.",
  },
  {
    title: "Sepakati harga dan deposit",
    duration: "±10 menit",
    text: "Total harga dan deposit kami tulis jelas di chat sebelum Anda membayar apa pun. Kalau sudah setuju, jadwal unit itu kami kunci untuk Anda.",
    yourPart: "cek rinciannya, dan tanya dulu kalau ada yang kurang jelas.",
  },
  {
    title: "Unit kami antar",
    duration: "±15 menit di area kota",
    text: "Mobil atau motor datang bersih, bensin cukup, dan sudah dicek satu-satu. Serah terima di hotel, villa, atau lobi bandara, dokumen cukup difoto.",
    yourPart: "siapkan KTP dan SIM (WNI) atau paspor (WNA) untuk difoto.",
  },
  {
    title: "Jalan dengan tenang",
    duration: "selama masa sewa",
    text: "Keliling Bali sesuka Anda. Kalau ada bunyi aneh, ban kempes, atau sekadar butuh rekomendasi warung, WhatsApp kami aktif 24 jam.",
    yourPart: "kabari kami kalau ada apa-apa di jalan, jangan diam saja.",
  },
  {
    title: "Kami jemput, deposit kembali",
    duration: "maks. 5 hari kerja",
    text: "Di akhir sewa kami yang datang menjemput unitnya. Deposit kembali utuh setelah pengecekan, dan kalau ada potongan, rinciannya kami kirim ke Anda lebih dulu.",
    yourPart: "tidak perlu ke mana-mana, kami yang datang.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  origin: string;
  detail: string;
  initials: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Mobilnya datang bersih, bensin cukup, dan harga persis seperti di chat. Nggak ada tambahan aneh-aneh pas serah terima, itu yang bikin saya balik lagi.",
    name: "Rizky Pratama",
    origin: "Jakarta",
    detail: "sewa Avanza, 4 hari",
    initials: "RP",
  },
  {
    quote:
      "The scooter was dropped at our villa at 7 in the morning, two helmets and raincoats included. Deposit came back in full three days after we returned it.",
    name: "Sarah Mitchell",
    origin: "Melbourne, Australia",
    detail: "sewa NMAX, 1 minggu",
    initials: "SM",
  },
  {
    quote:
      "Sudah tiga kali sewa di ZeeRental setiap ke Bali. Adminnya cepat balas, unit tidak pernah telat, dan pernah sekali ban kempes langsung dibantu carikan tambal ban terdekat.",
    name: "Dewi Anggraini",
    origin: "Yogyakarta",
    detail: "sewa Scoopy dan Brio",
    initials: "DA",
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "Syarat sewanya apa saja, untuk WNI dan WNA?",
    answer:
      "WNI cukup KTP dan SIM aktif: SIM A untuk mobil, SIM C untuk motor. WNA membawa paspor dan SIM internasional atau SIM dari negara asal. Semua dokumen cukup difoto saat serah terima unit, tidak ada yang kami tahan.",
  },
  {
    question: "Berapa depositnya, dan kapan kembali?",
    answer:
      "Deposit motor mulai Rp300 ribu dan mobil mulai Rp500 ribu untuk WNI; untuk WNA mulai Rp1 juta (motor) dan Rp2,5 juta (mobil), tergantung unit. Deposit kembali utuh maksimal 5 hari kerja setelah unit kami cek. Kalau ada potongan, misalnya denda tilang, rinciannya kami kirim ke WhatsApp Anda sebelum transfer dilakukan.",
  },
  {
    question: "Bisa lepas kunci, atau harus pakai sopir?",
    answer:
      "Bisa dua-duanya. Lepas kunci adalah pilihan paling umum dan semua harga di halaman ini adalah harga lepas kunci. Kalau Anda lebih santai jadi penumpang, sopir bisa ditambahkan Rp150 ribu per hari, di luar bensin dan tol.",
  },
  {
    question: "Kalau saya terlambat mengembalikan unit bagaimana?",
    answer:
      "Ada toleransi 1 jam, santai saja. Lewat dari itu kena biaya 10% dari tarif harian per jam, dan keterlambatan di atas 5 jam dihitung satu hari penuh. Kalau rencana berubah, kabari kami lebih awal lewat WhatsApp, biasanya bisa kami atur tanpa biaya.",
  },
  {
    question: "Area antarnya sampai mana saja?",
    answer:
      "Denpasar, bandara Ngurah Rai, Sanur, dan Kuta gratis untuk sewa minimal 2 hari. Area lain seperti Canggu, Ubud, dan Jimbaran tetap kami layani dengan biaya antar yang disepakati di awal, tertulis jelas sebelum Anda membayar apa pun.",
  },
  {
    question: "Kalau rencana batal bagaimana?",
    answer:
      "Pembatalan lewat WhatsApp paling lambat H-1 tidak kena biaya apa pun, dan uang muka (kalau ada) kembali penuh. Pembatalan di hari yang sama kena potongan 50% dari tarif satu hari. Sisanya kami kembalikan, tanpa drama.",
  },
];

export function formatRupiah(value: number): string {
  return "Rp" + value.toLocaleString("id-ID");
}
