"use client";

import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { parseVelocityReport, ParseResult } from "@/components/slotting/parseVelocityReport";

const LS_VELOCITY_KEY = "dc_slotting_velocity_v1";
const LS_VELOCITY_META_KEY = "dc_slotting_velocity_meta_v1";

export function VelocityImportPanel({ onImported }: { onImported: (rows: any[]) => void }) {
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const persist = useCallback((res: ParseResult) => {
    localStorage.setItem(LS_VELOCITY_KEY, JSON.stringify(res.rows));
    localStorage.setItem(LS_VELOCITY_META_KEY, JSON.stringify(res.meta));
    onImported(res.rows);
  }, [onImported]);

  function parseAndSave(text: string) {
    const res = parseVelocityReport(text);
    setResult(res);
    if (res.errors.length === 0) persist(res);
  }

  async function handleFile(file: File) {
    const text = await file.text();
    parseAndSave(text);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Velocity Import (30 days)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Drag/drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className={[
            "rounded-xl border border-dashed p-4 text-sm",
            dragOver ? "bg-slate-50" : "bg-white",
          ].join(" ")}
        >
          <div className="font-medium">Drag & drop CSV/TSV here</div>
          <div className="text-xs text-muted-foreground">
            Your Excel paste format (tab-separated) works too.
          </div>
          <div className="mt-2">
            <input
              type="file"
              accept=".csv,.tsv,.txt"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
        </div>

        {/* Paste box */}
        <Textarea
          rows={8}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Paste header + rows from Excel (TSV) or CSV here…"
        />

        <div className="flex gap-2">
          <Button size="sm" onClick={() => parseAndSave(raw)}>
            Parse pasted data
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => { setRaw(""); setResult(null); }}
          >
            Clear
          </Button>
        </div>

        {/* Results summary */}
        {result && (
          <div className="rounded-xl border p-3 text-xs space-y-2">
            <div>
              Parsed: <b>{result.meta.rowCountValid}</b> rows (raw: {result.meta.rowCountRaw}) •
              delimiter: {result.meta.delimiter.toUpperCase()}
            </div>

            {result.errors.length > 0 && (
              <div className="text-rose-700">
                <div className="font-medium">Errors</div>
                <ul className="list-disc pl-5">
                  {result.errors.slice(0, 8).map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}

            {result.warnings.length > 0 && (
              <div className="text-amber-700">
                <div className="font-medium">Warnings</div>
                <ul className="list-disc pl-5">
                  {result.warnings.slice(0, 8).map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
