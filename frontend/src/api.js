const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/auth/me", { token }),

  listBusinesses: (token) => request("/businesses", { token }),
  createBusiness: (token, title) => request("/businesses", { method: "POST", body: { title }, token }),
  getBusiness: (token, id) => request(`/businesses/${id}`, { token }),

  listQuestions: (token, businessId, stage) =>
    request(`/questions?businessId=${businessId}&stage=${stage}`, { token }),
  nextQuestion: (token, businessId, stage) =>
    request("/questions/next", { method: "POST", body: { businessId, stage }, token }),

  listAnswers: (token, businessId) => request(`/answers?businessId=${businessId}`, { token }),
  saveAnswer: (token, questionId, text) =>
    request("/answers", { method: "POST", body: { questionId, text }, token }),
  gradeAnswer: (token, id, grade) => request(`/answers/${id}/grade`, { method: "PATCH", body: { grade }, token }),
  rankAnswer: (token, id, rank) => request(`/answers/${id}/rank`, { method: "PATCH", body: { rank }, token }),

  plans: () => request("/plans"),
};
