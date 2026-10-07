import { Link } from "react-router";

type HeaderProps = {
  back?: { visible: boolean; onClick: () => void };
};

export default function Header({ back }: HeaderProps) {
  return (
    <header className="site-header">
      <Link to="/" className="site-name">
        <span className="site-name-title">Seojoon Lee</span>
        <span className="site-name-role">Software developer</span>
      </Link>
      <nav className="site-nav" aria-label="Site">
        {back && (
          <button
            type="button"
            className={`site-back${back.visible ? " on" : ""}`}
            onClick={back.onClick}
            tabIndex={back.visible ? 0 : -1}
            aria-hidden={!back.visible}
          >
            Back
          </button>
        )}
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}
