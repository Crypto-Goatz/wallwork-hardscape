import { getSheetsClient } from "./auth";
import { SHEETS_SCHEMA, type SheetName } from "@/config/sheets-schema";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!;

export type Row = Record<string, string>;

/**
 * Read all rows from a named sheet tab.
 * Returns an array of objects keyed by column headers.
 */
export async function getSheetData(sheetName: SheetName): Promise<Row[]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
  });

  const rows = res.data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Row = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || "";
    });
    return obj;
  });
}

/**
 * Get the site_config sheet as a key-value map.
 */
export async function getSiteConfigFromSheet(): Promise<Record<string, string>> {
  const rows = await getSheetData("site_config");
  const config: Record<string, string> = {};
  for (const row of rows) {
    if (row.key) config[row.key] = row.value || "";
  }
  return config;
}

/**
 * Update a specific row in a sheet (1-indexed, row 1 = headers, row 2 = first data row).
 */
export async function updateSheetRow(
  sheetName: SheetName,
  rowIndex: number,
  data: Row
): Promise<void> {
  const sheets = getSheetsClient();
  const schema = SHEETS_SCHEMA[sheetName];
  const values = schema.columns.map((col) => data[col] || "");

  // rowIndex is 0-based for data rows; row 1 is headers, so data starts at row 2
  const range = `${sheetName}!A${rowIndex + 2}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: "RAW",
    requestBody: { values: [values] },
  });
}

/**
 * Append a new row to a sheet.
 */
export async function appendSheetRow(
  sheetName: SheetName,
  data: Row
): Promise<void> {
  const sheets = getSheetsClient();
  const schema = SHEETS_SCHEMA[sheetName];
  const values = schema.columns.map((col) => data[col] || "");

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
    valueInputOption: "RAW",
    requestBody: { values: [values] },
  });
}

/**
 * Delete a row from a sheet by clearing it.
 * Note: Google Sheets API doesn't support row deletion via values API,
 * so we clear the row and it can be cleaned up later.
 */
export async function deleteSheetRow(
  sheetName: SheetName,
  rowIndex: number
): Promise<void> {
  const sheets = getSheetsClient();
  const schema = SHEETS_SCHEMA[sheetName];
  const emptyCells = schema.columns.map(() => "");

  const range = `${sheetName}!A${rowIndex + 2}:${String.fromCharCode(64 + schema.columns.length)}${rowIndex + 2}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: "RAW",
    requestBody: { values: [emptyCells] },
  });
}
