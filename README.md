📖 Al-Quran Digital (2026)
Al-Quran Digital adalah aplikasi web progresif yang dirancang untuk memberikan pengalaman membaca Al-Quran yang otentik secara digital. Proyek ini menggabungkan fleksibilitas Google Sheets sebagai database dengan kecepatan GitHub Pages sebagai antarmuka pengguna.

✨ Fitur Unggulan
 * Antarmuka Pro & Islami: Menggunakan ornamen Rub el Hizb (bintang segi delapan) otomatis pada setiap penomoran ayat.
 * Pemisah Bismillah Otomatis: Logika cerdas menggunakan Regex untuk memisahkan Bismillah dari ayat pertama agar tampilan lebih bersih.
 * Database Real-time: Terkoneksi langsung dengan Google Sheets melalui Apps Script.
 * Audio Murottal: Dukungan audio per surah dan per ayat oleh Syekh Mishary Rashid Al-Afasy.
 * Responsif & Ringan: Dibuat dengan Tailwind CSS untuk performa maksimal di perangkat mobile maupun desktop.
 * Tafsir & Terjemahan: Dilengkapi dengan terjemahan Bahasa Indonesia dan Tafsir Jalalain.

🛠️ Arsitektur Proyek
Aplikasi ini bekerja dengan menghubungkan tiga komponen utama:
 * Frontend: GitHub Pages (HTML5, Tailwind CSS, JavaScript).
 * Backend API: Google Apps Script (GAS).
 * Database: Google Sheets.

🚀 Panduan Setup (Langkah demi Langkah)
1. Persiapan Database (Google Sheets)
 * Buat Google Sheets baru.
 * Buka menu Extensions > Apps Script.
 * Salin kode dari file Code.gs (tersedia di repositori ini) ke dalam editor Apps Script.
 * Jalankan fungsi syncFullData() satu kali untuk menarik 6236 ayat dan metadata ke Spreadsheet Anda.
 * Klik Deploy > New Deployment.
 * Pilih jenis Web App, setel akses ke "Anyone", lalu salin Web App URL yang dihasilkan.
2. Konfigurasi Frontend
 * Clone atau Fork repositori ini.
 * Buka file index.html.
 * Cari variabel SCRIPT_URL di bagian awal tag <script>:
   const SCRIPT_URL = "URL_WEB_APP_APPS_SCRIPT_ANDA_DI_SINI";

 * Ganti dengan URL yang Anda salin dari langkah pertama.
 * Simpan dan Commit perubahan ke repositori GitHub Anda.
3. Hosting di GitHub Pages
 * Masuk ke menu Settings di repositori GitHub Anda.
 * Pilih tab Pages di sidebar kiri.
 * Pilih branch main (atau master) dan klik Save.
 * Tunggu beberapa saat, aplikasi Anda akan live di https://<username>.github.io/<nama-repo>/.
   
📂 Struktur File
 * index.html - Antarmuka utama dan logika pemrosesan data (Frontend).
 * Code.gs - Skrip Google Apps Script untuk manajemen API dan Database (Backend).
 * assets/ - (Opsional) Tempat menyimpan gambar atau ikon pendukung.
   
🤝 Kontribusi
Kami sangat terbuka untuk kontribusi! Jika Anda menemukan bug atau ingin menambahkan fitur baru (seperti bookmark atau mode malam), silakan:
 * Fork proyek ini.
 * Buat branch fitur baru (git checkout -b fitur/HebatSaya).
 * Commit perubahan Anda (git commit -m 'Menambah fitur Hebat').
 * Push ke branch tersebut (git push origin fitur/HebatSaya).
 * Buka Pull Request.
   
📜 Lisensi & Atribusi
 * Data Al-Quran: Didukung oleh API AlQuran.cloud.
 * Audio: Islamic.network.
 * Lisensi: Proyek ini bersifat Open Source (MIT License).

   
> Catatan: Proyek ini dikembangkan sebagai bagian dari inisiatif literasi digital Islam tahun 2026. Semoga bermanfaat bagi ummat.
