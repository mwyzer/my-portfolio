"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import type { PortfolioAbout } from "@/types/database";

const DEFAULT_LINKS = {
  linkedin: "https://www.linkedin.com/in/muhammad-wyzer/",
  gitlab: "https://gitlab.com/mwyzer",
  github: "https://github.com/mwyzer",
  email: "muhammad.wyzer@gmail.com",
  phone: "+62 822 1137 6074",
};

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "social", label: "Social Links" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "experience", label: "Experience" },
  { id: "techstack", label: "Tech Stack" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function DashboardSettingsPage() {
  const [profile, setProfile] = useState<PortfolioAbout | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const supabase = createClient();

  // Profile
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Social
  const [linkedinUrl, setLinkedinUrl] = useState(DEFAULT_LINKS.linkedin);
  const [gitlabUrl, setGitlabUrl] = useState(DEFAULT_LINKS.gitlab);
  const [githubUrl, setGithubUrl] = useState(DEFAULT_LINKS.github);
  const [email, setEmail] = useState(DEFAULT_LINKS.email);
  const [phone, setPhone] = useState(DEFAULT_LINKS.phone);

  // Education
  const [education, setEducation] = useState("");

  // Certifications
  const [certifications, setCertifications] = useState("");

  // Experience
  const [experience, setExperience] = useState("");

  // Tech Stack — stored as JSON array of { category, items } in social_links.techstack
  const [techStackJson, setTechStackJson] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data } = await supabase.from("portfolio_about").select("*").single();
    if (data) {
      setProfile(data);
      setName(data.name || "");
      setTitle(data.title || "");
      setBio(data.bio || "");
      setSkills(data.skills?.join(", ") || "");
      setResumeUrl(data.resume_url || "");
      setAvatarUrl(data.avatar_url || "");
      const links = (data.social_links as Record<string, any> | null) ?? {};
      setLinkedinUrl(links.linkedin || DEFAULT_LINKS.linkedin);
      setGitlabUrl(links.gitlab || DEFAULT_LINKS.gitlab);
      setGithubUrl(links.github || DEFAULT_LINKS.github);
      setEmail(links.email || DEFAULT_LINKS.email);
      setPhone(links.phone || DEFAULT_LINKS.phone);
      setEducation(links.education || "");
      setCertifications(links.certifications || "");
      setExperience(links.experience || "");
      setTechStackJson(links.techstack ? JSON.stringify(links.techstack, null, 2) : JSON.stringify(getDefaultTechStack(), null, 2));
    } else {
      setTechStackJson(JSON.stringify(getDefaultTechStack(), null, 2));
    }
  };

  const buildSocialLinks = () => ({
    linkedin: linkedinUrl || null,
    gitlab: gitlabUrl || null,
    github: githubUrl || null,
    email: email || null,
    phone: phone || null,
    education: education || null,
    certifications: certifications || null,
    experience: experience || null,
    techstack: parseTechStack(),
  });

  const parseTechStack = () => {
    try {
      const parsed = JSON.parse(techStackJson);
      return Array.isArray(parsed) ? parsed : getDefaultTechStack();
    } catch {
      return getDefaultTechStack();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const profileData = {
      name,
      title,
      bio,
      skills: skillsArray,
      resume_url: resumeUrl || null,
      avatar_url: avatarUrl || null,
      social_links: buildSocialLinks(),
    };

    if (profile) {
      const { error } = await supabase
        .from("portfolio_about")
        .update(profileData)
        .eq("id", profile.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Profile updated" });
      }
    } else {
      const { error } = await supabase.from("portfolio_about").insert(profileData);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Profile created" });
      }
    }

    setLoading(false);
    loadProfile();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and site settings</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors -mb-px border border-transparent",
              activeTab === tab.id
                ? "bg-background border-border border-b-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{TABS.find((t) => t.id === activeTab)?.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {/* ── Profile ── */}
            {activeTab === "profile" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title / Tagline</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, TypeScript, Python" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume URL</Label>
                    <Input id="resume" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://..." />
                  </div>
                </div>
              </>
            )}

            {/* ── Social Links ── */}
            {activeTab === "social" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone / WhatsApp</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+62 ..." />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input id="linkedin" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input id="github" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gitlab">GitLab URL</Label>
                    <Input id="gitlab" value={gitlabUrl} onChange={(e) => setGitlabUrl(e.target.value)} placeholder="https://gitlab.com/..." />
                  </div>
                </div>
              </>
            )}

            {/* ── Education ── */}
            {activeTab === "education" && (
              <div className="space-y-2">
                <Label htmlFor="education">Formal Education</Label>
                <Textarea
                  id="education"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  rows={12}
                  placeholder={`Institution – Degree\nYear – Year\n\nNext Institution – Degree\nYear – Year`}
                />
                <p className="text-xs text-muted-foreground">
                  Separate entries with a blank line. Each entry: Institution – Degree on line 1, period on line 2.
                </p>
              </div>
            )}

            {/* ── Certifications ── */}
            {activeTab === "certifications" && (
              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications &amp; Training</Label>
                <Textarea
                  id="certifications"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  rows={12}
                  placeholder={`2007\tInternship at PT. Krakatau Steel, Cilegon, Banten.\n\n2025\tTraining of Trainer ...`}
                />
                <p className="text-xs text-muted-foreground">
                  Format: Year, Tab, then description. Separate entries with a blank line.
                </p>
              </div>
            )}

            {/* ── Experience ── */}
            {activeTab === "experience" && (
              <div className="space-y-2">
                <Label htmlFor="experience">Work Experience</Label>
                <Textarea
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  rows={16}
                  placeholder={`Period\nRole – Company\n• Bullet point\n• Bullet point\n\nNext Period\nNext Role – Next Company\n• Bullet point`}
                />
                <p className="text-xs text-muted-foreground">
                  Separate entries with a blank line. Format: Period on line 1, Role – Company on line 2, then bullet points.
                </p>
              </div>
            )}

            {/* ── Tech Stack ── */}
            {activeTab === "techstack" && (
              <div className="space-y-2">
                <Label htmlFor="techstack">Tech Stack (JSON)</Label>
                <Textarea
                  id="techstack"
                  value={techStackJson}
                  onChange={(e) => setTechStackJson(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Array of {"{ category, items }"} objects. Edit with care — invalid JSON will fall back to the default.
                </p>
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save All Settings"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function getDefaultTechStack() {
  return [
    {
      category: "Frontend",
      items: [
        "Next.js 15", "Nuxt 4", "React 18/19", "Vue 3", "TypeScript", "Pinia",
        "Tailwind CSS", "DaisyUI", "shadcn/ui", "Vuestic UI", "Radix UI",
        "Lucide Icons", "Recharts", "PWA", "Zustand", "TanStack Query", "Axios",
        "React Hook Form", "Zod",
      ],
    },
    {
      category: "Backend",
      items: [
        "ASP.NET Core", "Supabase", "PostgreSQL", "EF Core", "pgvector",
        "Nitro", "SignalR", "Docker", "Vite", "Vitest", "Playwright", "xUnit",
      ],
    },
  ];
}
