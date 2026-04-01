"use client";

import { AnimatePresence, motion } from "framer-motion";

export function InspectorPanel({
  model,
  selectedId,
  updateLocation,
  setSelectedId,
}: any) {
  const selected = model.locations.find((l: any) => l.id === selectedId);

  return (
    <AnimatePresence>
      {selected && (
        <motion.aside
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="w-[360px] border-l bg-background"
        >
          {/* all inspector UI */}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
``