import { useEffect, useRef, useState } from "react";
import { api } from "../api.js";
import { loadPaypalScript } from "../paypal.js";

// Renders a real PayPal button for the one-time Bonus questions purchase.
export default function PaypalBonusButton({ token, onCapture, onError }) {
  const containerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let buttons;
    let cancelled = false;

    loadPaypalScript({ intent: "capture" })
      .then((paypal) => {
        if (cancelled || !containerRef.current) return;
        buttons = paypal.Buttons({
          style: { label: "pay" },
          createOrder: async () => {
            const data = await api.createBonusOrder(token);
            return data.id;
          },
          onApprove: async (data) => {
            const result = await api.captureBonusOrder(token, data.orderID);
            onCapture(result.user);
          },
          onError: (err) => {
            setError("PayPal checkout failed. Please try again.");
            onError?.(err);
          },
        });
        buttons.render(containerRef.current);
      })
      .catch(() => setError("Unable to load PayPal checkout."));

    return () => {
      cancelled = true;
      buttons?.close?.();
    };
  }, [token, onCapture, onError]);

  return (
    <div>
      <div ref={containerRef} />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
