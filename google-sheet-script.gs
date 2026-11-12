/**
 * Knee exercise progress log.
 * Paste this into Extensions → Apps Script in your Google Sheet, then deploy as a web app
 * (see SETUP.md). Each kid's app sends one summary per day; this keeps one row per kid per day,
 * updating it whenever they check something off or change their pain rating.
 */
const SHEET_NAME = 'Daily';
const HEADERS = ['Kid', 'Date', 'Done', 'Total', '% done', 'Knee pain (0-10)', 'Not done yet', 'Last update'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d || !d.kid || !/^\d{4}-\d{2}-\d{2}$/.test(d.date)) return out('bad request');
    const sheet = getSheet();
    const tz = Session.getScriptTimeZone();
    const key = d.kid + '|' + d.date;
    const rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues() : [];
    let row = -1;
    for (let i = 0; i < rows.length; i++) {
      const day = rows[i][1] instanceof Date ? Utilities.formatDate(rows[i][1], tz, 'yyyy-MM-dd') : String(rows[i][1]);
      if (rows[i][0] + '|' + day === key) { row = i + 2; break; }
    }
    const [y, m, dd] = d.date.split('-').map(Number);
    const values = [[
      String(d.kid).slice(0, 40),
      new Date(y, m - 1, dd),
      Number(d.done) || 0,
      Number(d.total) || 0,
      d.total ? (Number(d.done) || 0) / Number(d.total) : 0,
      d.pain === null || d.pain === undefined ? '' : Number(d.pain),
      String(d.missing || '').slice(0, 2000),
      new Date()
    ]];
    if (row === -1) {
      sheet.appendRow(values[0]);
      row = sheet.getLastRow();
    } else {
      sheet.getRange(row, 1, 1, HEADERS.length).setValues(values);
    }
    sheet.getRange(row, 2).setNumberFormat('ddd m/d/yyyy');
    sheet.getRange(row, 5).setNumberFormat('0%');
    sheet.getRange(row, 8).setNumberFormat('ddd m/d h:mm am/pm');
    sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).sort([{ column: 2, ascending: false }, { column: 1, ascending: true }]);
    return out('ok');
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return out('The knee exercise log is running.');
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME, 0);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setColumnWidth(7, 420);
  }
  return sheet;
}

function out(text) {
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}
