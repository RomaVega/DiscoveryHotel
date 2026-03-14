import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrimaryButton } from "@/components/common/PrimaryButton";

// next/link renders a plain <a> in test environment
describe("PrimaryButton", () => {
  it("renders children text", () => {
    render(<PrimaryButton href="/rooms">Book Now</PrimaryButton>);
    expect(screen.getByText("Book Now")).toBeInTheDocument();
  });

  it("renders as <a> with correct href for internal links", () => {
    render(<PrimaryButton href="/rooms">Book Now</PrimaryButton>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/rooms");
  });

  it("renders as <a> with target=_blank for external links", () => {
    render(<PrimaryButton href="https://example.com" external>Book Now</PrimaryButton>);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not set target=_blank for internal links", () => {
    render(<PrimaryButton href="/rooms">Book Now</PrimaryButton>);
    expect(screen.getByRole("link")).not.toHaveAttribute("target");
  });

  it("merges custom className", () => {
    render(<PrimaryButton href="/rooms" className="mt-8">Book Now</PrimaryButton>);
    expect(screen.getByRole("link")).toHaveClass("mt-8");
  });

  it("always has base brand-teal styles", () => {
    render(<PrimaryButton href="/rooms">Book Now</PrimaryButton>);
    expect(screen.getByRole("link")).toHaveClass("bg-brand-teal");
  });
});
