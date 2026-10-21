import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const PLAN_LABELS = { free: "Free", member: "Member", pro: "Pro" };

function formatDate(iso) {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function formatAmount(amount) {
  if (!amount) return "\u2014";
  return `${amount.value} ${amount.currency_code}`;
}

export default function PaymentSchedule() {
  const { token, user } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getPaymentSchedule(token);
      setSchedule(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCancel() {
    if (!window.confirm("Cancel your subscription? You'll keep access until the end of the period you already paid for.")) {
      return;
    }
    setCancelling(true);
    setError("");
    try {
      await api.cancelSubscription(token);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  }

  const subscription = schedule?.subscription;

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <span className="section-eyebrow">Payments</span>
          <h1>Payment schedule</h1>
          <p className="muted">Your upcoming billing date and past payment history.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="loading-text">Loading payment schedule...</p>
      ) : !subscription ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          {user?.plan && user.plan !== "free" ? (
            <p>
              <strong>No recurring PayPal subscription on file.</strong> You're on the{" "}
              {PLAN_LABELS[user.plan] || user.plan} plan, but it wasn't set up through a PayPal
              subscription, so there's no billing schedule to show here.
            </p>
          ) : (
            <p>
              <strong>No recurring payments scheduled.</strong> You're on the free plan, or your subscription
              hasn't been set up yet.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="plan-meter" style={{ display: "flex", flexWrap: "wrap", gap: 32, marginBottom: 32 }}>
            <span>
              Plan: <strong>{PLAN_LABELS[subscription.plan] || subscription.plan}</strong>
            </span>
            <span>
              Status: <strong>{subscription.status}</strong>
            </span>
            {subscription.cancelAtPeriodEnd ? (
              <span>
                <strong>Cancelled</strong> {"\u2014"} access continues until the date below
              </span>
            ) : (
              <span>
                Next payment: <strong>{formatDate(subscription.nextBillingTime)}</strong>
              </span>
            )}
            {subscription.lastPaymentAmount && (
              <span>
                Last payment: <strong>{formatAmount(subscription.lastPaymentAmount)}</strong> on{" "}
                <strong>{formatDate(subscription.lastPaymentTime)}</strong>
              </span>
            )}
          </div>

          {!subscription.cancelAtPeriodEnd && (
            <button
              type="button"
              className="btn btn-outline-light"
              style={{ marginTop: -16, marginBottom: 32 }}
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Cancel subscription"}
            </button>
          )}

          <h2 style={{ marginTop: 0 }}>Payment history</h2>
          {schedule.transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🧾</div>
              <p>No payments have been processed yet.</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{formatDate(t.time)}</td>
                      <td>{formatAmount(t.amount)}</td>
                      <td>{t.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
