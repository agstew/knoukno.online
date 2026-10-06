import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "../pages/Login.jsx";

const loginMock = vi.fn();
const navigateMock = vi.fn();

vi.mock("../AuthContext.jsx", () => ({
  useAuth: () => ({ login: loginMock }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("../api.js", () => ({
  api: { login: vi.fn() },
}));

import { api } from "../api.js";

describe("Login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("logs in and navigates to the dashboard on success", async () => {
    const user = userEvent.setup();
    api.login.mockResolvedValue({ token: "tok", user: { name: "A" } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => expect(loginMock).toHaveBeenCalledWith("tok", { name: "A" }));
    expect(api.login).toHaveBeenCalledWith({ email: "a@b.com", password: "password123" });
    expect(navigateMock).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error message and does not navigate on failure", async () => {
    const user = userEvent.setup();
    api.login.mockRejectedValue(new Error("Invalid email or password"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "wrongpass");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
    expect(loginMock).not.toHaveBeenCalled();
  });
});
