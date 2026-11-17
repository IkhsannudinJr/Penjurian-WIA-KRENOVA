# E-Penjurian Wonogiri Innovation Award (WIA) & KRENOVA 2026

Aplikasi Penjurian Presentasi Inovasi Daerah Wonogiri Innovation Award (WIA) dan Kreativitas Inovasi Masyarakat (KRENOVA) Kabupaten Wonogiri Tahun 2026 berbasis **Next.js** (Full Custom).

Disesuaikan sepenuhnya berdasarkan:
- Dokumen **`TM JURI WIA 2026.pdf`**
- Dokumen **`Nominator Lomba KRENOVA Kabupaten Wonogiri Tahun 2026.docx`**
- Surat Keputusan & Dokumen **`Daftar Tim Juri dan Rundown WIA & Krenova 2026.pdf`** (Nomor: B/1208/000.9/XI/2026)

---

## 🏛️ Struktur 3 Tim Juri & 3 Ruangan Sidang Penjurian

Pelaksanaan Penjurian Pendalaman Materi diadakan pada:
* **Hari / Tanggal:** Rabu, 25 November 2026
* **Waktu:** 08.00 s.d. 12.00 WIB
* **Tempat:** Gedung BAPPERIDA Kabupaten Wonogiri

### 1. TIM JURI 1 — Ruang Graha Perencana 3 BAPPERIDA (14 Nominator)
* **Kategori yang dinilai:**
  1. Perangkat Daerah (OPD) — 5 Nominator (08.00 - 09.30)
  2. Kecamatan — 5 Nominator (09.30 - 10.45)
  3. BUMD — 4 Nominator (10.45 - 11.45)
* **Dewan Juri:**
  1. **FX. Pranata, A.P., M.Hum.** (Sekretaris Daerah Kabupaten Wonogiri)
  2. **Prof. Dr. Hesti Sadyadi, S.E., M.Si.** (Guru Besar STABN Wonogiri)
  3. **Mokhamad Diky Praditia, S.S.** (Jurnalis/Reporter Solopos)

### 2. TIM JURI 2 — Ruang Graha Perencana 2 BAPPERIDA (15 Nominator)
* **Kategori yang dinilai:**
  1. Korwil Bidang Pendidikan (Korwilcambidik) — 5 Nominator (08.00 - 09.30)
  2. Puskesmas — 5 Nominator (09.30 - 10.45)
  3. SMP / Pelajar (WIA) — 5 Nominator (10.45 - 12.00)
* **Dewan Juri:**
  1. **Prof. Dr. Chatarina Muryani, M.Si.** (Dosen Universitas Sebelas Maret Surakarta)
  2. **Purwadi, S.E., M.E.** (Kepala BAPPERIDA Kabupaten Wonogiri)
  3. **Sunan Fanijie, S.E.** (HIPMI Wonogiri)

### 3. TIM JURI 3 — Ruang Graha Perencana 1 BAPPERIDA (15 Nominator)
* **Kategori yang dinilai:**
  1. Krenova Tingkat Pelajar — 5 Nominator (08.00 - 09.30)
  2. Krenova Tingkat Masyarakat — 5 Nominator (09.30 - 10.45)
  3. Desa / Kelurahan (WIA) — 5 Nominator (10.45 - 12.00)
* **Dewan Juri:**
  1. **Wijiyanto, S.T., M.Eng.Sc.** (Dosen Universitas Muhammadiyah Surakarta)
  2. **Dr. Widia Darma, M.Pd.** (Dosen STABN Wonogiri)
  3. **Sony Suharsono, S.Si.** (Program Fasilitator Djarum Foundation)

---

## 🚀 Cara Menjalankan Aplikasi di Laptop Ini

1. Klik ganda file **`jalankan-aplikasi.bat`**.
2. Buka browser di:
   ```
   http://localhost:3000
   ```
*(Atau gunakan perintah `npm run start`)*

---

## 📱 Mengakses dari Tablet / Laptop Juri Lain via Wi-Fi Ruangan (Hotspot / LAN)

1. Sambungkan laptop server dan perangkat tablet/iPad/laptop dewan juri ke Wi-Fi / Hotspot yang sama.
2. Periksa alamat IP laptop server (misal: `192.168.1.45`).
3. Dewan juri membuka:
   ```
   http://192.168.1.45:3000
   ```
4. Juri memilih profil namanya pada Tim Juri 1, 2, atau 3. Sistem akan otomatis menyajikan daftar peserta di ruangannya beserta jadwal waktu rundown masing-masing.

---

## ☁️ Panduan Deploy ke Vercel

1. Push folder ini ke repositori GitHub Anda:
   ```bash
   git init
   git add .
   git commit -m "Sistem Penjurian WIA & Krenova Wonogiri 2026"
   git branch -M main
   git remote add origin <URL_REPO_GITHUB_ANDA>
   git push -u origin main
   ```
2. Buka [Vercel](https://vercel.com) -> **Import Project** -> Klik **Deploy**.

---

## 📋 Fitur Sistem Lengkap

1. **Rundown & Jadwal Interaktif (`/rundown`):**
   * Jadwal per 15 menit per nominator untuk 3 ruangan paralel.
   * Tautan langsung "Beri Nilai" ke lembar penilaian masing-masing nominator.
   * Tombol cetak jadwal rundown resmi.
2. **Portal Juri (`/juri`):**
   * Filter otomatis khusus nominator di ruangan juri yang bersangkutan.
   * Lembar penilaian interaktif skala 1–5 dengan live calculation terbobot.
   * Catatan & masukan kualitatif juri.
   * Kunci nilai (*Submit & Lock*).
3. **Portal Admin (`/admin`):**
   * Matriks monitoring real-time pengisian nilai 3 dewan juri per ruangan.
   * **Leaderboard & Rekapitulasi (`/admin/rekapitulasi`):** Rata-rata nilai 3 juri ruangan & penetapan Juara I, II, III, Harapan I, Harapan II, serta ekspor CSV/Excel.
   * **Berita Acara Resmi Siap Cetak (`/admin/berita-acara`):** Kop resmi BAPPERIDA, tabel juara, dan lembar tanda tangan 3 dewan juri ruangan terkait & Kepala BAPPERIDA.
   * **Kelola Data & Cadangan (`/admin/kelola`):** Tambah juri/nominator, download backup JSON, dan restore database.
