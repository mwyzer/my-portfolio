"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import type { PortfolioProject, CaseStudy } from "@/types/database";

const EMPTY_CAPABILITIES = {
  fullStackEngineering: "",
  backendData: "",
  aiEngineering: "",
  deliveryQuality: "",
};

export default function DashboardPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [editing, setEditing] = useState<PortfolioProject | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [category, setCategory] = useState<"" | "personal" | "work" | "freelance">("");
  const [featured, setFeatured] = useState(false);

  // Case study
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [architecture, setArchitecture] = useState("");
  const [capabilities, setCapabilities] = useState(EMPTY_CAPABILITIES);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data } = await supabase
      .from("portfolio_projects")
      .select("*")
      .order("order", { ascending: true });
    if (data) setProjects(data);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTechnologies("");
    setLiveUrl("");
    setGithubUrl("");
    setYoutubeUrl("");
    setCategory("");
    setFeatured(false);
    setProblem("");
    setSolution("");
    setArchitecture("");
    setCapabilities(EMPTY_CAPABILITIES);
    setEditing(null);
  };

  const openEdit = (project: PortfolioProject) => {
    setTitle(project.title);
    setDescription(project.description);
    setTechnologies(project.technologies?.join(", ") || "");
    setLiveUrl(project.live_url || "");
    setGithubUrl(project.github_url || "");
    setYoutubeUrl(project.youtube_url || "");
    setCategory(project.category || "");
    setFeatured(project.featured);

    const cs = project.case_study as CaseStudy | null;
    setProblem(cs?.problem || "");
    setSolution(cs?.solution || "");
    setArchitecture(cs?.architecture || "");
    setCapabilities({
      fullStackEngineering: cs?.capabilities?.fullStackEngineering?.join(", ") || "",
      backendData: cs?.capabilities?.backendData?.join(", ") || "",
      aiEngineering: cs?.capabilities?.aiEngineering?.join(", ") || "",
      deliveryQuality: cs?.capabilities?.deliveryQuality?.join(", ") || "",
    });

    setEditing(project);
    setShowForm(true);
  };

  const splitList = (s: string) => s.split(",").map((v) => v.trim()).filter(Boolean);

  // case_study is only saved when at least one of Problem/Solution/Architecture
  // is filled in — otherwise the "View Case Study" link stays hidden on the site.
  const buildCaseStudy = (): CaseStudy | null => {
    if (!problem.trim() && !solution.trim() && !architecture.trim()) return null;
    return {
      problem: problem.trim(),
      solution: solution.trim(),
      architecture: architecture.trim(),
      capabilities: {
        fullStackEngineering: splitList(capabilities.fullStackEngineering),
        backendData: splitList(capabilities.backendData),
        aiEngineering: splitList(capabilities.aiEngineering),
        deliveryQuality: splitList(capabilities.deliveryQuality),
      },
    };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const techArray = technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const projectData = {
      title,
      description,
      technologies: techArray,
      live_url: liveUrl || null,
      github_url: githubUrl || null,
      youtube_url: youtubeUrl || null,
      category: category || null,
      featured,
      case_study: buildCaseStudy(),
    };

    if (editing) {
      const { error } = await supabase
        .from("portfolio_projects")
        .update(projectData)
        .eq("id", editing.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Project updated" });
      }
    } else {
      const { error } = await supabase.from("portfolio_projects").insert({
        ...projectData,
        order: projects.length,
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Project created" });
      }
    }

    setLoading(false);
    setShowForm(false);
    resetForm();
    loadProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Project removed" });
      loadProjects();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Edit Project" : "New Project"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech">Technologies (comma-separated)</Label>
                <Input id="tech" value={technologies} onChange={(e) => setTechnologies(e.target.value)} placeholder="React, Node.js, TypeScript" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="live">Live URL</Label>
                  <Input id="live" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input id="github" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube URL</Label>
                  <Input id="youtube" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select id="category" value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
                  <option value="">No category</option>
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="freelance">Freelance</option>
                </Select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded" />
                Featured project
              </label>

              <div className="border-t pt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">Case Study</h3>
                  <p className="text-xs text-muted-foreground">Optional — fill these in to enable a &quot;View Case Study&quot; page for this project.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="problem">Problem</Label>
                  <Textarea id="problem" value={problem} onChange={(e) => setProblem(e.target.value)} rows={3} placeholder="What problem did this project solve?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="solution">Solution</Label>
                  <Textarea id="solution" value={solution} onChange={(e) => setSolution(e.target.value)} rows={3} placeholder="How did you solve it?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="architecture">Architecture Solution (Image URL)</Label>
                  <Input id="architecture" value={architecture} onChange={(e) => setArchitecture(e.target.value)} placeholder="https://... (architecture diagram)" />
                  {architecture.trim() && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={architecture.trim()} alt="Architecture solution preview" className="mt-2 max-h-40 rounded-md border" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Capabilities (comma-separated per category)</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor="cap-fullstack" className="text-xs font-normal text-muted-foreground">Full Stack Engineering</Label>
                      <Input
                        id="cap-fullstack"
                        value={capabilities.fullStackEngineering}
                        onChange={(e) => setCapabilities((c) => ({ ...c, fullStackEngineering: e.target.value }))}
                        placeholder="Next.js, React, TypeScript"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cap-backend" className="text-xs font-normal text-muted-foreground">Backend &amp; Data</Label>
                      <Input
                        id="cap-backend"
                        value={capabilities.backendData}
                        onChange={(e) => setCapabilities((c) => ({ ...c, backendData: e.target.value }))}
                        placeholder="PostgreSQL, REST API, Auth"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cap-ai" className="text-xs font-normal text-muted-foreground">AI Engineering</Label>
                      <Input
                        id="cap-ai"
                        value={capabilities.aiEngineering}
                        onChange={(e) => setCapabilities((c) => ({ ...c, aiEngineering: e.target.value }))}
                        placeholder="RAG, LLM APIs, Embeddings"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cap-delivery" className="text-xs font-normal text-muted-foreground">Delivery &amp; Quality</Label>
                      <Input
                        id="cap-delivery"
                        value={capabilities.deliveryQuality}
                        onChange={(e) => setCapabilities((c) => ({ ...c, deliveryQuality: e.target.value }))}
                        placeholder="Testing, CI/CD, Documentation"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editing ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">{project.title}</h3>
                  {project.featured && (
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">Featured</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{project.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(project)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">No projects yet. Click "Add Project" to get started.</p>
        )}
      </div>
    </div>
  );
}
