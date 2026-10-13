import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AnimateOnScroll from "@/components/animate-on-scroll";

// AnimateOnScroll always renders its children synchronously — GSAP only
// ever adds a starting transform/opacity via a *subsequent* effect, it
// never withholds the DOM content itself. That's the contract these tests
// check: the wrapper element, its tag/className, and child content are
// always present, regardless of motion preference or props passed.
function mockMatchMedia(reducedMotion: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reducedMotion,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("AnimateOnScroll", () => {
  beforeEach(() => {
    // Reduced motion by default: skips the GSAP import entirely, keeping
    // most tests fast and independent of the animation library's internals.
    mockMatchMedia(true);
  });

  it("renders children", () => {
    render(
      <AnimateOnScroll>
        <p>Hello</p>
      </AnimateOnScroll>
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders a div wrapper by default", () => {
    const { container } = render(
      <AnimateOnScroll>
        <span>content</span>
      </AnimateOnScroll>
    );
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("renders a custom wrapper tag via the as prop", () => {
    const { container } = render(
      <AnimateOnScroll as="ul">
        <li>item</li>
      </AnimateOnScroll>
    );
    expect(container.firstElementChild?.tagName).toBe("UL");
  });

  it("applies the given className to the wrapper", () => {
    const { container } = render(
      <AnimateOnScroll className="mt-6 grid gap-4">
        <div>card</div>
      </AnimateOnScroll>
    );
    expect(container.firstElementChild).toHaveClass("mt-6", "grid", "gap-4");
  });

  it("renders multiple staggered children without dropping any", () => {
    render(
      <AnimateOnScroll stagger={0.08}>
        <div>one</div>
        <div>two</div>
        <div>three</div>
      </AnimateOnScroll>
    );
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
    expect(screen.getByText("three")).toBeInTheDocument();
  });

  it("accepts an xPattern array without throwing", () => {
    render(
      <AnimateOnScroll xPattern={[-40, 0, 40]} staggerSelector=".card">
        <div className="card">left</div>
        <div className="card">center</div>
        <div className="card">right</div>
      </AnimateOnScroll>
    );
    expect(screen.getByText("left")).toBeInTheDocument();
    expect(screen.getByText("right")).toBeInTheDocument();
  });

  it("still renders when motion is allowed and the GSAP path is taken", () => {
    mockMatchMedia(false);
    render(
      <AnimateOnScroll immediate>
        <p>animated</p>
      </AnimateOnScroll>
    );
    // immediate avoids pulling in ScrollTrigger; content must be in the DOM
    // right away regardless of whether the async gsap import has settled.
    expect(screen.getByText("animated")).toBeInTheDocument();
  });
});
