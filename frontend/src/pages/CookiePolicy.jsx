export default function CookiePolicy() {
  return (
    <div>
      <section className="hero hero-light">
        <h1>Cookie Policy</h1>
        <p>Last updated: October 20, 2026</p>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2>We don't use tracking cookies</h2>
          <p>
            KnoUKno does not use advertising or analytics cookies, and we don't track you across
            other sites.
          </p>

          <h2>How login works (no cookie involved)</h2>
          <p>
            When you log in, we keep you signed in using your browser's <strong>local storage</strong>
            {" "}(a security token saved on your device), not a cookie. It's sent to our server only when
            your browser talks to our API, and it's removed automatically when you log out or clear
            your browser's site data.
          </p>

          <h2>Third-party cookies: PayPal</h2>
          <p>
            Our Price and payment pages load PayPal's own checkout script so you can subscribe or pay.
            PayPal may set its own cookies in your browser at that point, for fraud prevention and to
            process your payment or subscription. Those cookies are controlled by PayPal, not us, and
            are covered by PayPal's own privacy and cookie policies, not this one.
          </p>

          <h2>Changes</h2>
          <p>
            If we ever add analytics or other cookies in the future, we'll update this page first.
          </p>

          <h2>Questions</h2>
          <p>
            Email <a href="mailto:hello@knoukno.online">hello@knoukno.online</a>. See also our{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
