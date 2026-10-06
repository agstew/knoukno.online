import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const useAuthMock = vi.fn();
vi.mock("../AuthContext.jsx", () => ({
  useAuth: () => useAuthMock(),
}));

describe("ProtectedRoute", () => {
  it("shows a loading state while auth is resolving", () => {
    useAuthMock.mockReturnValue({ token: null, loading: true });
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>secret</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to /login when there is no token", () => {
    useAuthMock.mockReturnValue({ token: null, loading: false });
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <div>secret</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    useAuthMock.mockReturnValue({ token: "abc", loading: false });
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>secret</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("secret")).toBeInTheDocument();
  });
});
