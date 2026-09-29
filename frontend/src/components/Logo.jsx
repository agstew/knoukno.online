import logo from "../assets/logo.svg";

export default function Logo({ height = 40 }) {
  return <img src={logo} alt="KnoUKno" className="logo-img" style={{ height }} />;
}
