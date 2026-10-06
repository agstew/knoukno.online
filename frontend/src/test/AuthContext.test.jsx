import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "../AuthContext.jsx";

vi.mock("../api.js", () => ({
  api: { me: vi.fn() },
}));

import { api } from "../api.js";

function Consumer() {
  const { user, token, loading, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="token">{token || "none"}</span>
      <span data-testid="user">{user ? user.name : "none"}</span>
      <button onClick={() => login("new-token", { name: "Logged In" })}>do-login</button>
      <button onClick={logout}>do-logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("starts with no user and stops loading when there is no stored token", async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("false"));
    expect(screen.getByTestId("token").textContent).toBe("none");
  });

  it("fetches the current user when a token is already stored", async () => {
    localStorage.setItem("knoukno_token", "stored-token");
    api.me.mockResolvedValue({ user: { name: "Stored User" } });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("Stored User"));
    expect(api.me).toHaveBeenCalledWith("stored-token");
  });

  it("clears the token when the stored token is invalid", async () => {
    localStorage.setItem("knoukno_token", "bad-token");
    api.me.mockRejectedValue(new Error("Invalid or expired token"));

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId("token").textContent).toBe("none"));
    expect(localStorage.getItem("knoukno_token")).toBeNull();
  });

  it("login() stores the token and user, logout() clears them", async () => {
    const user = userEvent.setup();
    // The token-change effect re-fetches /me, so it must resolve with the matching user.
    api.me.mockResolvedValue({ user: { name: "Logged In" } });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("false"));

    await user.click(screen.getByText("do-login"));
    await waitFor(() => expect(screen.getByTestId("token").textContent).toBe("new-token"));
    expect(screen.getByTestId("user").textContent).toBe("Logged In");
    expect(localStorage.getItem("knoukno_token")).toBe("new-token");

    await user.click(screen.getByText("do-logout"));
    expect(screen.getByTestId("token").textContent).toBe("none");
    expect(localStorage.getItem("knoukno_token")).toBeNull();
  });
});
