"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { X, ArrowRight, Layout, Database, Sparkles, Rocket, CheckCircle2 } from "lucide-react";
import type { CaseStudy } from "@/types/database";
import type { ReactNode } from "react";
import { sanitizeUrl } from "@/lib/sanitize";

const CAPABILITY_GROUPS: { key: keyof CaseStudy["capabilities"]; label: string; icon: typeof Layout }[] = [
  { key: "fullStackEngineering", label: "Full Stack Engineering", icon: Layout },
  { key: "backendData", label: "Backend & Data", icon: Database },
  { key: "aiEngineering", label: "AI Engineering", icon: Sparkles },
  { key: "deliveryQuality", label: "Delivery & Quality", icon: Rocket },
];

interface ProjectPreviewProps {
  projectId: string;
  title: string;
  caseStudy: CaseStudy;
  /** The trigger element — e.g. the card title or an icon button. Rendered as-is via Dialog.Trigger's asChild. */
  children: ReactNode;
}

export default function ProjectPreview({ projectId, title, caseStudy, children }: ProjectPreviewProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[60]"
          style={{ background: "rgba(0,0,0,0.6)" }}
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[61] w-[calc(100vw-2rem)] max-w-2xl max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border p-6"
          style={{ background: "var(--surface-elevated)", borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between mb-6">
            <Dialog.Title className="text-xl font-bold text-text pr-4">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="inline-flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors"
                style={{ color: "var(--text-muted)" }}
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            {caseStudy.problem && (
              <section>
                <h3 className="text-sm font-semibold text-text mb-2">Problem</h3>
                <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">{caseStudy.problem}</p>
              </section>
            )}
            {caseStudy.solution && (
              <section>
                <h3 className="text-sm font-semibold text-text mb-2">Solution</h3>
                <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">{caseStudy.solution}</p>
              </section>
            )}
            {caseStudy.highlights && caseStudy.highlights.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-text mb-2">What I Built</h3>
                <ul className="space-y-1.5">
                  {caseStudy.highlights.map((item, i) => (
                    <li key={`${item}-${i}`} className="flex items-start gap-2 text-sm text-text-muted">
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {(sanitizeUrl(caseStudy.architecture) || caseStudy.architectureDiagram) && (
              <section>
                <h3 className="text-sm font-semibold text-text mb-2">Architecture</h3>
                {caseStudy.architectureDiagram && (
                  <pre className="card-noir overflow-x-auto whitespace-pre font-mono text-[11px] text-text-muted leading-relaxed">
                    {caseStudy.architectureDiagram}
                  </pre>
                )}
                {sanitizeUrl(caseStudy.architecture) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sanitizeUrl(caseStudy.architecture)}
                    alt="Architecture diagram"
                    className={`w-full rounded-lg border ${caseStudy.architectureDiagram ? "mt-3" : ""}`}
                    style={{ borderColor: "var(--border)" }}
                  />
                )}
              </section>
            )}
            {caseStudy.images && caseStudy.images.filter((url) => sanitizeUrl(url)).length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-text mb-2">Gallery</h3>
                <div className="grid grid-cols-2 gap-2">
                  {caseStudy.images.filter((url) => sanitizeUrl(url)).map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={`${url}-${i}`}
                      src={sanitizeUrl(url)}
                      alt={`${title} screenshot ${i + 1}`}
                      className="w-full rounded-lg border"
                      style={{ borderColor: "var(--border)" }}
                    />
                  ))}
                </div>
              </section>
            )}

            {caseStudy.capabilities && CAPABILITY_GROUPS.some((g) => caseStudy.capabilities[g.key]?.length > 0) && (
              <section>
                <h3 className="text-sm font-semibold text-text mb-3">Capabilities</h3>
                <div className="space-y-3">
                  {CAPABILITY_GROUPS.filter((g) => caseStudy.capabilities[g.key]?.length > 0).map((g) => {
                    const Icon = g.icon;
                    return (
                      <div key={g.key}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Icon className="h-3.5 w-3.5 text-accent" />
                          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{g.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {caseStudy.capabilities[g.key].map((item, i) => (
                            <span key={`${item}-${i}`} className="badge-noir">{item}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {caseStudy.metrics && caseStudy.metrics.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-text mb-2">Results</h3>
                <div className="flex flex-wrap gap-1.5">
                  {caseStudy.metrics.map((item, i) => (
                    <span
                      key={`${item}-${i}`}
                      className="badge-noir"
                      style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <Link
            href={`/projects/${projectId}`}
            className="btn-noir btn-noir-primary btn-noir-sm mt-6"
          >
            Open full case study <ArrowRight className="h-4 w-4" />
          </Link>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
