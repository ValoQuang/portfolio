"use client";

import dynamic from "next/dynamic";

export const UniverseClient = dynamic(
  () => import("./three/Universe").then((m) => m.Universe),
  { ssr: false },
);
