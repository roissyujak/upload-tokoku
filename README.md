# TokoKita — Katalog Produk Mini

Proyek demo yang merangkum teknik-teknik dari Pertemuan 1 sampai 11
Pemrograman Website (TI63306). Statis murni (HTML/CSS/JS) — buka
`index.html` langsung di browser, tidak perlu server atau instalasi
apa pun. **Butuh koneksi internet** karena data produk diambil live dari
API publik [fakestoreapi.com](https://fakestoreapi.com).

## Struktur halaman

| File | Isi |
|---|---|
| `index.html` | Beranda — hero, fitur, kategori pilihan |
| `katalog.html` | Daftar semua produk — pencarian, filter kategori, sort |
| `detail.html` | Detail satu produk + rekomendasi terkait |
| `css/style.css` | Semua styling kustom |
| `js/app.js` | Logika Beranda (ambil daftar kategori) |
| `js/katalog.js` | Logika Katalog (ambil produk, filter/sort, render kartu) |
| `js/detail.js` | Logika Detail (ambil 1 produk + produk terkait) |

## Peta teknik → pertemuan

| Teknik | Lokasi di kode | Pertemuan |
|---|---|---|
| Flexbox (hero section) | `css/style.css` → `.hero-inner` | 9 |
| CSS Grid (grid fitur, auto-fit) | `css/style.css` → `.feature-grid` | 9 |
| Media query (responsive) | `css/style.css` → bagian bawah | 9 |
| Bootstrap grid & komponen (navbar, card, breadcrumb, badge, spinner) | semua `.html` | 10 |
| jQuery selector & event handling (keyup/change) | `js/katalog.js` | 10 |
| jQuery manipulasi DOM (`.append()`, `.empty()`) | `js/app.js`, `js/katalog.js` | 10 |
| jQuery AJAX `$.getJSON()` | `js/app.js`, `js/katalog.js` | 11 |
| Fetch API native (`fetch().then().catch().finally()`) | `js/detail.js` | 11 |
| Loading state & error handling | semua file `js/*.js` | 11 |

## Kemungkinan pengembangan lanjut

Beberapa hal ini sengaja belum ditambahkan karena belum diajarkan saat
proyek ini dibuat (Pertemuan 11) — cocok dipakai sebagai titik lanjutan
begitu materi berikutnya selesai:

- Konsep REST & HTTP method lain (POST/PUT/DELETE) — Pertemuan 12-13
- Form tambah/ubah data yang benar-benar mengirim ke server
- State keranjang belanja (localStorage atau backend sungguhan)
