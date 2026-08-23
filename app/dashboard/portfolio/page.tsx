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
import { Plus, Pencil, Trash2, GripVertical, X, Loader2, Eye } from "lucide-react";
import type { PortfolioProject, CaseStudy, EngineeringDecision } from "@/types/database";

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
  const [subtitle, setSubtitle] = useState("");
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
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [highlights, setHighlights] = useState("");
  const [architectureDiagram, setArchitectureDiagram] = useState("");
  const [engineeringDecisions, setEngineeringDecisions] = useState("");
  const [contribution, setContribution] = useState("");
  const [metrics, setMetrics] = useState("");

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
    setSubtitle("");
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
    setImages([]);
    setHighlights("");
    setArchitectureDiagram("");
    setEngineeringDecisions("");
    setContribution("");
    setMetrics("");
    setEditing(null);
  };

  const openEdit = (project: PortfolioProject) => {
    setTitle(project.title);
    setSubtitle(project.subtitle || "");
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
    setImages(cs?.images || []);
    setHighlights(cs?.highlights?.join("\n") || "");
    setArchitectureDiagram(cs?.architectureDiagram || "");
    setEngineeringDecisions(
      cs?.engineeringDecisions?.map((d) => `${d.problem} | ${d.decision} | ${d.reason}`).join("\n") || ""
    );
    setContribution(cs?.contribution?.join("\n") || "");
    setMetrics(cs?.metrics?.join(", ") || "");

    setEditing(project);
    setShowForm(true);
  };

  const splitList = (s: string) => s.split(",").map((v) => v.trim()).filter(Boolean);
  const splitLines = (s: string) => s.split("\n").map((v) => v.trim()).filter(Boolean);
  const parseDecisions = (s: string): EngineeringDecision[] =>
    splitLines(s)
      .map((line) => line.split("|").map((v) => v.trim()))
      .filter((parts) => parts[0])
      .map(([problem, decision, reason]) => ({ problem, decision: decision || "", reason: reason || "" }));

  // case_study is only saved when at least one of Problem/Solution/Architecture
  // is filled in — otherwise the "View Case Study" link stays hidden on the site.
  const buildCaseStudy = (): CaseStudy | null => {
    if (!problem.trim() && !solution.trim() && !architecture.trim() && images.length === 0) return null;
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
      images,
      highlights: splitLines(highlights),
      architectureDiagram: architectureDiagram.trim(),
      engineeringDecisions: parseDecisions(engineeringDecisions),
      contribution: splitLines(contribution),
      metrics: splitList(metrics),
    };
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploadingImages(true);
    const uploaded: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("project-images").upload(path, file);

      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        continue;
      }

      const { data } = supabase.storage.from("project-images").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploadingImages(false);
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url));
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
      subtitle: subtitle.trim() || null,
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
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="DEMS" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Document Eligibility Management System" />
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
                  <Label htmlFor="highlights">What I Built (one per line)</Label>
                  <Textarea
                    id="highlights"
                    value={highlights}
                    onChange={(e) => setHighlights(e.target.value)}
                    rows={4}
                    placeholder={"Document submission workflow\nReviewer approval/revision flow\nRBAC\nAI document classification"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="architecture">Architecture Diagram (Image URL)</Label>
                  <Input id="architecture" value={architecture} onChange={(e) => setArchitecture(e.target.value)} placeholder="https://... (architecture diagram)" />
                  {architecture.trim() && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={architecture.trim()} alt="Architecture solution preview" className="mt-2 max-h-40 rounded-md border" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="architecture-text">Architecture Diagram (Text, optional)</Label>
                  <Textarea
                    id="architecture-text"
                    value={architectureDiagram}
                    onChange={(e) => setArchitectureDiagram(e.target.value)}
                    rows={6}
                    className="font-mono text-xs"
                    placeholder={"Vue / Quasar\n   ↓\nLaravel API\n   ↓\nPostgreSQL + Redis"}
                  />
                  <p className="text-xs text-muted-foreground">Rendered as a monospace block. Use instead of, or alongside, the image above.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="images">Gallery Images</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                  />
                  {uploadingImages && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                    </p>
                  )}
                  {images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {images.map((url, i) => (
                        <div key={`${url}-${i}`} className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Gallery image ${i + 1} preview`} className="h-20 w-20 rounded-md border object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(url)}
                            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                            aria-label="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
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
                <div className="space-y-2">
                  <Label htmlFor="decisions">Engineering Decisions (one per line: Problem | Decision | Reason)</Label>
                  <Textarea
                    id="decisions"
                    value={engineeringDecisions}
                    onChange={(e) => setEngineeringDecisions(e.target.value)}
                    rows={4}
                    className="font-mono text-xs"
                    placeholder={"AI response latency | Streaming | Improve UX\nBackground AI jobs | Celery | Avoid blocking API"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contribution">My Contribution (one per line)</Label>
                  <Textarea
                    id="contribution"
                    value={contribution}
                    onChange={(e) => setContribution(e.target.value)}
                    rows={4}
                    placeholder={"Designed backend architecture\nImplemented RBAC\nBuilt AI ticket categorization"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metrics">Metrics (comma-separated)</Label>
                  <Input
                    id="metrics"
                    value={metrics}
                    onChange={(e) => setMetrics(e.target.value)}
                    placeholder="5 business modules, 20+ API endpoints, 9 automated smoke tests"
                  />
                  <p className="text-xs text-muted-foreground">Only use real numbers — leave blank if you don&apos;t have them.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading || uploadingImages}>
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
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" /> {project.views.toLocaleString()}
                  </span>
                </div>
                {project.subtitle && (
                  <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                )}
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
