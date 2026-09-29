import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>
            Know you know. The questions come from us - the answers come from you, and they are
            kept so you can use them later.
          </p>
          <span className="footer-domain">knoukno.online</span>
        </div>
        <div>
          <h4>Pages</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
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
            <li>
              <a href="/#law">Law</a>
            </li>
            <li>
              <a href="/#location">Location</a>
            </li>
            <li>
              <a href="/#hiring">Hiring</a>
            </li>
            <li>
              <a href="/#people">People</a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Plans</h4>
          <ul>
            <li>Free - 5 questions, 3 days, $0</li>
            <li>Members - 50 questions, $39</li>
            <li>Pro - 75 questions, $436</li>
            <li className="accent-item">Bonus - 100 extra questions, $100</li>
          </ul>
          <Link to="/price" className="btn btn-primary btn-block" style={{ marginTop: 16 }}>
            Buy Now
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Kno U Kno. All rights reserved.</span>
        <a href="mailto:knoukno006@gmail.com">knoukno006@gmail.com</a>
      </div>
    </footer>
  );
}
