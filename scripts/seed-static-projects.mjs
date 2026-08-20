// One-off seed: migrates the two hardcoded homepage project entries
// (LMS Mahasiswa card + PropertyHub footer link) into portfolio_projects,
// so they become dashboard-managed like every other project.
// The "AI Helpdesk" footer link is skipped — it already exists as the
// "Portal Helpdesk" / "Backend Portal Helpdesk" rows (same github repo).
// Run: node scripts/seed-static-projects.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const cleaned = line.replace(/\r$/, "");
  const match = cleaned.match(/^([^=]+)=(.*)/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const projects = [
  {
    title: "LMS Mahasiswa",
    description:
      "Full-stack Learning Management System — multi-role (student, instructor, admin), attendance, assignments, quizzes, AI chat assistant, Python playground & PWA support.",
    technologies: [
      "Nuxt 4",
      "Vue 3",
      "TypeScript",
      "Pinia",
      "Supabase",
      "Nitro",
      "Vite",
      "Vuestic UI",
      "PWA",
      "Vitest",
      "Playwright",
    ],
    live_url: "https://nuxt-lms-mahasiswa.vercel.app",
    github_url: "https://github.com/mwyzer/vue-lms-mahasiswa",
    category: "personal",
    featured: true,
    order: 7,
  },
  {
    title: "PropertyHub",
    description:
      "Multi-tenant property listing platform for agencies, banks, and companies across Indonesia — buyer, salesperson, tenant-admin, and platform-admin roles with listing management, photo uploads, and saved properties.",
    technologies: [
      "Go",
      "Gin",
      "GORM",
      "PostgreSQL",
      "React",
      "Vite",
      "Tailwind CSS",
      "React Router",
      "Docker",
      "Kafka",
      "k6",
      "Playwright",
    ],
    github_url: "https://github.com/mwyzer/99999",
    category: "personal",
    featured: true,
    order: 8,
  },
];

async function seed() {
  for (const project of projects) {
    const { data: existing } = await supabase
      .from("portfolio_projects")
      .select("id")
      .ilike("title", project.title)
      .maybeSingle();

    if (existing) {
      console.log(`"${project.title}" already exists, updating...`);
      const { error } = await supabase
        .from("portfolio_projects")
        .update(project)
        .eq("id", existing.id);
      if (error) console.error(`Update failed for ${project.title}:`, error.message);
      else console.log(`Updated "${project.title}"`);
    } else {
      console.log(`Inserting "${project.title}"...`);
      const { error } = await supabase.from("portfolio_projects").insert(project);
      if (error) console.error(`Insert failed for ${project.title}:`, error.message);
      else console.log(`Inserted "${project.title}"`);
    }
  }
}

seed();
