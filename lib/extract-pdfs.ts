import fs from "fs";
import path from "path";

// ── data.json structured parser ──

interface DataJson {
  personal_information: Record<string, any>;
  professional_titles: string[];
  professional_summary: string;
  contact: Record<string, string>;
  education: { institution: string; degree?: string; start_year: number; end_year: number }[];
  certifications_and_training: { year: number; name: string; organization: string }[];
  work_experience: {
    position: string;
    company: string;
    location?: string;
    start: string;
    end: string;
    responsibilities?: string[];
    projects?: { name: string; technology_stack: string[]; tools?: string[] }[];
    technology_stacks?: string[][];
    technology_stack?: string[];
    tools?: string[];
    software?: string[];
  }[];
  skills: Record<string, string[]>;
  portfolio_projects: Record<string, any>[];
  community_and_leadership: { role: string; location?: string; channel?: string; year?: number }[];
  cover_letter: Record<string, any>;
  portfolio_metadata: Record<string, any>;
  source_documents: string[];
}

/**
 * Read files/data.json and format it into clean, structured markdown
 * for the AI agent. This is the sole data source.
 */
export function readDataJson(): string {
  const filesDir = path.join(process.cwd(), "files");
  const jsonPath = path.join(filesDir, "data.json");

  if (!fs.existsSync(jsonPath)) {
    console.warn("files/data.json not found — agent context will be empty");
    return "";
  }

  try {
    const raw = fs.readFileSync(jsonPath, "utf-8");
    const data: DataJson = JSON.parse(raw);
    const sections: string[] = [];

    const pi = data.personal_information;
    if (pi) {
      sections.push(
        `## Personal Information\n- **Name**: ${pi.name}\n- **Gender**: ${pi.gender}\n- **Age**: ${pi.age}\n- **Date of Birth**: ${pi.date_of_birth}\n- **Place of Birth**: ${pi.place_of_birth}\n- **Address**: ${pi.address}\n- **Email**: ${pi.email}\n- **Phone/WhatsApp**: ${pi.phone_whatsapp}`
      );
    }

    if (data.professional_titles?.length) {
      sections.push(`## Professional Titles\n${data.professional_titles.map((t) => `- ${t}`).join("\n")}`);
    }

    if (data.professional_summary) {
      sections.push(`## Professional Summary\n${data.professional_summary}`);
    }

    if (data.contact && Object.keys(data.contact).length) {
      const c = data.contact;
      sections.push(
        `## Contact Links\n${c.github ? `- GitHub: ${c.github}\n` : ""}${c.gitlab ? `- GitLab: ${c.gitlab}\n` : ""}${c.linkedin ? `- LinkedIn: ${c.linkedin}\n` : ""}${c.youtube ? `- YouTube: ${c.youtube}\n` : ""}${c.facebook ? `- Facebook: ${c.facebook}\n` : ""}${c.instagram ? `- Instagram: ${c.instagram}\n` : ""}`.trim()
      );
    }

    if (data.skills && Object.keys(data.skills).length) {
      const skillLines = Object.entries(data.skills).map(
        ([cat, items]) => `- **${cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}**: ${items.join(", ")}`
      );
      sections.push(`## Skills\n${skillLines.join("\n")}`);
    }

    if (data.work_experience?.length) {
      const expLines = data.work_experience.map((job) => {
        const lines: string[] = [
          `### ${job.position} at ${job.company}${job.location ? ` (${job.location})` : ""}`,
          `**Period**: ${job.start} → ${job.end}`,
        ];
        if (job.responsibilities?.length) {
          lines.push(`**Responsibilities**:\n${job.responsibilities.map((r) => `  - ${r}`).join("\n")}`);
        }
        if (job.projects?.length) {
          lines.push(
            `**Projects**:\n${job.projects.map((p) => `  - **${p.name}**\n    Tech: ${p.technology_stack.join(", ")}${p.tools?.length ? `\n    Tools: ${p.tools.join(", ")}` : ""}`).join("\n")}`
          );
        }
        if (job.technology_stacks?.length) {
          lines.push(`**Tech Stacks**:\n${job.technology_stacks.map((ts) => `  - ${ts.join(", ")}`).join("\n")}`);
        }
        if (job.technology_stack?.length) {
          lines.push(`**Tech Stack**: ${job.technology_stack.join(", ")}`);
        }
        if (job.tools?.length) {
          lines.push(`**Tools**: ${job.tools.join(", ")}`);
        }
        return lines.join("\n");
      });
      sections.push(`## Work Experience\n${expLines.join("\n\n")}`);
    }

    if (data.education?.length) {
      const eduLines = data.education.map(
        (e) => `- **${e.institution}**${e.degree ? ` — ${e.degree}` : ""} (${e.start_year} – ${e.end_year})`
      );
      sections.push(`## Education\n${eduLines.join("\n")}`);
    }

    if (data.certifications_and_training?.length) {
      const certLines = data.certifications_and_training.map(
        (c) => `- **${c.name}** — ${c.organization} (${c.year})`
      );
      sections.push(`## Certifications & Training\n${certLines.join("\n")}`);
    }

    if (data.portfolio_projects?.length) {
      const projLines = data.portfolio_projects.map((p) => {
        const lines: string[] = [`### ${p.name}`];
        if (p.problem) lines.push(`**Problem**: ${p.problem}`);
        if (p.solution) lines.push(`**Solution**: ${p.solution}`);
        if (p.description) lines.push(`**Description**: ${p.description}`);
        if (p.features?.length) lines.push(`**Features**:\n${p.features.map((f: string) => `  - ${f}`).join("\n")}`);
        if (p.metrics) lines.push(`**Metrics**: ${Object.entries(p.metrics).map(([k, v]) => `${k}: ${v}`).join(", ")}`);
        if (p.technology_stack?.length) lines.push(`**Tech**: ${p.technology_stack.join(", ")}`);
        if (p.target_users?.length) lines.push(`**Target Users**: ${p.target_users.join(", ")}`);
        return lines.join("\n");
      });
      sections.push(`## Portfolio Projects\n${projLines.join("\n\n")}`);
    }

    if (data.community_and_leadership?.length) {
      const commLines = data.community_and_leadership.map(
        (c) => `- ${c.role}${c.location ? ` — ${c.location}` : ""}${c.year ? ` (${c.year})` : ""}${c.channel ? ` — Channel: ${c.channel}` : ""}`
      );
      sections.push(`## Community & Leadership\n${commLines.join("\n")}`);
    }

    if (data.cover_letter?.key_points?.length) {
      sections.push(
        `## Cover Letter Highlights\nTarget: ${data.cover_letter.target_position || "N/A"}\n${data.cover_letter.key_points.map((p: string) => `- ${p}`).join("\n")}`
      );
    }

    if (data.source_documents?.length) {
      sections.push(`## Reference Documents (in files/)\n${data.source_documents.map((d) => `- ${d}`).join("\n")}`);
    }

    return sections.join("\n\n---\n\n");
  } catch (err) {
    console.error("Failed to parse files/data.json:", err);
    return "";
  }
}

/**
 * @deprecated Use extractAllDocuments() instead — it handles all file types.
 */
export async function extractAllPdfs(): Promise<string> {
  return extractAllDocuments();
}

/**
 * Invalidate the file cache — call this after updating files.
 */
export function invalidatePdfCache(): void {
  cachedContext = null;
  cachedAt = 0;
}
