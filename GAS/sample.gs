/**
 * Sample Google Apps Script backend for TransitExpense Lite
 *
 * How to use:
 * 1) Create a Google Spreadsheet with sheets: 'entries' and 'masters'
 * 2) In 'masters':
 *    - Column A: Staff names (1 header row optional)
 *    - Column B: Origin presets (1 header row optional)
 * 3) In 'entries': set header row like:
 *    A: Timestamp, B: Month, C: Name, D: Origin, E: Destination, F: Route,
 *    G: Transport, H: OneWay, I: Roundtrip, J: Days CSV, K: Count, L: Total, M: Note
 * 4) Paste this code to Apps Script editor attached to the spreadsheet.
 * 5) Deploy -> New deployment -> Type: Web app -> Anyone with the link
 * 6) Copy Web App URL to .env as GAS_ENDPOINT
 */

function doGet(e) {
  const resource = e.parameter.resource;
  if (resource === 'masters') {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('masters');
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({ staff: [], origins: [] })).setMimeType(ContentService.MimeType.JSON);
    const values = sheet.getDataRange().getValues();
    const staff = [];
    const origins = [];
    // Detect header row automatically (optional header)
    let start = 0;
    if (
      values.length > 0 &&
      (
        String(values[0][0]).includes('スタッフ') ||
        String(values[0][1]).includes('出発地') ||
        String(values[0][0]).toLowerCase().includes('staff') ||
        String(values[0][1]).toLowerCase().includes('origin')
      )
    ) {
      start = 1;
    }
    for (let i = start; i < values.length; i++) {
      const a = values[i][0];
      const b = values[i][1];
      if (a) staff.push(String(a));
      if (b) origins.push(String(b));
    }
    return ContentService.createTextOutput(JSON.stringify({ staff, origins }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput('OK');
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data && data.action === 'appendEntry') {
    return appendEntry_(data.payload);
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Invalid request' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function appendEntry_(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('entries');
  if (!sheet) return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'entries sheet not found' })).setMimeType(ContentService.MimeType.JSON);

  const row = [
    new Date(),
    payload.month,
    payload.name,
    payload.origin,
    payload.destination,
    payload.route,
    payload.transport || '',
    Number(payload.oneWayFare),
    Number(payload.roundtripFare),
    String(payload.daysCsv),
    Number(payload.daysCount),
    Number(payload.total),
    payload.note || ''
  ];
  sheet.appendRow(row);
  return ContentService.createTextOutput(JSON.stringify({ ok: true, message: 'Appended' }))
    .setMimeType(ContentService.MimeType.JSON);
}
