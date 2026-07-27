import { http, HttpResponse } from "msw";

export const supabaseHandlers = [
  http.get("https://*.supabase.co/rest/v1/portfolio_about", () => {
    return HttpResponse.json([
      {
        id: "mock-id",
        name: "Test User",
        title: "Software Engineer",
        bio: "A test bio",
        avatar_url: "https://example.com/avatar.jpg",
        skills: ["React", "TypeScript"],
        social_links: {},
      },
    ]);
  }),

  http.get("https://*.supabase.co/rest/v1/portfolio_projects", () => {
    return HttpResponse.json([
      {
        id: "proj-1",
        title: "Test Project",
        description: "A sample project",
        featured: true,
        order: 1,
        technologies: ["React", "Next.js"],
        live_url: "https://example.com",
        github_url: "https://github.com/test/project",
      },
    ]);
  }),

  http.get("https://*.supabase.co/rest/v1/blog_posts", () => {
    return HttpResponse.json([
      {
        id: "post-1",
        title: "Test Post",
        slug: "test-post",
        excerpt: "A test excerpt",
        published: true,
        tags: ["react", "typescript"],
        created_at: "2026-07-01T00:00:00Z",
      },
    ]);
  }),
];
