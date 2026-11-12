import { CameraIcon } from './icons.jsx';

export function Footer() {
  return (
    <footer className="footer glass">
      <p className="footer-brand">
        <CameraIcon /> Snapbooth Glass
      </p>
      <p>Photos stay in your browser until you save a strip.</p>
      <nav aria-label="Footer">
        <a href="#booth">Booth</a>
        <a href="#gallery">Gallery</a>
      </nav>
    </footer>
  );
}
