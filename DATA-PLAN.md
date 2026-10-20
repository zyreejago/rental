# Data Plan

## Context provenance
- `coba buatkan aku sistem manajer rental kendaraan bali, isinya ada landing page juga dan pengatur kendaraannnya bisa? buat high to end` (verbatim request; defines the two surfaces: public landing page + vehicle manager, premium tier)
- `tampilannya harus bagus dan terasa premium (high end). Landing page harus terlihat seperti brand rental kendaraan kelas atas di Bali: tipografi yang kuat, foto kendaraan dan suasana Bali yang besar dan sinematik, warna yang elegan dan konsisten, jarak antar elemen yang lega, animasi halus saat scroll. Panel pengelolanya juga harus sama rapinya: bersih, modern, mudah dibaca, dengan kartu statistik, kalender ketersediaan yang jelas, dan status booking berkode warna.` (owner emphasis in handoff; drives design system, calendar, stat cards, color-coded statuses)
- Prior research context from parent conversation: `Manajer Rental Kendaraan Bali, kalender armada dan urusan deposit yang beda buat WNI dan WNA` (assistant summary accepted into the 13-idea list the user reviewed; shapes booking fields: WNI/WNA deposit split, fleet calendar — presented as editable fields, not claimed user records)
- No external context applied beyond the above; fleet and bookings are the owner's own records, entered through the manager UI.

## Tested sources
### Image search (real photos for landing hero, categories, area cards)
**Used by**: build-time asset ingestion into `client/src/assets/` (hero Bali coast road, scooter, SUV, Ubud/Canggu/Uluwatu/Seminyak imagery); vehicle rows themselves use owner-provided image URLs or a preset cover key, never a searched photo claimed as that specific vehicle.
**Test command**: `/opt/hatch/bin/image-search "Bali coastal road aerial tropical" --max-results 5; /opt/hatch/bin/image-search "Bali scooter rental tourist" --max-results 5; /opt/hatch/bin/image-search "luxury SUV car Bali road" --max-results 5`
**Sample output**: Bali coast: `https://images.pexels.com/photos/36391400/pexels-photo-36391400.jpeg?auto=compress&w=600` (Pexels via bestinbali.co), Uluwatu/Pandawa road webp from bikinigaragebali.com; Scooter: `https://pazooktravel.com/wp-content/uploads/2024/03/caleb_scooter_bali-1-1024x713.jpg`, `https://www.balisecrettour.com/photos/n/bal-scooter-street.jpg?v=20260808`; SUV: `https://baliexecutivetravel.com/wp-content/uploads/2024/04/71.png` (Land Cruiser fleet page), `https://balipremiumtrip.com/wp-content/uploads/2024/12/...Mercedes GLS...webp`
**Processing**: At build time, preflight each chosen candidate with curl HEAD/GET (browser UA + cross-origin Referer, 2xx + image magic check), reject Shutterstock/watermarked and expiring CDN thumbnails, download accepted bytes at ~2x display size into `client/src/assets/`, verify pixel size with `gm identify` (>=1536px long edge for hero; try next candidate if below), import in client. Record per-image accept/reject in this plan's build notes. If a slot has no acceptable real photo, omit that slot or use a generated illustration clearly not presented as a specific real vehicle — never hotlink the remote URL.

## Web-search sources
None. No live external data (prices, weather, listings) is fetched at runtime; all rates and availability come from the owner's own DB rows.

## Agent-task sources
None.

## Long-term data behavior
- **Refresh policy**: No cron/refresh; data changes only when the owner edits via manager actions. Client refetches via react-query invalidation after every write.
- **Growth**: Vehicles and bookings grow unbounded by owner entry; list actions paginate/cap (vehicles 200, bookings 200) and calendar queries are range-bound by month.
- **Ordering**: Vehicles by name; bookings by start date descending in lists, ascending inside calendar; dashboard recent bookings by created_at desc.
- **Time semantics**: Booking start/end are calendar dates (Asia/Makassar business dates) stored as `YYYY-MM-DD` text to avoid timezone drift; created_at/updated_at are instants rendered viewer-local. Overlap checks compare date ranges inclusively on start, exclusively on end (checkout day is free).

## Rejected approaches
- **Tried**: Seeding a fake fleet/bookings so the landing page looks full on first open.
  **Why rejected**: Fleet and bookings are the owner's business records; inventing them would present fabricated inventory, plates, and revenue as real. Instead the DB starts empty, the landing fleet section renders a designed empty state plus category/area editorial content that needs no inventory, and the manager's add-vehicle flow is the primary CTA. Audit will create clearly test-only rows in the sandbox DB to exercise the UI.
- **Tried**: Hotlinking searched image URLs directly in the client.
  **Why rejected**: Expiring/signed CDN URLs break after publish; bytes are copied into owned `client/src/assets/` storage per the image-search skill preflight rules.
