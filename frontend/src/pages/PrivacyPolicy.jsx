export default function PrivacyPolicy() {
  return (
    <div>
      <section className="hero hero-light">
        <h1>Privacy Policy</h1>
        <p>Last updated: October 20, 2026</p>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <p>
            Kno U Kno ("we", "us") operates knoukno.online. This page explains what information we
            collect, why, and who we share it with. For how we use cookies and local browser
            storage specifically, see our <a href="/cookies">Cookie Policy</a>.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Account information:</strong> your name, email address, and password. Passwords
              are hashed (bcrypt) before storage - we never store or have access to your plain-text
              password.
            </li>
            <li>
              <strong>Business planning content:</strong> the business title, industry, and location you
              enter, the answers you write, and the grades/ratings you give yourself. This is the core
              content of the product and is stored so you can return to it.
            </li>
            <li>
              <strong>Contact and careers messages:</strong> if you submit the Contact or Careers form, we
              send your name, email, and message directly to our inbox as an email. These submissions are
              not stored in our database.
            </li>
            <li>
              <strong>Payment information:</strong> subscriptions and one-time purchases are processed
              entirely by PayPal. We only store your plan tier and PayPal subscription ID - we never
              see or store your card or bank account details.
            </li>
          </ul>

          <h2>How we use it</h2>
          <ul>
            <li>To provide the product: save your answers, compute grades/ratings/averages, and enforce
              your plan's question quota.</li>
            <li>To send transactional email (welcome email, password reset, subscription/billing
              notices) via our email provider, Resend.</li>
            <li>To respond to messages you send us through the Contact or Careers pages.</li>
          </ul>

          <h2>Who we share it with</h2>
          <p>We don't sell your data. We use the following services to run the product, each of which
            processes data on our behalf:</p>
          <ul>
            <li><strong>MongoDB Atlas</strong> - database hosting for account and business-planning data.</li>
            <li><strong>Railway</strong> - application hosting.</li>
            <li><strong>PayPal</strong> - payment processing for subscriptions and one-time purchases.</li>
            <li><strong>Resend</strong> - delivery of transactional email.</li>
          </ul>

          <h2>Data retention</h2>
          <p>
            We keep your account and business-planning data while your account is active. You can
            request deletion of your account and associated data at any time by emailing
            {" "}<a href="mailto:hello@knoukno.online">hello@knoukno.online</a>.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask us to access, correct, or delete your personal data at any time by emailing
            {" "}<a href="mailto:hello@knoukno.online">hello@knoukno.online</a>.
          </p>

          <h2>Children</h2>
          <p>KnoUKno is not directed at, and we do not knowingly collect data from, children under 13.</p>

          <h2>Changes to this policy</h2>
          <p>If this policy changes, we'll update the date at the top of this page.</p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Email {" "}
            <a href="mailto:hello@knoukno.online">hello@knoukno.online</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
