/**
 * Al-Quran Digital BACKEND v3.0
 */

const SHEET_NAME = "Database_Quran_Pro";

function doGet(e) {
  if (e && e.parameter && e.parameter.action) {
    try {
      let result;
      if (e.parameter.action === "getSurahList") {
        result = fetchSurahList();
      } else if (e.parameter.action === "getAyatData") {
        result = fetchAyatData(e.parameter.surahId);
      }
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({error: err.message}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Al-Qurab Digital Mushaf')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function fetchSurahList() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  const list = [];
  const seen = new Set();
  for (let i = 1; i < data.length; i++) {
    const sId = data[i][0];
    if (sId && !seen.has(sId)) {
      list.push({ 
        id: sId, name: data[i][1], nameAr: data[i][7], 
        type: data[i][8], count: data[i][9] 
      });
      seen.add(sId);
    }
  }
  return list;
}

function fetchAyatData(surahId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  return data.filter(r => r[0] == surahId).map(r => ({
    no: r[2], arab: r[3], indo: r[4], tafsir: r[5], audio: r[6]
  }));
}

function syncFullData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.clear();
  const header = ["SurahNo", "SurahName", "AyatNo", "TextArab", "TextIndo", "TafsirJalalain", "Audio", "SurahArabic", "Type", "AyahCount"];
  sheet.appendRow(header);

  const resArab = JSON.parse(UrlFetchApp.fetch("https://api.alquran.cloud/v1/quran/quran-uthmani").getContentText()).data;
  const resIndo = JSON.parse(UrlFetchApp.fetch("https://api.alquran.cloud/v1/quran/id.indonesian").getContentText()).data;
  const resTafsir = JSON.parse(UrlFetchApp.fetch("https://api.alquran.cloud/v1/quran/id.jalalayn").getContentText()).data;
  const resMeta = JSON.parse(UrlFetchApp.fetch("https://api.alquran.cloud/v1/surah").getContentText()).data;
  
  let rows = [];
  resArab.surahs.forEach((surah, sIdx) => {
    const meta = resMeta[sIdx];
    surah.ayahs.forEach((ayah, aIdx) => {
      rows.push([
        surah.number, surah.englishName, ayah.numberInSurah, ayah.text,
        resIndo.surahs[sIdx].ayahs[aIdx].text,
        resTafsir.surahs[sIdx].ayahs[aIdx].text,
        `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
        meta.name, meta.revelationType === "Meccan" ? "Makkiyah" : "Madaniyah", meta.numberOfAyahs
      ]);
    });
  });
  sheet.getRange(2, 1, rows.length, header.length).setValues(rows);
  return "✅ Sinkronisasi Berhasil!";
}
