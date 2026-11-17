/* ==========================================================================
   detail.js — logika halaman Detail Produk (detail.html)

   Sengaja memakai Fetch API native (bukan jQuery AJAX) sebagai pembanding
   langsung dengan katalog.js — persis materi "jQuery AJAX atau Fetch?"
   di Pertemuan 11.

   Teknik yang dipakai di sini:
   - Baca parameter URL (?id=...)         -> URLSearchParams (JS dasar)
   - fetch().then().catch()               -> Pertemuan 11 (Fetch API)
   - Loading state & error handling        -> Pertemuan 11
   ========================================================================== */

const API_BASE = "https://fakestoreapi.com";

function formatHarga(angka) {
  return "$" + Number(angka).toFixed(2);
}

function buatBintang(rate) {
  const penuh = Math.round(rate);
  return "★".repeat(penuh) + "☆".repeat(5 - penuh);
}

function tampilkanError(pesan) {
  $("#error-state").text(pesan).removeClass("d-none");
}

function renderDetail(produk) {
  $("#breadcrumb-produk").text(produk.title);
  $("#d-image").attr("src", produk.image).attr("alt", produk.title);
  $("#d-category").text(produk.category);
  $("#d-title").text(produk.title);
  $("#d-rating").html(buatBintang(produk.rating.rate) + ' <span class="text-muted">(' + produk.rating.count + " ulasan)</span>");
  $("#d-price").text(formatHarga(produk.price));
  $("#d-description").text(produk.description);
  $("#produk-detail").removeClass("d-none");

  muatProdukTerkait(produk);
}

function muatProdukTerkait(produkUtama) {
  // Permintaan kedua, tetap pakai fetch() — menunjukkan beberapa fetch
  // boleh berjalan berurutan untuk kebutuhan yang berbeda.
  fetch(API_BASE + "/products/category/" + encodeURIComponent(produkUtama.category))
    .then(function (response) {
      if (!response.ok) throw new Error("Gagal memuat rekomendasi");
      return response.json();
    })
    .then(function (daftar) {
      const lainnya = daftar.filter((p) => p.id !== produkUtama.id).slice(0, 4);
      const $grid = $("#related-grid");
      $grid.empty();

      lainnya.forEach(function (p) {
        $grid.append(
          '<div class="col-6 col-md-3">' +
            '<div class="card product-card h-100">' +
              '<div class="product-img-wrap" style="height:120px;"><img src="' + p.image + '" alt="' + p.title + '"></div>' +
              '<div class="card-body">' +
                '<p class="card-title-clamp small mb-2">' + p.title + "</p>" +
                '<a href="detail.html?id=' + p.id + '" class="btn btn-sm btn-outline-success">Lihat</a>' +
              "</div>" +
            "</div>" +
          "</div>"
        );
      });
    })
    .catch(function () {
      // Bagian ini sifatnya pelengkap saja — kalau gagal, cukup
      // disembunyikan, tidak perlu menampilkan error besar ke pengguna.
    })
    .finally(function () {
      // .finally() adalah padanan .always() versi Promise/Fetch.
      $("#related-loading").hide();
    });
}

$(function () {
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    $("#loading-state").hide();
    tampilkanError("Produk tidak ditemukan — tidak ada ID produk di URL.");
    return;
  }

  fetch(API_BASE + "/products/" + id)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Server membalas status " + response.status);
      }
      return response.json();
    })
    .then(function (produk) {
      if (!produk || !produk.id) {
        throw new Error("Produk dengan ID tersebut tidak ditemukan.");
      }
      renderDetail(produk);
    })
    .catch(function (error) {
      tampilkanError("Gagal mengambil detail produk: " + error.message);
    })
    .finally(function () {
      $("#loading-state").hide();
    });
});
