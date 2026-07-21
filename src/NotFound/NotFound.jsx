import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <Link to="/home" className="not-found-home-link">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
