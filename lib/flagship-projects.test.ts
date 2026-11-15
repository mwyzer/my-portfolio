import { describe, it, expect } from "vitest";
import {
  FLAGSHIP_PROJECT_ENTRIES,
  mergeWithFlagshipProjects,
  normalizePortfolioProfile,
  resolveProjectById,
} from "@/lib/flagship-projects";
import type { PortfolioAbout, PortfolioProject, CaseStudy } from "@/types/database";

describe("flagship-projects", () => {
  it("contains flagship repositories with highlights, architecture diagrams, decisions, and metrics", () => {
    expect(FLAGSHIP_PROJECT_ENTRIES.length).toBeGreaterThanOrEqual(11);
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

  it("enriches existing DB project and fixes placeholder github_url and short descriptions while preserving DB id and views", () => {
    const dbPropertyHub: PortfolioProject = {
      id: "uuid-propertyhub-123",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
      title: "PropertyHub",
      subtitle: null,
      description: "Short placeholder",
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
    expect(enriched?.description).toContain("Enterprise multi-tenant property marketplace");
    const cs = enriched?.case_study as unknown as CaseStudy;
    expect(cs?.highlights?.length).toBeGreaterThan(0);
    expect(cs?.metrics).toContain("157 Source Files");
  });

  it("prioritizes the 6 core flagship projects on the homepage ahead of legacy order:0 DB rows", () => {
    const legacyModernHub: PortfolioProject = {
      id: "uuid-modernhub",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
      title: "ModernHub — Team Work & Project Management Platform using CodeIgniter 4",
      subtitle: null,
      description: "Legacy description",
      image_url: null,
      live_url: null,
      github_url: "https://github.com/mwyzer/modernhub",
      youtube_url: null,
      technologies: ["CodeIgniter 4"],
      featured: true,
      order: 0,
      case_study: null,
      category: "personal",
      views: 3,
    };

    const top6 = mergeWithFlagshipProjects([legacyModernHub], { featuredOnly: true, limit: 6 });
    expect(top6.map((p) => p.title)).toEqual([
      "WorkForceOS",
      "Nautical ERP (nautica_erp)",
      "FIHOS (go-react-fihos)",
      "PropertyHub",
      "TalentMatch AI",
      "Shipping Ops Agent",
    ]);
  });

  it("upgrades legacy Supabase portfolio_about profile to Software Engineer & AI Engineer", () => {
    const staleProfile: PortfolioAbout = {
      id: "about-1",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
      name: "Muhammad Wyzer",
      title: "Full Stack Developer & Mentor",
      bio: "I am a Full Stack Developer and Mentor with over 3 years of experience building web applications using Laravel, MySQL, PostgreSQL, and modern JavaScript.",
      avatar_url: null,
      resume_url: null,
      skills: ["Laravel", "PHP", "jQuery", "Moodle"],
      social_links: {},
    };

    const normalized = normalizePortfolioProfile(staleProfile);
    expect(normalized.title).toContain("Software Engineer (Python 3 · Go · Java 21 · TypeScript)");
    expect(normalized.skills).toContain("Python 3");
    expect(normalized.skills).toContain("Go (Golang)");
    expect(normalized.skills).toContain("Java 21");
    expect(normalized.skills).not.toContain("jQuery");
  });

  it("resolves flagship project by slug id when not yet in Supabase", () => {
    const resolved = resolveProjectById("workforceos", null);
    expect(resolved).not.toBeNull();
    expect(resolved?.title).toBe("WorkForceOS");
    expect(resolved?.github_url).toBe("https://github.com/mwyzer/WorkForceOS");
  });
});
