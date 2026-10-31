import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExperienceTile } from "@/components/common/ExperienceTile";
import { LanguageProvider } from "@/lib/language-context";
import type { ExperienceCard } from "@/lib/types";

const spa: ExperienceCard = {
  title: { en: "Ayurvedic Spa", ru: "Аюрведический Спа" },
  description: "",
  image: "/images/experiences/experiences-ayurvedic-spa.webp",
  imageAlt: "Ayurvedic Center entrance",
  href: "/spa",
  imagePosition: "78% 50%",
};

describe("ExperienceTile", () => {
  it("sets the title on two lines, each its own block", () => {
    render(<ExperienceTile item={spa} title="Ayurvedic Spa" imageAlt="Ayurvedic Center entrance" />);
    const heading = screen.getByRole("heading", { level: 3 });
    const lines = heading.querySelectorAll("span.block");
    expect([...lines].map((l) => l.textContent)).toEqual(["Ayurvedic", "Spa"]);
  });

  it("keeps a space between the lines so the heading reads as two words", () => {
    render(<ExperienceTile item={spa} title="Ayurvedic Spa" imageAlt="Ayurvedic Center entrance" />);
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("Ayurvedic Spa");
  });

  it("links an internal page through the current locale", () => {
    render(
      <LanguageProvider locale="ru">
        <ExperienceTile item={spa} title="Аюрведический Спа" imageAlt="Вход в Аюрведический центр" />
      </LanguageProvider>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/ru/spa");
  });

  it("opens an external partner in a new tab", () => {
    const tours: ExperienceCard = { ...spa, href: "https://mybalitrips.com/", external: true };
    render(<ExperienceTile item={tours} title="Tours & Activities" imageAlt="Rice terraces" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("uses the strong title shadow unless the content asks for a lighter one", () => {
    const { rerender } = render(<ExperienceTile item={spa} title="Ayurvedic Spa" imageAlt="Ayurvedic Center entrance" />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveClass("text-shadow-strong");
    rerender(<ExperienceTile item={{ ...spa, titleShadow: "light" }} title="Ayurvedic Spa" imageAlt="Ayurvedic Center entrance" />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveClass("text-shadow-halo-light");
    rerender(<ExperienceTile item={{ ...spa, titleShadow: "medium" }} title="Ayurvedic Spa" imageAlt="Ayurvedic Center entrance" />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveClass("text-shadow-halo-medium");
  });

  it("applies the content's focal point to the photo", () => {
    render(<ExperienceTile item={spa} title="Ayurvedic Spa" imageAlt="Ayurvedic Center entrance" />);
    expect(screen.getByAltText("Ayurvedic Center entrance")).toHaveStyle({ objectPosition: "78% 50%" });
  });
});
