/* ============================================================
   PENGATURAN — ubah bagian ini sesuai sekolahmu
   ============================================================ */
const CONFIG = {
  namaSekolah: "SMA Negeri 1 Contoh",
  slogan: "Layanan barang temuan resmi sekolah. Semua barang yang ditemukan dicatat di sini.",
  fotoSekolah: "images/sekolah.jpg",   // ganti dengan foto sekolahmu, mis. "images/sekolah.jpg"
  logo: "images/logo.png",             // ganti dengan logo sekolah
  fotoKontak: "images/sekolah.jpg",    // foto di tab Kontak
  admin: { username: "moses", password: "142536" }, // ganti username & password di sini
  kategori: ["Tas", "Botol & Wadah", "Buku & Alat Tulis", "Kunci", "Pakaian", "Elektronik", "Lainnya"],
  kontak: {
    alamat: "Jl. Pendidikan No. 1, Jakarta",
    telepon: "(021) 1234-5678",
    email: "info@sekolahmu.sch.id",
    jam: "Senin – Jumat, 07.00 – 15.00",
    lokasiPenyimpanan: "Ruang Tata Usaha (TU), lantai 1"
  }
};

/* Data contoh. Ganti nama file foto sesuai gambar di folder images/barang/ */
const DATA_AWAL = [
  { id: 1, nama: "Tas ransel biru", kategori: "Tas", lokasi: "Kantin", tanggal: "2025-01-10", deskripsi: "Ada gantungan kunci kucing di resleting.", status: "Belum diambil", foto: "images/barang/tas.jpg" },
  { id: 2, nama: "Botol minum tosca", kategori: "Botol & Wadah", lokasi: "Lapangan basket", tanggal: "2025-01-12", deskripsi: "Ada stiker bintang di badan botol.", status: "Belum diambil", foto: "images/barang/botol.jpg" },
  { id: 3, nama: "Buku paket Matematika", kategori: "Buku & Alat Tulis", lokasi: "Kelas XI IPA 2", tanggal: "2025-01-13", deskripsi: "Nama di halaman pertama sudah luntur.", status: "Sudah diambil", foto: "images/barang/buku.jpg" },
  { id: 4, nama: "Kunci motor", kategori: "Kunci", lokasi: "Parkiran", tanggal: "2025-01-14", deskripsi: "Gantungan karet warna hitam.", status: "Belum diambil", foto: "images/barang/kunci.jpg" },
  { id: 5, nama: "Jaket ungu", kategori: "Pakaian", lokasi: "Perpustakaan", tanggal: "2025-01-15", deskripsi: "Ukuran M, ada tulisan di punggung.", status: "Belum diambil", foto: "images/barang/jaket.jpg" },
  { id: 6, nama: "Ponsel layar retak", kategori: "Elektronik", lokasi: "Mushola", tanggal: "2025-01-16", deskripsi: "Casing hijau tua.", status: "Belum diambil", foto: "images/barang/hp.jpg" }
];

/* ============================================================
   KODE UTAMA (tidak perlu diubah)
   ============================================================ */
const $ = (s) => document.querySelector(s);
const KEY = { barang: "pb_barang", pesan: "pb_pesan", foto: "pb_fotoSekolah", login: "pb_login" };

const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const baca = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const simpan = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { alert("Penyimpanan penuh. Gunakan foto yang lebih kecil."); } };
const tgl = (t) => new Date(t + "T00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

let barang = baca(KEY.barang, null);
if (!barang) { barang = DATA_AWAL; simpan(KEY.barang, barang); }

/* ---------- Tab ---------- */
function bukaTab(id) {
  if (!document.getElementById(id)) id = "beranda";
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", t.id === id));
  document.querySelectorAll("nav button").forEach((b) => b.classList.toggle("on", b.dataset.tab === id));
  $("#menu").classList.remove("open");
  history.replaceState(null, "", "#" + id);
  window.scrollTo(0, 0);
}
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-tab]");
  if (el) { e.preventDefault(); bukaTab(el.dataset.tab); }
});
$("#burger").onclick = () => $("#menu").classList.toggle("open");

/* ---------- Tampilan umum ---------- */
function isiUmum() {
  document.title = "Pencari Barang – " + CONFIG.namaSekolah;
  $("#namaSekolah").textContent = CONFIG.namaSekolah;
  $("#logo").src = CONFIG.logo;
  $("#slogan").textContent = CONFIG.slogan;
  $("#fotoSekolah").src = baca(KEY.foto, null) || CONFIG.fotoSekolah;
  $("#fotoKontak").src = CONFIG.fotoKontak;
  const k = CONFIG.kontak;
  $("#info").innerHTML = [
    ["Alamat", k.alamat], ["Telepon", k.telepon], ["Email", k.email],
    ["Jam layanan", k.jam], ["Tempat pengambilan", k.lokasiPenyimpanan]
  ].map(([a, b]) => `<li><b>${a}:</b> ${esc(b)}</li>`).join("");
  $("#footer").textContent = `© ${new Date().getFullYear()} ${CONFIG.namaSekolah}. Layanan barang temuan.`;
  const opsi = CONFIG.kategori.map((c) => `<option>${esc(c)}</option>`).join("");
  $("#fKategori").innerHTML = '<option value="">Semua kategori</option>' + opsi;
  $("#bKategori").innerHTML = opsi;
}

function kartu(b) {
  const ambil = b.status === "Sudah diambil";
  return `<article class="item">
    <img src="${esc(b.foto)}" alt="${esc(b.nama)}" loading="lazy" onerror="this.src='images/sekolah.svg'">
    <div class="body">
      <span class="tag ${ambil ? "ambil" : ""}">${esc(b.status)}</span>
      <h3>${esc(b.nama)}</h3>
      <small>${esc(b.kategori)} · ditemukan di ${esc(b.lokasi)}</small>
      <small>${tgl(b.tanggal)}</small>
      <p>${esc(b.deskripsi)}</p>
    </div></article>`;
}

function urut() { return [...barang].sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id); }

function renderBeranda() {
  const total = barang.length, diambil = barang.filter((b) => b.status === "Sudah diambil").length;
  $("#stats").innerHTML = `<div><b>${total}</b><span>Barang tercatat</span></div>
    <div><b>${total - diambil}</b><span>Menunggu pemilik</span></div>
    <div><b>${diambil}</b><span>Sudah kembali ke pemilik</span></div>`;
  $("#terbaru").innerHTML = urut().slice(0, 3).map(kartu).join("") || '<div class="kosong">Belum ada barang.</div>';
}

function renderCari() {
  const q = $("#q").value.trim().toLowerCase(), kat = $("#fKategori").value, st = $("#fStatus").value;
  const hasil = urut().filter((b) =>
    (!kat || b.kategori === kat) && (!st || b.status === st) &&
    (!q || [b.nama, b.deskripsi, b.lokasi, b.kategori].join(" ").toLowerCase().includes(q)));
  $("#jumlah").textContent = `${hasil.length} barang ditemukan`;
  $("#hasil").innerHTML = hasil.map(kartu).join("") ||
    '<div class="kosong">Tidak ada barang yang cocok. Coba kata kunci lain atau hubungi petugas di tab Kontak.</div>';
}
["input", "change"].forEach((ev) => ["#q", "#fKategori", "#fStatus"].forEach((s) => $(s).addEventListener(ev, renderCari)));

$("#formCepat").onsubmit = (e) => {
  e.preventDefault();
  $("#q").value = $("#cariCepat").value; $("#fKategori").value = ""; $("#fStatus").value = "";
  renderCari(); bukaTab("cari");
};

/* ---------- Kontak ---------- */
$("#formKontak").onsubmit = (e) => {
  e.preventDefault();
  const p = baca(KEY.pesan, []);
  p.unshift({ nama: $("#kNama").value, kontak: $("#kKontak").value, isi: $("#kPesan").value, waktu: new Date().toLocaleString("id-ID") });
  simpan(KEY.pesan, p);
  e.target.reset();
  $("#kOk").textContent = "Pesan terkirim. Petugas akan menghubungimu.";
  renderPesan();
};

/* ---------- Admin ---------- */
const login = () => sessionStorage.getItem(KEY.login) === "1";

function tampilAdmin() {
  $("#loginBox").hidden = login();
  $("#panel").hidden = !login();
  if (login()) { renderTabel(); renderPesan(); }
}
$("#formLogin").onsubmit = (e) => {
  e.preventDefault();
  if ($("#user").value === CONFIG.admin.username && $("#pass").value === CONFIG.admin.password) {
    sessionStorage.setItem(KEY.login, "1");
    $("#loginErr").textContent = ""; e.target.reset(); tampilAdmin();
  } else $("#loginErr").textContent = "Username atau password salah.";
};
$("#logout").onclick = () => { sessionStorage.removeItem(KEY.login); tampilAdmin(); };

/* Kecilkan foto agar muat di penyimpanan browser */
function bacaFoto(file, maks = 700) {
  return new Promise((ok, gagal) => {
    const r = new FileReader();
    r.onerror = gagal;
    r.onload = () => {
      const im = new Image();
      im.onerror = gagal;
      im.onload = () => {
        const s = Math.min(1, maks / Math.max(im.width, im.height));
        const c = document.createElement("canvas");
        c.width = im.width * s; c.height = im.height * s;
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        ok(c.toDataURL("image/jpeg", 0.8));
      };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

let fotoBaru = null;
$("#bFoto").onchange = async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  fotoBaru = await bacaFoto(f);
  $("#preview").src = fotoBaru; $("#preview").hidden = false;
};

function resetForm() {
  $("#formBarang").reset(); $("#editId").value = ""; fotoBaru = null;
  $("#preview").hidden = true; $("#batal").hidden = true; $("#judulForm").textContent = "Tambah barang";
  $("#bTanggal").value = new Date().toISOString().slice(0, 10);
}
$("#batal").onclick = resetForm;

$("#formBarang").onsubmit = (e) => {
  e.preventDefault();
  const id = Number($("#editId").value);
  const data = {
    nama: $("#bNama").value.trim(), kategori: $("#bKategori").value, lokasi: $("#bLokasi").value.trim(),
    tanggal: $("#bTanggal").value, deskripsi: $("#bDesk").value.trim(), status: $("#bStatus").value
  };
  if (id) {
    const b = barang.find((x) => x.id === id);
    Object.assign(b, data); if (fotoBaru) b.foto = fotoBaru;
  } else {
    barang.push({ id: Date.now(), ...data, foto: fotoBaru || "images/sekolah.svg" });
  }
  simpan(KEY.barang, barang); resetForm(); refreshSemua();
};

function renderTabel() {
  $("#tabel").innerHTML = urut().map((b) => `<tr>
    <td><img src="${esc(b.foto)}" alt=""></td>
    <td><b>${esc(b.nama)}</b><br><small>${esc(b.kategori)}</small></td>
    <td>${esc(b.lokasi)}</td><td>${tgl(b.tanggal)}</td>
    <td><span class="tag ${b.status === "Sudah diambil" ? "ambil" : ""}">${esc(b.status)}</span></td>
    <td class="actions">
      <button class="btn small ghost" data-aksi="ubah" data-id="${b.id}">Ubah</button>
      <button class="btn small ghost" data-aksi="status" data-id="${b.id}">Tandai ${b.status === "Sudah diambil" ? "belum diambil" : "sudah diambil"}</button>
      <button class="btn small danger" data-aksi="hapus" data-id="${b.id}">Hapus</button>
    </td></tr>`).join("") || '<tr><td colspan="6">Belum ada barang.</td></tr>';
}
$("#tabel").onclick = (e) => {
  const t = e.target.closest("button"); if (!t) return;
  const id = Number(t.dataset.id), b = barang.find((x) => x.id === id);
  if (t.dataset.aksi === "hapus" && confirm(`Hapus "${b.nama}"?`)) barang = barang.filter((x) => x.id !== id);
  else if (t.dataset.aksi === "status") b.status = b.status === "Sudah diambil" ? "Belum diambil" : "Sudah diambil";
  else if (t.dataset.aksi === "ubah") {
    $("#editId").value = id; $("#bNama").value = b.nama; $("#bKategori").value = b.kategori;
    $("#bLokasi").value = b.lokasi; $("#bTanggal").value = b.tanggal; $("#bDesk").value = b.deskripsi;
    $("#bStatus").value = b.status; $("#preview").src = b.foto; $("#preview").hidden = false;
    $("#batal").hidden = false; $("#judulForm").textContent = "Ubah barang"; fotoBaru = null;
    $("#formBarang").scrollIntoView({ behavior: "smooth" }); return;
  }
  simpan(KEY.barang, barang); refreshSemua();
};

function renderPesan() {
  const p = baca(KEY.pesan, []);
  $("#pesan").innerHTML = p.map((m, i) => `<div class="msg"><b>${esc(m.nama)}</b> (${esc(m.kontak)})<br>
    <small class="muted">${esc(m.waktu)}</small><p>${esc(m.isi)}</p>
    <button class="btn small ghost" data-hapus-pesan="${i}">Hapus</button></div>`).join("") || '<p class="muted">Belum ada pesan.</p>';
}
$("#pesan").onclick = (e) => {
  const i = e.target.dataset.hapusPesan; if (i === undefined) return;
  const p = baca(KEY.pesan, []); p.splice(Number(i), 1); simpan(KEY.pesan, p); renderPesan();
};

/* Ganti foto sekolah dari panel admin */
$("#uploadSekolah").onchange = async (e) => {
  const f = e.target.files[0]; if (!f) return;
  simpan(KEY.foto, await bacaFoto(f, 1600)); isiUmum(); e.target.value = "";
};
$("#resetSekolah").onclick = () => { localStorage.removeItem(KEY.foto); isiUmum(); };

/* ---------- Mulai ---------- */
function refreshSemua() { renderBeranda(); renderCari(); if (login()) renderTabel(); }
isiUmum(); resetForm(); refreshSemua(); tampilAdmin();
bukaTab(location.hash.slice(1) || "beranda");
