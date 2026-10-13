import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WyzerProduct from "@/components/wyzer-product";

// Reduced motion throughout: this component's own content (headings, links,
// card copy) is what these tests check, not AnimateOnScroll's animation
// behavior (covered separately in animate-on-scroll.test.tsx).
beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: true,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
});

describe("WyzerProduct", () => {
  it("renders the section with the #product anchor id", () => {
    const { container } = render(<WyzerProduct />);
    expect(container.querySelector("section#product")).toBeInTheDocument();
  });

  it("renders the headline", () => {
    render(<WyzerProduct />);
    expect(
      screen.getByRole("heading", { name: /your back office, run by ai agents/i })
    ).toBeInTheDocument();
  });

  it("points \"Book a demo\" at the contact mailbox with the right subject", () => {
    render(<WyzerProduct />);
    const link = screen.getByRole("link", { name: /book a demo/i });
    expect(link).toHaveAttribute(
      "href",
      "mailto:contact@wyzer.my.id?subject=Wyzer%20demo"
    );
  });

  it("links \"See what we've built\" to the projects section", () => {
    render(<WyzerProduct />);
    const link = screen.getByRole("link", { name: /see what we've built/i });
    expect(link).toHaveAttribute("href", "/#projects");
  });

  it("renders all three agent cards", () => {
    render(<WyzerProduct />);
    expect(screen.getByText("Document Review Agent")).toBeInTheDocument();
    expect(screen.getByText("Helpdesk & HR Agent")).toBeInTheDocument();
    expect(screen.getByText("Knowledge Agent")).toBeInTheDocument();
  });

  it("renders all three proof-of-work items", () => {
    render(<WyzerProduct />);
    expect(screen.getByText("DEMS")).toBeInTheDocument();
    expect(screen.getByText("Portal Helpdesk")).toBeInTheDocument();
    expect(screen.getByText("AI Employee")).toBeInTheDocument();
  });

  it("mentions Claude as the model powering the agents", () => {
    render(<WyzerProduct />);
    expect(
      screen.getByRole("heading", { name: /built on claude/i })
    ).toBeInTheDocument();
  });

  it("credits the founder", () => {
    render(<WyzerProduct />);
    expect(screen.getByText(/founded by muhammad wyzer/i)).toBeInTheDocument();
  });
});
