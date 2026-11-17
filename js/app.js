/* ==========================================================================
   app.js — logika khusus halaman Beranda (index.html)

   Teknik yang dipakai di sini:
   - jQuery AJAX  $.getJSON()            -> Pertemuan 11
   - Manipulasi DOM (append elemen)      -> Pertemuan 10
   - Loading state & error handling      -> Pertemuan 11
   ========================================================================== */

const API_BASE = "https://fakestoreapi.com";

// jQuery: tunggu sampai seluruh HTML siap sebelum menjalankan kode.
$(function () {
  // Ambil daftar kategori dari server — sama persis pola $.getJSON()
  // yang dipakai di Pertemuan 11, hanya beda endpoint.
  $.getJSON(API_BASE + "/products/categories")
    .done(function (categories) {
      const $list = $("#kategori-list");
      $list.empty();

      categories.forEach(function (kategori) {
        // Buat satu tombol Bootstrap per kategori, lalu append ke DOM.
        const label = kategori.charAt(0).toUpperCase() + kategori.slice(1);
        const $btn = $(
          '<a href="katalog.html?category=' + encodeURIComponent(kategori) + '" ' +
          'class="btn btn-outline-success">' + label + "</a>"
        );
        $list.append($btn);
      });
    })
    .fail(function () {
      $("#kategori-error").removeClass("d-none");
    })
    .always(function () {
      // .always() jalan baik berhasil maupun gagal — pas untuk
      // menyembunyikan indikator "memuat..." di kedua kondisi.
      $("#kategori-loading").hide();
    });
});
