"use client";

import { Button } from "@/components/ui/button";

export function GeneratorPanel({ model, setModel }: any) {
  function generate() {
    setModel((m: any) => ({
      ...m,
      locations: [
        ...m.locations,
        {
          id: crypto.randomUUID(),
          location_id: "A01-01-01",
          slot_type: "FLOW",
          x: 0,
          y: 0,
        },
      ],
    }));
  }

  return (
    <div className="space-y-4">
      <Button onClick={generate}>Generate Locations</Button>
    </div>
  );
}