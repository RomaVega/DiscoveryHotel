import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeading } from "@/components/common/SectionHeading";

describe("SectionHeading", () => {
  it("renders the heading text", () => {
    render(<SectionHeading heading="Our Rooms" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Our Rooms");
  });

  it("renders label when provided", () => {
    render(<SectionHeading heading="Our Rooms" label="Accommodation" />);
    expect(screen.getByText("Accommodation")).toBeInTheDocument();
  });

  it("does not render label when omitted", () => {
    render(<SectionHeading heading="Our Rooms" />);
    expect(screen.queryByText("Accommodation")).not.toBeInTheDocument();
  });

  it("renders subtext when provided", () => {
    render(<SectionHeading heading="Our Rooms" subtext="Five room categories" />);
    expect(screen.getByText("Five room categories")).toBeInTheDocument();
  });

  it("does not render subtext when omitted", () => {
    const { container } = render(<SectionHeading heading="Our Rooms" />);
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  it("applies text-center class when centered (default)", () => {
    const { container } = render(<SectionHeading heading="Our Rooms" />);
    expect(container.firstChild).toHaveClass("text-center");
  });

  it("does not apply text-center when centered=false", () => {
    const { container } = render(<SectionHeading heading="Our Rooms" centered={false} />);
    expect(container.firstChild).not.toHaveClass("text-center");
  });

  it("applies light heading color when light=true", () => {
    render(<SectionHeading heading="Our Rooms" light />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("text-white");
  });

  it("applies dark heading color by default", () => {
    render(<SectionHeading heading="Our Rooms" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("text-charcoal");
  });
});
