export function validateModel(model: any) {
  const warnings: string[] = [];

  const ids = new Set<string>();

  for (const loc of model.locations) {
    if (ids.has(loc.location_id)) {
      warnings.push(`Duplicate location ID: ${loc.location_id}`);
    }
    ids.add(loc.location_id);

    if (loc.slot_type === "FLOW" && !loc.lane_depth_cartons) {
      warnings.push(`FLOW slot ${loc.location_id} has no lane depth`);
    }
  }

  return warnings;
}
``