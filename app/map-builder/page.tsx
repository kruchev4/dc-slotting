"use client";

import { useMapState } from "@/components/map/useMapState";
import { MapCanvas } from "@/components/map/MapCanvas";
import { InspectorPanel } from "@/components/map/InspectorPanel";
import { DEFAULT_MODEL } from "@/components/map/defaults";

export default function MapBuilderPage() {
  const map = useMapState(DEFAULT_MODEL);

  return (
    <div className="flex h-screen">
      <div className="absolute top-2 left-2 z-50 rounded bg-black/80 px-2 py-1 text-xs text-white">
        map-builder page rendered ✅
      </div>

      <MapCanvas {...map} />
      <InspectorPanel {...map} />
    </div>
  );
}
