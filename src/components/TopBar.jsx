import { CameraIcon } from './icons.jsx';

export function TopBar() {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Snapbooth home">
        <span className="brand-mark" aria-hidden="true">
          <CameraIcon />
        </span>
        <span className="brand-name">Snapbooth</span>
      </a>
      <nav className="topnav" aria-label="Primary">
        <a href="#booth">The booth</a>
        <a href="#gallery">Gallery</a>
      </nav>
    </header>
  );
}
