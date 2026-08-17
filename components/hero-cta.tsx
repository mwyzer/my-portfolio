import Link from "next/link";

export default function HeroCTA() {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link href="/#projects" className="btn-noir btn-noir-primary btn-noir-lg">
        View my work
      </Link>
      <a
        href="/Muhammad_Wyzer_CV_ATS_v2.pdf"
        download="CV_Muhammad_Wyzer.pdf"
        className="btn-noir btn-noir-lg"
      >
        Download CV
      </a>
    </div>
  );
}
