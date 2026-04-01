"use client";

import { useMapState } from "@/components/map/useMapState";
import { MapCanvas } from "@/components/map/MapCanvas";
import { InspectorPanel } from "@/components/map/InspectorPanel";
import { DEFAULT_MODEL } from "@/components/map/defaults";

export default function MapBuilderPage() {
  const map = useMapState(DEFAULT_MODEL);

  return (
    <div className="flex h-screen">
      <MapCanvas {...map} />
      <InspectorPanel {...map} />
    </div>
  );
}