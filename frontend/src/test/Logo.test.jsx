import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Logo from "../components/Logo.jsx";

describe("Logo", () => {
  it("renders the wordmark", () => {
    render(<Logo />);
    expect(screen.getByText("Kno U")).toBeInTheDocument();
    expect(screen.getByText("Kno")).toBeInTheDocument();
  });

  it("applies the small modifier class when requested", () => {
    const { container } = render(<Logo small />);
    expect(container.querySelector(".logo-sm")).toBeInTheDocument();
  });
});
