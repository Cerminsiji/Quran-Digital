🕋 Al-Quran Digital adalah aplikasi Al-Qur'an berbasis web yang menggabungkan kecepatan Google Apps Script sebagai backend database (Google Sheets) dan fleksibilitas GitHub Pages sebagai hosting frontend. Dirancang dengan antarmuka profesional, islami, dan sepenuhnya responsif untuk perangkat mobile.

✨ Fitur Utama
 * Smart Mobile Navigation: Sidebar otomatis tertutup saat surah dipilih dan sistem navigasi Next/Prev yang ramah jempol.
 * Hybrid Data Source: Menggunakan API utama dari equran.id dengan sistem fallback ke alquran.cloud untuk memastikan Tafsir Jalalain selalu tersedia.
 * Audio Per Ayat & Per Surah: Mendukung pemutaran audio murottal oleh Syekh Mishary Rashid Al-Afasy.
 * UI/UX Islami Premium: Menggunakan palet warna Emerald Green, tipografi Amiri untuk teks Arab, dan desain kartu modern.
 * Dynamic Font Resizer: Memungkinkan pengguna mengubah ukuran teks Arab secara real-time demi kenyamanan membaca.
 * Copy to Clipboard: Fitur berbagi ayat yang rapi, mencakup teks Arab, terjemahan, dan referensi surah/ayat secara otomatis.
   
🛠️ Tentang Script (Teknologi)
Proyek ini menggunakan arsitektur Serverless sederhana:
 * Frontend: HTML5, Tailwind CSS, dan JavaScript (Vanilla).
 * Backend/API: Google Apps Script (GAS) yang bertindak sebagai jembatan (bridge) antara API publik dan database cache.
 * Database: Google Sheets untuk menyimpan daftar surah dan teks ayat secara permanen guna mengurangi beban request ke API publik.
   
📡 Penggunaan API
Script ini menyediakan dua endpoint internal yang bisa diakses melalui URL Web App Google Anda:
1. Ambil Daftar Surah
Endpoint: ?action=getSurahList
Output: JSON berisi ID, Nama Latin, Nama Arab, Tipe (Makkiyah/Madaniyah), dan Jumlah Ayat.
2. Ambil Detail Ayat
Endpoint: ?action=getAyatData&surahId=[NOMOR_SURAH]
Output: JSON berisi nomor ayat, teks Arab, terjemahan Indonesia, Tafsir Jalalain, dan link audio per ayat.
🚀 Panduan Setup (Step by Step)
Langkah 1: Persiapan Google Sheets
 * Buat Spreadsheet baru di Google Drive.
 * Buka menu Extensions > Apps Script.
 * Ubah nama proyek Seperti "Mushaf Backend".
Langkah 2: Konfigurasi Backend (Code.gs)
 * Salin seluruh kode dari file Code.gs (tersedia di repositori ini) ke dalam editor Apps Script.
 * Simpan (Ctrl+S).
 * Jalankan fungsi initialSetup terlebih dahulu untuk membuat sheet database otomatis.
 * Jalankan fungsi syncDatabaseHybrid untuk menarik data Al-Qur'an dari API pusat ke Google Sheets Anda. (Tunggu hingga selesai).
Langkah 3: Deployment Web App
 * Klik tombol Deploy > New Deployment.
 * Pilih jenis Web App.
 * Setel "Execute as" ke Me.
 * Setel "Who has access" ke Anyone.
 * Klik Deploy dan salin Web App URL yang muncul.
Langkah 4: Konfigurasi Frontend untuk GitHub Pages
 * Buka file index.html di repositori GitHub Anda.
 * Cari variabel const SCRIPT_URL di bagian JavaScript.
 * Tempelkan Web App URL yang Anda salin dari Langkah 3 di sana:
   const SCRIPT_URL = "https://script.google.com/macros/s/.../exec";

 * Commit dan Push perubahan tersebut ke GitHub.
Langkah 5: Aktivasi GitHub Pages
 * Masuk ke tab Settings di repositori GitHub Anda.
 * Pilih menu Pages.
 * Pilih branch main dan folder /(root), lalu klik Save.
 * Tunggu beberapa saat, dan Al-Quran Digital Anda akan online!
   
📝 Disclaimer
Data Al-Qur'an dalam proyek ini bersumber dari API publik. Pengguna disarankan untuk tetap merujuk pada Mushaf cetak standar untuk keperluan verifikasi hukum tajwid dan qira'ah yang lebih mendalam.
