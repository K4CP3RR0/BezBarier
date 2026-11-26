"use client";

import dynamic from "next/dynamic";
import type { BarrierNearby } from "@/lib/api";

const BarriersMap = dynamic(
  () => import("./barriers-map").then((m) => m.BarriersMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] w-full items-center justify-center rounded-lg border border-border/80 text-sm text-muted-foreground">
        Ładowanie mapy…
      </div>
    ),
  },
);

type Props = {
  lat: number;
  lng: number;
  barriers: BarrierNearby[];
  onSelect?: (id: string) => void;
};

export function BarriersMapDynamic(props: Props) {
  return <BarriersMap {...props} />;
}