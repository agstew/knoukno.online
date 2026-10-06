import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Navbar from "../components/Navbar.jsx";

const useAuthMock = vi.fn();
vi.mock("../AuthContext.jsx", () => ({
  useAuth: () => useAuthMock(),
}));

describe("Navbar", () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it("shows Login and Register links for a guest", () => {
    useAuthMock.mockReturnValue({ user: null, logout: vi.fn() });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByLabelText("Open navigation"));
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
  });

  it("shows Dashboard and Log out for an authenticated user, hides Login", () => {
    useAuthMock.mockReturnValue({ user: { name: "Test" }, logout: vi.fn() });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByLabelText("Open navigation"));
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
  });
});
