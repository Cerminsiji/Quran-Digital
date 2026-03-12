# 🕋 Al-Quran Digital (Hybrid Cloud Mushaf)

[![Live Preview](https://img.shields.io/badge/Live-Preview-065f46?style=for-the-badge&logo=google-chrome&logoColor=white)](https://cerminsiji.github.io/Quran-Digital/)
[![Tech](https://img.shields.io/badge/Stack-Serverless-orange?style=for-the-badge)](https://script.google.com/)

**Al-Quran Digital** adalah platform Mushaf modern berbasis web yang menggabungkan efisiensi **Google Apps Script** sebagai engine database (Google Sheets) dan **GitHub Pages** sebagai hosting frontend yang ringan. Dirancang untuk pengalaman membaca yang khusyuk, responsif, dan elegan.

---

## ✨ Fitur Unggulan

* **📱 Smart Mobile Navigation:** Sidebar adaptif yang otomatis tertutup saat surah dipilih serta sistem navigasi *Next/Prev* yang ramah penggunaan satu tangan.
* **🌐 Hybrid Data Source:** Integrasi cerdas API utama dari `equran.id` dengan sistem *fallback* otomatis ke `alquran.cloud` guna memastikan ketersediaan **Tafsir Jalalain**.
* **🎧 Audio Murottal Premium:** Dukungan audio per ayat dan per surah oleh **Syekh Mishary Rashid Al-Afasy**.
* **🎨 UI/UX Islami Modern:** Estetika premium dengan palet warna *Emerald Green*, tipografi khat **Amiri**, dan desain kartu (*card-based*) yang bersih.
* **🔍 Dynamic Font Resizer:** Kontrol ukuran teks Arab secara real-time untuk kenyamanan mata pengguna di berbagai ukuran layar.
* **📋 Copy & Share:** Fitur salin ayat yang terformat rapi, mencakup teks Arab, terjemahan, dan referensi surah/ayat secara otomatis.

---

## 🛠️ Arsitektur Teknologi

Proyek ini mengusung konsep **Serverless Architecture** untuk meminimalkan biaya operasional:

* **Frontend:** HTML5, Tailwind CSS, dan JavaScript (Vanilla).
* **Backend/API Bridge:** Google Apps Script (GAS) sebagai jembatan pemrosesan data.
* **Database:** Google Sheets sebagai *cache database* permanen untuk mempercepat *load time* dan mengurangi ketergantungan pada API publik.

---

## 📡 Dokumentasi Endpoint (Internal API)

Melalui URL Web App Google, Anda dapat mengakses data secara mandiri:

| Action | Endpoint | Fungsi |
| :--- | :--- | :--- |
| **Daftar Surah** | `?action=getSurahList` | Mengambil info ID, Nama, Tipe (Makkiyah/Madaniyah), & Jumlah Ayat. |
| **Detail Ayat** | `?action=getAyatData&surahId=[ID]` | Mengambil teks Arab, Terjemahan, Tafsir, & Link Audio per ayat. |

---

## 🚀 Panduan Instalasi (Step-by-Step)

### 1️⃣ Persiapan Google Sheets
1.  Buat Spreadsheet baru di **[Google Drive](https://sheets.new)**.
2.  Buka menu **Extensions** > **Apps Script**.
3.  Beri nama proyek: `Mushaf Backend`.

### 2️⃣ Konfigurasi Backend (`Code.gs`)
1.  Salin seluruh kode dari file `Code.gs` di repositori ini ke editor Apps Script.
2.  **Jalankan fungsi** `initialSetup` untuk membuat struktur sheet secara otomatis.
3.  **Jalankan fungsi** `syncDatabaseHybrid` untuk menarik data Al-Qur'an ke dalam database Anda.

### 3️⃣ Deployment Web App
1.  Klik **Deploy** > **New Deployment**.
2.  Pilih jenis **Web App**.
3.  Setel *Execute as* ke **Me** dan *Who has access* ke **Anyone**.
4.  **Salin URL Web App** (URL ini adalah kunci penghubung frontend).

### 4️⃣ Konfigurasi Frontend (GitHub)
1.  Buka file `index.html` di repositori GitHub Anda.
2.  Cari variabel `const SCRIPT_URL` dan tempelkan URL Web App Anda:
    ```javascript
    const SCRIPT_URL = "[https://script.google.com/macros/s/.../exec](https://script.google.com/macros/s/.../exec)";
    ```
3.  *Commit* dan *Push* perubahan ke GitHub.

### 5️⃣ Aktivasi GitHub Pages
1.  Buka tab **Settings** di repositori GitHub Anda.
2.  Pilih menu **Pages** di sidebar kiri.
3.  Pilih branch **main** dan folder **/(root)**, lalu klik **Save**.
4.  Tunggu 1-3 menit, Al-Quran Digital Anda telah online!

---

## 📝 Disclaimer

> Data Al-Qur'an dalam proyek ini bersumber dari API publik untuk tujuan kemudahan akses digital. Pengguna sangat disarankan untuk tetap merujuk pada **Mushaf Cetak Standar** (Kemenag/Madinah) untuk keperluan verifikasi hukum tajwid dan qira'ah yang lebih mendalam.

---
