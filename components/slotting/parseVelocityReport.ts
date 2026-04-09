export type VelocityRow = {
  sku: string;                 // Item Name
  units_30d: number;           // ORIG_ORDER_QTY
  unit_length_in: number;
  unit_width_in: number;
  unit_height_in: number;

  // optional extras
  barcode?: string;
  display_location?: string;
  on_hand_qty?: number;
};

export type ParseResult = {
  rows: VelocityRow[];
  errors: string[];
  warnings: string[];
  meta: {
    delimiter: "csv" | "tsv";
    parsedAt: string;
    rowCountRaw: number;
    rowCountValid: number;
  };
};

// Detect delimiter by header line
function detectDelimiter(headerLine: string): "csv" | "tsv" {
  // Your pasted data is tab-delimited; CSV will have commas.
  const tabs = (headerLine.match(/\t/g) || []).length;
  const commas = (headerLine.match(/,/g) || []).length;
  return tabs >= commas ? "tsv" : "csv";
}

function splitLine(line: string, kind: "csv" | "tsv"): string[] {
  // MVP parsing: TSV is simple split; CSV is split by comma.
  // If your CSV can contain quoted commas later, we can upgrade.
  return kind === "tsv" ? line.split("\t") : line.split(",");
}

function num(v: string | undefined): number | null {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function str(v: string | undefined): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

export function parseVelocityReport(text: string): ParseResult {
  const cleaned = text.replace(/\r/g, "").trim();
  const lines = cleaned.split("\n").filter(Boolean);

  const errors: string[] = [];
  const warnings: string[] = [];

  if (lines.length < 2) {
    return {
      rows: [],
      errors: ["No data found. Paste header + at least one data row."],
      warnings: [],
      meta: {
        delimiter: "tsv",
        parsedAt: new Date().toISOString(),
        rowCountRaw: 0,
        rowCountValid: 0,
      },
    };
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitLine(lines[0], delimiter).map(h => h.trim());

  // Column name helpers (exact matches for your report)
  const idx = (name: string) => headers.findIndex(h => h === name);

  const iSku = idx("Item Name");
  const iUnits = idx("ORIG_ORDER_QTY");
  const iL = idx("Item Unit Length");
  const iW = idx("Item Unit Width");
  const iH = idx("Item Unit Height");

  // Optional
  const iBarcode = idx("Item Bar Code");
  const iDispLoc = idx("Display Location");
  const iOnHand = idx("ON_HAND_QTY");

  // Validate required headers
  const missing: string[] = [];
  if (iSku < 0) missing.push("Item Name");
  if (iUnits < 0) missing.push("ORIG_ORDER_QTY");
  if (iL < 0) missing.push("Item Unit Length");
  if (iW < 0) missing.push("Item Unit Width");
  if (iH < 0) missing.push("Item Unit Height");

  if (missing.length) {
    return {
      rows: [],
      errors: [`Missing required columns: ${missing.join(", ")}`],
      warnings: [],
      meta: {
        delimiter,
        parsedAt: new Date().toISOString(),
        rowCountRaw: lines.length - 1,
        rowCountValid: 0,
      },
    };
  }

  const rows: VelocityRow[] = [];
  const seen = new Set<string>();

  for (let r = 1; r < lines.length; r++) {
    const parts = splitLine(lines[r], delimiter);

    const sku = str(parts[iSku]);
    if (!sku) {
      warnings.push(`Row ${r + 1}: missing Item Name (SKU)`);
      continue;
    }

    // Keep SKU as string to avoid losing leading zeros (if any)
    const units = num(parts[iUnits]);
    const L = num(parts[iL]);
    const W = num(parts[iW]);
    const H = num(parts[iH]);

    
if (units == null) {
  warnings.push(
    `Row ${r + 1} (${sku}): ORIG_ORDER_QTY blank → skipped (MVP rule)`
  );
  continue;
}
const units_30d = units;


    // If ORIG_ORDER_QTY is blank, skip SKU entirely for MVP
   const units = num(parts[iUnits]);
   if (units == null) {
     warnings.push(`Row ${r + 1} (${sku}): ORIG_ORDER_QTY blank → skipping SKU (MVP rule)`);
     continue;
   }
   const units_30d = units;


    // If your report truly has one row per SKU, duplicates should not happen.
    // But we protect against it anyway.
    if (seen.has(sku)) {
      warnings.push(`Duplicate SKU ${sku} found (row ${r + 1}); keeping first`);
      continue;
    }
    seen.add(sku);

    const row: VelocityRow = {
      sku,
      units_30d,
      unit_length_in: L,
      unit_width_in: W,
      unit_height_in: H,
    };

    const bc = str(parts[iBarcode]);
    if (bc) row.barcode = bc;

    const dl = str(parts[iDispLoc]);
    if (dl) row.display_location = dl;

    const oh = num(parts[iOnHand]);
    if (oh != null) row.on_hand_qty = oh;

    rows.push(row);
  }

  return {
    rows,
    errors,
    warnings,
    meta: {
      delimiter,
      parsedAt: new Date().toISOString(),
      rowCountRaw: lines.length - 1,
      rowCountValid: rows.length,
    },
  };
}
