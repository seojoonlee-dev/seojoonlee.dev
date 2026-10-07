import { Link } from "react-router";
import Scene from "./Scene";
import Float from "./Float";
import "../style/not-found.css";

export default function NotFound() {
  return (
    <Scene>
      <title>Page not found · Seojoon Lee</title>

      {/* numeral */}
      <div className="nf-numeral" aria-hidden="true">
        <Float kx={-124} ky={-52} ax={15.2}>
          <span>404</span>
        </Float>
      </div>

      {/* message */}
      <main className="nf-main">
        <Float kx={40} ky={26} ax={8}>
          <div className="nf-text">
            <span className="label">Not found</span>
            <h1 className="nf-title">Nothing here.</h1>
            <p className="nf-body">
              The page you are looking for does not exist, or it moved.
            </p>
            <Link to="/" className="nf-back">
              Back to the projects
            </Link>
          </div>
        </Float>
      </main>
    </Scene>
  );
}
