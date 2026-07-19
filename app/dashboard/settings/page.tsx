"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import type { PortfolioAbout } from "@/types/database";

export default function DashboardSettingsPage() {
  const [profile, setProfile] = useState<PortfolioAbout | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Form state
  const [name, setName] = useState("Muhammad Wyzer");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("https://www.linkedin.com/in/muhammad-wyzer/");
  const [gitlabUrl, setGitlabUrl] = useState("https://gitlab.com/mwyzer");
  const [githubUrl, setGithubUrl] = useState("https://github.com/mwyzer");
  const [email, setEmail] = useState("muhammad.wyzer@gmail.com");
  const [phone, setPhone] = useState("+62 822 1137 6074");
  const [education, setEducation] = useState("Syarif Hidayatullah State Islamic University Jakarta – B.Sc. in Informatics Engineering\n2002 – 2011\n\nAl-Mukhlishin Islamic Senior High School, Bogor\n1999 – 2002\n\nAl-Mukhlishin Islamic Junior High School, Bogor\n1996 – 1999\n\nMadrasah Ibtidaiyah Darunnajah, South Jakarta\n1990 – 1996");
  const [certifications, setCertifications] = useState("2007\tInternship at PT. Krakatau Steel, Cilegon, Banten.\n\n2025\tTraining of Trainer Mata Pelajaran Koding dan Kecerdasan Artifisial, KEMENDIKNAS INDONESIA");
  const [experience, setExperience] = useState("September 2025 – Now\nMentor – Tujuh Belas Agustus 1945 University, North Jakarta\n• Provided mentoring in Programming Fundamentals and Productivity Tools\n\nDecember 2025 – Now\nMentor – Ganesha Operation\n• Provided mentoring in Informatics and Computational Thinking\n\nMay 2025 – Now\nFacilitator – PT. Anagata Sisedu Nusantara\n• Delivered instruction aligned with the national curriculum on coding and AI\n• Guided students in developing logical thinking, problem-solving, and digital literacy skills\n\nAugust 2024 – February 2025\nFull Stack Developer – PT. Pasifik Wija Teknologi, North Kalimantan\n• Developed a company profile website (Laravel 10, Tailwind, MySQL)\n• Built a web application for internet voucher sales and customer management (Laravel 10, MySQL, Laravel Filament)\n\nAugust 1, 2023 – July 2024\nTechnical Support – PT. Taman Kreasi Indonesia, Semarang\n• Checked incoming cargo logs in the database\n• Ensured stable network and database performance\n• Developed additional required modules (Laravel 5.5, MySQL, CRUDBooster, jQuery)\n• Created an employee monitoring project with KPI charts (Laravel 8, PostgreSQL, jQuery)\n\nAugust 1, 2022 – November 30, 2022\nSoftware Developer – PT. Tutoria Sentra Edukasi, East Jakarta\n• Developed online tutoring learning modules and assisted office IT operations\n• Integrated Moodle API with Laravel\n• Designed and implemented a web platform connecting courses, tutors, and students\n• Performed troubleshooting for networks, computers, and other devices");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data } = await supabase.from("portfolio_about").select("*").single();
    if (data) {
      setProfile(data);
      setName(data.name);
      setTitle(data.title);
      setBio(data.bio);
      setSkills(data.skills?.join(", ") || "");
      setResumeUrl(data.resume_url || "");
      setAvatarUrl(data.avatar_url || "");
      const links = data.social_links as Record<string, string> | null;
      setLinkedinUrl(links?.linkedin || "https://www.linkedin.com/in/muhammad-wyzer/");
      setGitlabUrl(links?.gitlab || "https://gitlab.com/mwyzer");
      setGithubUrl(links?.github || "https://github.com/mwyzer");
      setEmail(links?.email || "muhammad.wyzer@gmail.com");
      setPhone(links?.phone || "+62 822 1137 6074");
      setEducation(links?.education || "Syarif Hidayatullah State Islamic University Jakarta – B.Sc. in Informatics Engineering\n2002 – 2011\n\nAl-Mukhlishin Islamic Senior High School, Bogor\n1999 – 2002\n\nAl-Mukhlishin Islamic Junior High School, Bogor\n1996 – 1999\n\nMadrasah Ibtidaiyah Darunnajah, South Jakarta\n1990 – 1996");
      setCertifications(links?.certifications || "");
      setExperience(links?.experience || "");
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
      social_links: { linkedin: linkedinUrl || null, gitlab: gitlabUrl || null, github: githubUrl || null, email: email || null, phone: phone || null, education: education || null, certifications: certifications || null, experience: experience || null },
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

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
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
                <Input id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://gitlab.com/uploads/-/system/user/avatar/6791914/avatar.png?width=800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume">Resume URL</Label>
                <Input id="resume" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://..." />
              </div>
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="education">Formal Education</Label>
              <Textarea id="education" value={education} onChange={(e) => setEducation(e.target.value)} rows={8} placeholder="Syarif Hidayatullah State Islamic University Jakarta – B.Sc. in Informatics Engineering
2002 – 2011

Al-Mukhlishin Islamic Senior High School, Bogor
1999 – 2002" />
              <p className="text-xs text-muted-foreground">Enter each entry separated by blank lines. Format: Institution – Degree (optional), then Year on next line.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications & Training</Label>
              <Textarea id="certifications" value={certifications} onChange={(e) => setCertifications(e.target.value)} rows={6} placeholder="2007	Internship at PT. Krakatau Steel, Cilegon, Banten.
2025	Training of Trainer ..." />
              <p className="text-xs text-muted-foreground">Format: Year, Tab, then description. Separate entries with blank lines.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Work Experience</Label>
              <Textarea id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} rows={12} placeholder="September 2025 – Now
Mentor – Tujuh Belas Agustus 1945 University, North Jakarta
• Provided mentoring in Programming Fundamentals" />
              <p className="text-xs text-muted-foreground">Separate entries with blank lines. Format: Period on line 1, Role – Company on line 2, then bullet points.</p>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
