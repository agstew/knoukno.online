import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Register from "../pages/Register.jsx";

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
  api: { register: vi.fn() },
}));

import { api } from "../api.js";

describe("Register page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers and navigates to the dashboard on success", async () => {
    const user = userEvent.setup();
    api.register.mockResolvedValue({ token: "tok", user: { name: "A" } });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Name"), "A");
    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Register free" }));

    await waitFor(() => expect(loginMock).toHaveBeenCalledWith("tok", { name: "A" }));
    expect(api.register).toHaveBeenCalledWith({ name: "A", email: "a@b.com", password: "password123" });
    expect(navigateMock).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error message when registration fails", async () => {
    const user = userEvent.setup();
    api.register.mockRejectedValue(new Error("An account with that email already exists"));

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Name"), "A");
    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Register free" }));

    expect(await screen.findByText("An account with that email already exists")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
