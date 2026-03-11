/**
 * BACKEND MUSHAF DIGITAL PRO v3.5
 */

//Sesuaikan dengan nama Sheet
const SHEET_NAME = "Database_Quran_Pro"; 

function doGet(e) {
  // Menangani permintaan API dari GitHub
  if (e && e.parameter && e.parameter.action) {
    try {
      let result;
      if (e.parameter.action === "getSurahList") {
        result = fetchSurahList();
      } else if (e.parameter.action === "getAyatData") {
        result = fetchAyatData(e.parameter.surahId);
      }
      
      // Output JSON dengan Header CORS yang tepat
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({error: err.message}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Tampilan internal jika dibuka langsung dari Apps Script
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Mushaf Digital Pro')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * MENGAMBIL DAFTAR SURAH LENGKAP DENGAN METADATA DARI SPREADSHEET
 */
function fetchSurahList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const list = [];
  const seen = new Set();
  
  // Ambil data unik berdasarkan SurahNo (Kolom 0)
  for (let i = 1; i < data.length; i++) {
    const sId = data[i][0];   // SurahNo
    if (sId && !seen.has(sId)) {
      list.push({ 
        id: sId, 
        name: data[i][1],     // SurahName
        nameAr: data[i][7],   // SurahArabic
        type: data[i][8],     // Type (Makkiyah/Madaniyah)
        count: data[i][9]     // AyahCount
      });
      seen.add(sId);
    }
  }
  return list;
}

/**
 * MENGAMBIL DATA AYAT BERDASARKAN SURAH ID
 */
function fetchAyatData(surahId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  // Filter data berdasarkan SurahNo (Kolom 0)
  return data.filter(r => r[0] == surahId).map(r => ({
    no: r[2],       // AyatNo
    arab: r[3],     // TextArab
    indo: r[4],     // TextIndo
    tafsir: r[5],   // TafsirJalalain
    audio: r[6]     // URL Audio
  }));
}

/**
 * SINKRONISASI DATA KE SPREADSHEET (Jalankan Sekali di Awal)
 * Menambahkan data teks, terjemahan, tafsir, audio, dan metadata.
 */
function syncFullData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.clear();
  
  // Header Lengkap dengan Metadata Kolom 7, 8, dan 9
  const header = ["SurahNo", "SurahName", "AyatNo", "TextArab", "TextIndo", "TafsirJalalain", "Audio", "SurahArabic", "Type", "AyahCount"];
  sheet.appendRow(header);

  // Mengambil data paralel dari API terpercaya (Kemenag & Cloud)
  const resArab = JSON.parse(UrlFetchApp.fetch("https://api.alquran.cloud/v1/quran/quran-uthmani").getContentText()).data;
  const resIndo = JSON.parse(UrlFetchApp.fetch("https://api.alquran.cloud/v1/quran/id.indonesian").getContentText()).data;
  const resTafsir = JSON.parse(UrlFetchApp.fetch("https://api.alquran.cloud/v1/quran/id.jalalayn").getContentText()).data;
  const resMeta = JSON.parse(UrlFetchApp.fetch("https://api.alquran.cloud/v1/surah").getContentText()).data;
  
  let rows = [];
  resArab.surahs.forEach((surah, sIdx) => {
    const meta = resMeta[sIdx];
    surah.ayahs.forEach((ayah, aIdx) => {
      rows.push([
        surah.number, 
        surah.englishName, 
        ayah.numberInSurah, 
        ayah.text,
        resIndo.surahs[sIdx].ayahs[aIdx].text,
        resTafsir.surahs[sIdx].ayahs[aIdx].text,
        `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
        meta.name,                        // Kolom 7: Nama Arab
        meta.revelationType === "Meccan" ? "Makkiyah" : "Madaniyah", // Kolom 8: Tipe
        meta.numberOfAyahs                // Kolom 9: Jumlah Ayat
      ]);
    });
  });
  
  // Batch update ke Spreadsheet (Sangat Cepat)
  sheet.getRange(2, 1, rows.length, header.length).setValues(rows);
  return "✅ Sukses! Database Mushaf Digital Pro telah disinkronkan dengan 6236 ayat dan metadata lengkap.";
}
