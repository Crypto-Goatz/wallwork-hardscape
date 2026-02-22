import { google } from "googleapis";
import { getAuthFromCredentials, getSheetsClientWithAuth } from "@/lib/google/auth";
import { SHEETS_SCHEMA, type SheetName } from "@/config/sheets-schema";

interface CreateSheetResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
}

/**
 * Create a new Google Spreadsheet with all required tabs and column headers.
 * Uses credentials directly (for setup before env vars exist).
 */
export async function createSpreadsheet(
  credentials: object,
  businessName: string
): Promise<CreateSheetResult> {
  const auth = getAuthFromCredentials(credentials);
  const sheets = getSheetsClientWithAuth(auth);

  const sheetNames = Object.keys(SHEETS_SCHEMA) as SheetName[];

  // Create spreadsheet with all tabs
  const res = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: `${businessName} — Site Content`,
      },
      sheets: sheetNames.map((name, index) => ({
        properties: {
          title: name,
          index,
          gridProperties: {
            frozenRowCount: 1,
          },
        },
      })),
    },
  });

  const spreadsheetId = res.data.spreadsheetId!;
  const spreadsheetUrl = res.data.spreadsheetUrl!;

  // Write column headers to each tab
  const headerData = sheetNames.map((name) => ({
    range: `${name}!A1`,
    values: [[...SHEETS_SCHEMA[name].columns]],
  }));

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "RAW",
      data: headerData,
    },
  });

  // Format header rows (bold + background color)
  const sheetIds = res.data.sheets?.map((s) => s.properties?.sheetId!) || [];

  const formatRequests = sheetIds.map((sheetId) => ({
    repeatCell: {
      range: {
        sheetId,
        startRowIndex: 0,
        endRowIndex: 1,
      },
      cell: {
        userEnteredFormat: {
          backgroundColor: { red: 0.15, green: 0.15, blue: 0.15 },
          textFormat: {
            bold: true,
            foregroundColor: { red: 1, green: 1, blue: 1 },
          },
        },
      },
      fields: "userEnteredFormat(backgroundColor,textFormat)",
    },
  }));

  // Auto-resize columns
  const resizeRequests = sheetIds.map((sheetId) => ({
    autoResizeDimensions: {
      dimensions: {
        sheetId,
        dimension: "COLUMNS",
        startIndex: 0,
        endIndex: 20,
      },
    },
  }));

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [...formatRequests, ...resizeRequests],
    },
  });

  // Share the spreadsheet with the service account (it already has access as creator)
  // but also make it accessible via link for the user
  const drive = google.drive({ version: "v3", auth });
  await drive.permissions.create({
    fileId: spreadsheetId,
    requestBody: {
      role: "writer",
      type: "anyone",
    },
  });

  return { spreadsheetId, spreadsheetUrl };
}
