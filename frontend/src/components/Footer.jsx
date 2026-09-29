import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Logo height={34} />
          <p>
            Know you know. The questions come from us - the answers come from you, and they are
            kept so you can use them later.
          </p>
        </div>
        <div>
          <h4>Pages</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/price">Price</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>The path</h4>
          <ul>
            <li>Law</li>
            <li>Location</li>
            <li>Hiring</li>
            <li>People</li>
          </ul>
        </div>
        <div>
          <h4>Plans</h4>
          <ul>
            <li>Free - 5 questions, 3 days, $0</li>
            <li>Member - 50 / month, $39</li>
            <li>Pro - 75 / year, $436</li>
            <li>Bonus - 100 extra, $100</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} KnoUKno.online. All rights reserved.</span>
        <a href="mailto:hello@knoukno.online">hello@knoukno.online</a>
      </div>
    </footer>
  );
}
