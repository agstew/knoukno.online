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
  forgotPassword: (email) => request("/auth/forgot-password", { method: "POST", body: { email } }),
  resetPassword: (payload) => request("/auth/reset-password", { method: "POST", body: payload }),

  submitContact: (payload) => request("/contact", { method: "POST", body: payload }),
  submitHiring: (payload) => request("/hiring", { method: "POST", body: payload }),

  listTitles: (token) => request("/titles", { token }),
  createTitle: (token, payload) => request("/titles", { method: "POST", body: payload, token }),
  getTitle: (token, id) => request(`/titles/${id}`, { token }),
  deleteTitle: (token, id) => request(`/titles/${id}`, { method: "DELETE", token }),

  listQuestions: (token, businessId, stage) =>
    request(`/questions?businessId=${businessId}&stage=${stage}`, { token }),
  nextQuestion: (token, businessId, stage) =>
    request("/questions/next", { method: "POST", body: { businessId, stage }, token }),

  listAnswers: (token, businessId) => request(`/answers?businessId=${businessId}`, { token }),
  saveAnswer: (token, questionId, text) =>
    request("/answers", { method: "POST", body: { questionId, text }, token }),

  listGrades: (token, businessId) => request(`/grades?businessId=${businessId}`, { token }),
  saveGrade: (token, answerId, grade) =>
    request("/grades", { method: "POST", body: { answerId, grade }, token }),

  listRates: (token, businessId) => request(`/rates?businessId=${businessId}`, { token }),
  saveRate: (token, answerId, rate) =>
    request("/rates", { method: "POST", body: { answerId, rate }, token }),

  getAverage: (token, businessId) => request(`/averages?businessId=${businessId}`, { token }),

  getDashboard: (token) => request("/dashboard", { token }),

  plans: () => request("/plans"),

  createBonusOrder: (token) => request("/billing/paypal/bonus-order", { method: "POST", token }),
  captureBonusOrder: (token, orderId) =>
    request(`/billing/paypal/bonus-order/${orderId}/capture`, { method: "POST", token }),
  confirmSubscription: (token, plan, subscriptionID) =>
    request("/billing/paypal/subscriptions/confirm", { method: "POST", body: { plan, subscriptionID }, token }),
  cancelSubscription: (token) => request("/billing/paypal/subscriptions/cancel", { method: "POST", token }),
  getPaymentSchedule: (token) => request("/billing/paypal/schedule", { token }),

  adminListUsers: (token) => request("/admin/users", { token }),
  adminUpdateUserRole: (token, id, role) =>
    request(`/admin/users/${id}/role`, { method: "PATCH", body: { role }, token }),
  adminDeleteUser: (token, id) => request(`/admin/users/${id}`, { method: "DELETE", token }),
  adminStats: (token) => request("/admin/stats", { token }),
  adminSendBroadcast: (token, subject, message) =>
    request("/admin/broadcast", { method: "POST", body: { subject, message }, token }),
};
