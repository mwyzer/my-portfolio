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
  title: "Full Stack Developer & Mentor",
  bio: "I am a Full Stack Developer and Mentor with over 3 years of experience building web applications using Laravel, MySQL, PostgreSQL, and modern JavaScript. I also deliver training on coding and artificial intelligence aligned with Indonesia's national curriculum. Passionate about problem-solving, digital literacy, and empowering students through technology education.",
  avatar_url: "https://gitlab.com/uploads/-/system/user/avatar/6791914/avatar.png?width=800",
  resume_url: null,
  skills: ["Laravel", "PHP", "MySQL", "PostgreSQL", "JavaScript", "jQuery", "Tailwind CSS", "Python", "AI", "Moodle"],
  social_links: {
    linkedin: "https://www.linkedin.com/in/muhammad-wyzer/",
    github: "https://github.com/mwyzer",
    gitlab: "https://gitlab.com/mwyzer",
    email: "muhammad.wyzer@gmail.com",
    phone: "+62 822 1137 6074",
    education: "Syarif Hidayatullah State Islamic University Jakarta – B.Sc. in Informatics Engineering\n2002 – 2011\n\nAl-Mukhlishin Islamic Senior High School, Bogor\n1999 – 2002\n\nAl-Mukhlishin Islamic Junior High School, Bogor\n1996 – 1999\n\nMadrasah Ibtidaiyah Darunnajah, South Jakarta\n1990 – 1996",
    certifications: "2007\tInternship at PT. Krakatau Steel, Cilegon, Banten.\n\n2025\tTraining of Trainer Mata Pelajaran Koding dan Kecerdasan Artifisial, KEMENDIKNAS INDONESIA",
    experience: "September 2025 – Now\nMentor – Tujuh Belas Agustus 1945 University, North Jakarta\n• Provided mentoring in Programming Fundamentals and Productivity Tools\n\nDecember 2025 – Now\nMentor – Ganesha Operation\n• Provided mentoring in Informatics and Computational Thinking\n\nMay 2025 – Now\nFacilitator – PT. Anagata Sisedu Nusantara\n• Delivered instruction aligned with the national curriculum on coding and AI\n• Guided students in developing logical thinking, problem-solving, and digital literacy skills\n\nAugust 2024 – February 2025\nFull Stack Developer – PT. Pasifik Wija Teknologi, North Kalimantan\n• Developed a company profile website (Laravel 10, Tailwind, MySQL)\n• Built a web application for internet voucher sales and customer management (Laravel 10, MySQL, Laravel Filament)\n\nAugust 1, 2023 – July 2024\nTechnical Support – PT. Taman Kreasi Indonesia, Semarang\n• Checked incoming cargo logs in the database\n• Ensured stable network and database performance\n• Developed additional required modules (Laravel 5.5, MySQL, CRUDBooster, jQuery)\n• Created an employee monitoring project with KPI charts (Laravel 8, PostgreSQL, jQuery)\n\nAugust 1, 2022 – November 30, 2022\nSoftware Developer – PT. Tutoria Sentra Edukasi, East Jakarta\n• Developed online tutoring learning modules and assisted office IT operations\n• Integrated Moodle API with Laravel\n• Designed and implemented a web platform connecting courses, tutors, and students\n• Performed troubleshooting for networks, computers, and other devices",
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
