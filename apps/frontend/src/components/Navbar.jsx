import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        my-app
      </Link>
      <div className="navbar-links">
        <Link to="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
          Posts
        </Link>
        <Link
          to="/add"
          className={`nav-link ${pathname === "/add" ? "active" : ""}`}
        >
          + New Post
        </Link>
      </div>
    </nav>
  );
}
