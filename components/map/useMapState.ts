"use client";

import { useState, useMemo } from "react";

export function useMapState(initialModel: any) {
  const [model, setModel] = useState(initialModel);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState("place");

  const zonesById = useMemo(() => {
    const m = new Map();
    model.zones.forEach((z: any) => m.set(z.id, z));
    return m;
  }, [model.zones]);

  function updateLocation(id: string, patch: any) {
    setModel((m: any) => ({
      ...m,
      locations: m.locations.map((l: any) =>
        l.id === id ? { ...l, ...patch } : l
      ),
    }));
  }

  return {
    model,
    setModel,
    selectedId,
    setSelectedId,
    tool,
    setTool,
    zonesById,
    updateLocation,
  };
}
