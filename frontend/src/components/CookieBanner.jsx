import { useState } from "react";
import { Link } from "react-router-dom";

const ACK_KEY = "knoukno_cookie_ack";

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(ACK_KEY));

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(ACK_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="cookie-banner">
      <p>
        We don't use tracking or analytics cookies. PayPal may set its own cookies on our Price and
        payment pages to process payments. See our <Link to="/cookies">Cookie Policy</Link>.
      </p>
      <button type="button" className="btn btn-primary" onClick={dismiss}>
        OK
      </button>
    </div>
  );
}
