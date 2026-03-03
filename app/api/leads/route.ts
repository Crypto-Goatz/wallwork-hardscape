import { NextRequest, NextResponse } from "next/server";
import { getSheetData, updateSheetRow } from "@/lib/google/sheets";

export async function GET() {
  try {
    const rows = await getSheetData("leads");
    return NextResponse.json({ data: rows });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { rowIndex, status } = await req.json();
    const rows = await getSheetData("leads");
    const row = rows[rowIndex];
    if (!row) return NextResponse.json({ error: "Row not found" }, { status: 404 });
    await updateSheetRow("leads", rowIndex, { ...row, status });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
