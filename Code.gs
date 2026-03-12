const DB_SHEET = "Database_Ayat";
const META_SHEET = "Database_Surah";

function doGet(e) {
  if (e && e.parameter && e.parameter.action) {
    try {
      let result;
      const action = e.parameter.action;
      if (action === "getSurahList") { result = fetchSurahList(); } 
      else if (action === "getAyatData") { result = fetchAyatData(e.parameter.surahId); }
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({error: err.message})).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Al-Quran Digital')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function fetchSurahList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(META_SHEET);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  data.shift();
  return data.map(r => ({ id: r[0], name: r[1], nameAr: r[2], type: r[3], count: r[4], audio: r[5] }));
}

function fetchAyatData(surahId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DB_SHEET);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  return data.filter(r => r[0] == surahId).map(r => ({ no: r[1], arab: r[2], indo: r[3], tafsir: r[4], audio: r[5] }));
}

function initialSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName(META_SHEET)) ss.insertSheet(META_SHEET);
  if (!ss.getSheetByName(DB_SHEET)) ss.insertSheet(DB_SHEET);
  return "Sheets Ready.";
}

function syncDatabaseHybrid() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const metaSheet = ss.getSheetByName(META_SHEET);
  const dbSheet = ss.getSheetByName(DB_SHEET);
  
  metaSheet.clear().appendRow(["ID", "Nama", "Nama Arab", "Tipe", "Jumlah Ayat", "Audio Full"]);
  dbSheet.clear().appendRow(["SurahID", "NoAyat", "TeksArab", "Terjemah", "Tafsir", "AudioAyat"]);

  const surahs = JSON.parse(UrlFetchApp.fetch("https://equran.id/api/v2/surat").getContentText()).data;
  const metaRows = surahs.map(s => [s.nomor, s.namaLatin, s.nama, s.tempatTurun, s.jumlahAyat, s.audioFull["05"]]);
  metaSheet.getRange(2, 1, metaRows.length, 6).setValues(metaRows);

  surahs.forEach(s => {
    const ayatRes = JSON.parse(UrlFetchApp.fetch(`https://equran.id/api/v2/surat/${s.nomor}`).getContentText()).data.ayat;
    let tafsirData;
    try {
      tafsirData = JSON.parse(UrlFetchApp.fetch(`https://equran.id/api/v2/tafsir/${s.nomor}`).getContentText()).data.tafsir;
    } catch (e) {
      tafsirData = JSON.parse(UrlFetchApp.fetch(`https://api.alquran.cloud/v1/surah/${s.nomor}/id.jalalayn`).getContentText()).data.ayahs;
    }
    const rows = ayatRes.map((a, i) => [s.nomor, a.nomorAyat, a.teksArab, a.teksIndonesia, tafsirData[i].teks || tafsirData[i].text, a.audio["05"]]);
    dbSheet.getRange(dbSheet.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
    Utilities.sleep(300);
  });
}
