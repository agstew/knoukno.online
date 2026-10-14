// Loads the PayPal JS SDK. One-time orders (intent=capture) and subscriptions
// (intent=subscription) can't share a script tag, so each gets its own
// namespace via PayPal's data-namespace option.
const loaded = {};

export function loadPaypalScript({ intent = "capture", vault = false, namespace = "paypal" } = {}) {
  if (loaded[namespace]) return loaded[namespace];

  loaded[namespace] = new Promise((resolve, reject) => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    if (!clientId) {
      reject(new Error("VITE_PAYPAL_CLIENT_ID is not configured"));
      return;
    }

    const params = new URLSearchParams({ "client-id": clientId, currency: "USD", intent });
    if (vault) params.set("vault", "true");

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
    script.setAttribute("data-namespace", namespace);
    script.onload = () => resolve(window[namespace]);
    script.onerror = () => reject(new Error("Failed to load the PayPal SDK"));
    document.body.appendChild(script);
  });

  return loaded[namespace];
}
