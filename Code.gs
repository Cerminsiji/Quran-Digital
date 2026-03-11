/**
 * AL-QURAN ENGINE
 */

const SHEET_NAME = "Database_Quran_Pro";

function doGet(e) {
  // 1. Logika API untuk Akses Eksternal (GitHub/Hosting)
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

  // 2. Jika dibuka sebagai Web App Internal
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Digital Mushaf')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * MENGAMBIL DAFTAR SURAH (UNIK)
 */
function fetchSurahList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const list = [];
  const seen = new Set();
  
  for (let i = 1; i < data.length; i++) {
    const sId = data[i][0];   // SurahNo
    const sName = data[i][1]; // SurahName
    if (sId && !seen.has(sId)) {
      list.push({ id: sId, name: sName });
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
  return data.filter(r => r[0] == surahId).map(r => ({
    no: r[2],       // AyatNo
    arab: r[3],     // TextArab
    indo: r[4],     // TextIndo
    tafsir: r[5],   // TafsirJalalain
    audio: r[6]     // URL Audio
  }));
}

/**
 * FUNGSI SINKRONISASI (Jalankan ini jika database masih kosong)
 */
function syncFullData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.clear();
  
  const header = ["SurahNo", "SurahName", "AyatNo", "TextArab", "TextIndo", "TafsirJalalain", "Audio"];
  sheet.appendRow(header);

  // Mengambil data dari API Terpercaya (Kemenag/Cloud)
  const resArab = JSON.parse(UrlFetchApp.fetch("https://api.alquran.cloud/v1/quran/quran-uthmani").getContentText()).data;
  const resIndo = JSON.parse(UrlFetchApp.fetch("https://api.alquran.cloud/v1/quran/id.indonesian").getContentText()).data;
  const resTafsir = JSON.parse(UrlFetchApp.fetch("https://api.alquran.cloud/v1/quran/id.jalalayn").getContentText()).data;
  
  let rows = [];
  resArab.surahs.forEach((surah, sIdx) => {
    surah.ayahs.forEach((ayah, aIdx) => {
      rows.push([
        surah.number, 
        surah.englishName, 
        ayah.numberInSurah, 
        ayah.text,
        resIndo.surahs[sIdx].ayahs[aIdx].text,
        resTafsir.surahs[sIdx].ayahs[aIdx].text,
        `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`
      ]);
    });
  });
  
  // Batch update untuk efisiensi tinggi
  sheet.getRange(2, 1, rows.length, header.length).setValues(rows);
  return "✅ Sukses! " + rows.length + " ayat telah masuk ke Spreadsheet.";
}
