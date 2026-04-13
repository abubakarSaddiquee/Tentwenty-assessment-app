import { render, screen } from "@testing-library/react";
import Badge from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders COMPLETED badge with correct text and styles", () => {
    render(<Badge status="COMPLETED" />);
    const badge = screen.getByText("COMPLETED");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-[var(--color-completed-bg)]");
    expect(badge).toHaveClass("text-[var(--color-completed-text)]");
  });

  it("renders INCOMPLETE badge with correct text and styles", () => {
    render(<Badge status="INCOMPLETE" />);
    const badge = screen.getByText("INCOMPLETE");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-[var(--color-incomplete-bg)]");
    expect(badge).toHaveClass("text-[var(--color-incomplete-text)]");
  });

  it("renders MISSING badge with correct text and styles", () => {
    render(<Badge status="MISSING" />);
    const badge = screen.getByText("MISSING");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-[var(--color-missing-bg)]");
    expect(badge).toHaveClass("text-[var(--color-missing-text)]");
  });
});
