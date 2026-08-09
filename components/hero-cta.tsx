"use client";

import Link from "next/link";
import SpecularButton from "@/components/specular-button";

export default function HeroCTA() {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link href="/#projects" className="btn-noir btn-noir-primary btn-noir-lg">
        View my work
      </Link>
      <SpecularButton
        size="lg"
        radius={18}
        tint="#ffffff"
        tintOpacity={0}
        blur={0}
        textColor="#f5f5f5"
        lineColor="#6366f1"
        baseColor="#27272a"
        intensity={1}
        shineSize={10}
        shineFade={40}
        thickness={1.2}
        speed={0.35}
        followMouse
        proximity={250}
        autoAnimate={false}
        onClick={() => {
          const a = document.createElement("a");
          a.href = "/Muhammad_Wyzer_CV_ATS_v2.pdf";
          a.download = "Muhammad_Wyzer_CV.pdf";
          a.click();
        }}
      >
        Download CV
      </SpecularButton>
    </div>
  );
}
