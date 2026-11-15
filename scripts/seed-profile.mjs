// Seed script: inserts Muhammad Wyzer's profile into Supabase
// Run: node scripts/seed-profile.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env.local manually for cross-Node compatibility
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
  console.error("Run: node --env-file=.env.local scripts/seed-profile.mjs");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const profile = {
  name: "Muhammad Wyzer",
  title: "Software Engineer (Python3 · Go · Java · TypeScript) & AI Engineer",
  bio: "Full-Stack and Backend Software Engineer with 5+ years of experience building scalable backend services, distributed systems, and AI-enabled platforms across Python 3, Go, Java 21, and TypeScript. Author of 20+ production-oriented repositories featuring 250+ automated test suites, Dockerized environments, and deterministic domain engines.",
  avatar_url: "https://gitlab.com/uploads/-/system/user/avatar/6791914/avatar.png?width=800",
  resume_url: "/CV_Muhammad_Wyzer.pdf",
  skills: ["Python 3", "Go (Golang)", "Java 21", "TypeScript", "FastAPI", "Spring Boot 3", "Go Gin", "React", "Next.js", "Vue / Nuxt", "PostgreSQL", "Redis", "Kafka", "Docker", "LangGraph", "RAG"],
  social_links: {
    linkedin: "https://www.linkedin.com/in/muhammad-wyzer/",
    github: "https://github.com/mwyzer",
    gitlab: "https://gitlab.com/mwyzer",
    email: "muhammad.wyzer@gmail.com",
    phone: "+62 822 1137 6074",
    heroProof: [
      "Core Languages · Python 3 / Go / Java 21 / TypeScript",
      "AI & Verification · LangGraph / RAG / 250+ Automated Test Suites",
      "Production Infra · Docker / PostgreSQL / Redis / Kafka / CI/CD",
    ],
    education: "Syarif Hidayatullah State Islamic University Jakarta – B.Sc. in Informatics Engineering (S.Kom.)\n2002 – 2011\n\nAl-Mukhlishin Islamic Senior High School, Bogor\n1999 – 2002\n\nAl-Mukhlishin Islamic Junior High School, Bogor\n1996 – 1999\n\nMadrasah Ibtidaiyah Darunnajah, South Jakarta\n1990 – 1996",
    certifications: "2025\tTraining of Trainer Mata Pelajaran Koding dan Kecerdasan Artifisial, KEMENDIKDASMEN INDONESIA\n\n2013\tCertificate of Appreciation – IT Helpdesk at WTO Ministerial Conference IX, PT. Nusantara Compnet Integrator\n\n2007\tInternship at PT. Krakatau Steel, Cilegon, Banten.",
    experience: "September 2025 – Now\nMentor – Tujuh Belas Agustus 1945 University, North Jakarta\n• Designed programming problems, reference solutions, and deterministic grading rubrics in Programming Fundamentals and Software Engineering\n• Mentored students in algorithms, data structures, debugging, and software projects\n\nDecember 2025 – Now\nMentor – Ganesha Operation\n• Provided mentoring in Informatics, Algorithmic Problem Solving, and Computational Thinking\n\nMay 2025 – Now\nFacilitator – PT. Anagata Sisedu Nusantara\n• Delivered instruction aligned with the national curriculum on coding and AI\n• Guided students in developing logical thinking, problem-solving, and digital literacy skills\n\nAugust 2024 – February 2025\nFull Stack Developer – PT. Pasifik Wija Teknologi, North Kalimantan\n• Built a web application for internet voucher sales and customer management (Laravel 10, MySQL, Laravel Filament)\n• Developed a corporate platform with normalized relational schemas and RBAC (Laravel 10, Tailwind, MySQL)\n\nAugust 1, 2023 – July 2024\nTechnical Support & Backend Developer – PT. Taman Kreasi Indonesia, Semarang\n• Audited and debugged high-volume incoming cargo logs in production relational databases\n• Maintained, refactored, and modernized legacy business modules (Laravel 5.5 to Laravel 8, MySQL, PostgreSQL)\n• Created an employee KPI & performance monitoring platform with analytical charts (Laravel 8, PostgreSQL, jQuery)\n\nAugust 1, 2022 – November 30, 2022\nSoftware Developer – PT. Tutoria Sentra Edukasi, East Jakarta\n• Engineered custom API integrations bridging Moodle LMS with Laravel backend services\n• Designed and implemented a web platform connecting courses, tutors, and students\n• Performed troubleshooting for networks, computers, and cross-system integrations\n\nNovember 6, 2013 – December 20, 2013\nIT Helpdesk Engineer – PT. Nusantara Compnet Integrator (WTO Ministerial Conference IX)\n• Provided mission-critical IT helpdesk, network, and systems troubleshooting during the 9th WTO Ministerial Conference\n\nJune 18, 2012 – July 31, 2013\nDesktop Support Engineer – PT. Berca Hardayaperkasa (Project PAMA), Jakarta\n• Delivered enterprise system support, diagnostics, and infrastructure maintenance for Project PAMA",
  },
};

async function seed() {
  // Check if profile exists
  const { data: existing } = await supabase
    .from("portfolio_about")
    .select("id")
    .single();

  if (existing) {
    console.log("Profile exists, updating...");
    const { error } = await supabase
      .from("portfolio_about")
      .update(profile)
      .eq("id", existing.id);
    if (error) {
      console.error("Update failed:", error.message);
    } else {
      console.log("✅ Profile updated!");
    }
  } else {
    console.log("No profile yet, inserting...");
    const { error } = await supabase
      .from("portfolio_about")
      .insert(profile);
    if (error) {
      console.error("Insert failed:", error.message);
    } else {
      console.log("✅ Profile created!");
    }
  }
}

seed();
