/* ==========================================================================
   katalog.js — logika halaman Katalog (katalog.html)

   Teknik yang dipakai di sini:
   - jQuery AJAX  $.getJSON()                -> Pertemuan 11
   - Looping data + append() ke HTML         -> Pertemuan 11 (pola forEach + append)
   - jQuery event handling (keyup/change)     -> Pertemuan 10
   - Loading state & error/empty handling     -> Pertemuan 11
   - Baca parameter URL (?category=...)       -> dipakai supaya tombol kategori
                                                  di Beranda bisa langsung
                                                  memfilter katalog
   ========================================================================== */

const API_BASE = "https://fakestoreapi.com";

// Menyimpan semua produk hasil fetch sekali saja, supaya pencarian/filter/
// sort berikutnya tidak perlu request ulang ke server — cukup olah data
// yang sudah ada di JavaScript (lebih cepat, hemat kuota).
let semuaProduk = [];

function formatHarga(angka) {
  // Data API berupa Dolar AS (USD) — kita tampilkan apa adanya dengan 2 desimal.
  return "$" + Number(angka).toFixed(2);
}

function buatBintang(rate) {
  const penuh = Math.round(rate);
  return "★".repeat(penuh) + "☆".repeat(5 - penuh);
}

function buatKartuProduk(produk) {
  return (
    '<div class="col-6 col-md-4 col-lg-3">' +
      '<div class="card product-card h-100">' +
        '<div class="product-img-wrap"><img src="' + produk.image + '" alt="' + produk.title + '"></div>' +
        '<div class="card-body d-flex flex-column">' +
          '<span class="badge text-bg-secondary mb-2 align-self-start">' + produk.category + '</span>' +
          '<h3 class="card-title-clamp h6">' + produk.title + '</h3>' +
          '<p class="rating-stars small mb-1">' + buatBintang(produk.rating.rate) + ' <span class="text-muted">(' + produk.rating.count + ')</span></p>' +
          '<p class="price-tag mb-3">' + formatHarga(produk.price) + '</p>' +
          '<a href="detail.html?id=' + produk.id + '" class="btn btn-accent mt-auto">Lihat Detail</a>' +
        "</div>" +
      "</div>" +
    "</div>"
  );
}

function tampilkanProduk() {
  const kataKunci = $("#search-input").val().trim().toLowerCase();
  const kategoriDipilih = $("#category-select").val();
  const urutan = $("#sort-select").val();

  // 1) Filter berdasarkan kata kunci judul + kategori yang dipilih
  let hasil = semuaProduk.filter(function (p) {
    const cocokKataKunci = p.title.toLowerCase().includes(kataKunci);
    const cocokKategori = !kategoriDipilih || p.category === kategoriDipilih;
    return cocokKataKunci && cocokKategori;
  });

  // 2) Urutkan sesuai pilihan
  if (urutan === "price-asc") hasil.sort((a, b) => a.price - b.price);
  if (urutan === "price-desc") hasil.sort((a, b) => b.price - a.price);
  if (urutan === "rating-desc") hasil.sort((a, b) => b.rating.rate - a.rating.rate);

  // 3) Render ke DOM: kosongkan dulu, lalu append satu per satu
  const $grid = $("#produk-grid");
  $grid.empty();

  if (hasil.length === 0) {
    $("#empty-state").removeClass("d-none");
  } else {
    $("#empty-state").addClass("d-none");
    hasil.forEach(function (produk) {
      $grid.append(buatKartuProduk(produk));
    });
  }

  $("#hasil-info").text("Menampilkan " + hasil.length + " dari " + semuaProduk.length + " produk.");
}

function isiDropdownKategori(produkList) {
  // Ambil kategori unik langsung dari data yang sudah di tangan —
  // tidak perlu request kedua ke /products/categories.
  const kategoriUnik = [...new Set(produkList.map((p) => p.category))];
  const $select = $("#category-select");

  kategoriUnik.forEach(function (kategori) {
    const label = kategori.charAt(0).toUpperCase() + kategori.slice(1);
    $select.append('<option value="' + kategori + '">' + label + "</option>");
  });

  // Jika datang dari tombol kategori di Beranda (katalog.html?category=electronics),
  // langsung pilihkan kategori itu di dropdown.
  const paramKategori = new URLSearchParams(window.location.search).get("category");
  if (paramKategori) {
    $select.val(paramKategori);
  }
}

$(function () {
  // Ambil SEMUA produk sekali saat halaman dibuka — ini request AJAX utama.
  $.getJSON(API_BASE + "/products")
    .done(function (data) {
      semuaProduk = data;
      isiDropdownKategori(data);
      tampilkanProduk();
    })
    .fail(function () {
      $("#error-state").removeClass("d-none");
    })
    .always(function () {
      $("#loading-state").hide();
    });

  // Event handling: setiap kali user mengetik/memilih, render ulang dari
  // data yang SUDAH ADA — tanpa request baru ke server.
  // "input" dipakai (bukan "keyup") supaya ketikan, paste, maupun autofill
  // semuanya langsung memicu filter ulang.
  $("#search-input").on("input", tampilkanProduk);
  $("#category-select").on("change", tampilkanProduk);
  $("#sort-select").on("change", tampilkanProduk);
});
