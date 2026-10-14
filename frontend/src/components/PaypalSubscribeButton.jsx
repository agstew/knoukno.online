import { useEffect, useRef, useState } from "react";
import { loadPaypalScript } from "../paypal.js";

// Renders a real PayPal subscription button for a recurring plan (Member/Pro).
export default function PaypalSubscribeButton({ planId, onApprove, onError }) {
  const containerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let buttons;
    let cancelled = false;

    loadPaypalScript({ intent: "subscription", vault: true, namespace: "paypalSubscriptions" })
      .then((paypalSubscriptions) => {
        if (cancelled || !containerRef.current) return;
        buttons = paypalSubscriptions.Buttons({
          style: { label: "subscribe" },
          createSubscription: (_data, actions) => actions.subscription.create({ plan_id: planId }),
          onApprove: (data) => onApprove(data.subscriptionID),
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
  }, [planId, onApprove, onError]);

  return (
    <div>
      <div ref={containerRef} />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
