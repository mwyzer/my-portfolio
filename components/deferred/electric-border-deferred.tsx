"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const ElectricBorder = dynamic(() => import("@/components/electric-border"), {
  ssr: false,
});

type ElectricBorderProps = ComponentProps<typeof ElectricBorder>;

export default function ElectricBorderDeferred(props: ElectricBorderProps) {
  return <ElectricBorder {...props} />;
}
