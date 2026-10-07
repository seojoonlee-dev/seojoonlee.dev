import { Link } from "react-router";

type HeaderProps = {
  back?: { visible: boolean; onClick: () => void };
  home?: boolean;
};

export default function Header({ back, home }: HeaderProps) {
  const Name = home ? "h1" : "span";
  return (
    <header className="site-header">
      <Link to="/" className="site-name">
        <Name className="site-name-title">Seojoon Lee</Name>
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
        <Link to="/profile">Profile</Link>
        <Link to="/resume">Resume</Link>
      </nav>
    </header>
  );
}
