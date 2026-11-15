import { describe, it, expect } from "vitest";
import {
  FLAGSHIP_PROJECT_ENTRIES,
  mergeWithFlagshipProjects,
  resolveProjectById,
} from "@/lib/flagship-projects";
import type { PortfolioProject, CaseStudy } from "@/types/database";

describe("flagship-projects", () => {
  it("contains flagship repositories with highlights, architecture diagrams, decisions, and metrics", () => {
    expect(FLAGSHIP_PROJECT_ENTRIES.length).toBeGreaterThanOrEqual(8);
    for (const entry of FLAGSHIP_PROJECT_ENTRIES) {
      const cs = entry.project.case_study as unknown as CaseStudy;
      expect(cs).toBeTruthy();
      expect(cs.highlights?.length).toBeGreaterThan(0);
      expect(cs.architectureDiagram?.length).toBeGreaterThan(0);
      expect(cs.engineeringDecisions?.length).toBeGreaterThan(0);
      expect(cs.metrics?.length).toBeGreaterThan(0);
      // Verify R-02: no em-dashes in UI copy
      expect(JSON.stringify(entry.project)).not.toContain("—");
    }
  });

  it("enriches existing DB project and fixes placeholder github_url while preserving DB id and views", () => {
    const dbPropertyHub: PortfolioProject = {
      id: "uuid-propertyhub-123",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
      title: "PropertyHub",
      subtitle: null,
      description: "Existing DB description",
      image_url: null,
      live_url: null,
      github_url: "https://github.com/mwyzer/99999",
      youtube_url: null,
      technologies: ["Go"],
      featured: true,
      order: 8,
      case_study: null,
      category: "personal",
      views: 42,
    };

    const merged = mergeWithFlagshipProjects([dbPropertyHub]);
    const enriched = merged.find((p) => p.id === "uuid-propertyhub-123");
    expect(enriched).toBeDefined();
    expect(enriched?.views).toBe(42);
    expect(enriched?.github_url).toBe("https://github.com/mwyzer/golang-next-property-listings");
    const cs = enriched?.case_study as unknown as CaseStudy;
    expect(cs?.highlights?.length).toBeGreaterThan(0);
    expect(cs?.metrics).toContain("157 Source Files");
  });

  it("resolves flagship project by slug id when not yet in Supabase", () => {
    const resolved = resolveProjectById("workforceos", null);
    expect(resolved).not.toBeNull();
    expect(resolved?.title).toBe("WorkForceOS");
    expect(resolved?.github_url).toBe("https://github.com/mwyzer/WorkForceOS");
  });
});
