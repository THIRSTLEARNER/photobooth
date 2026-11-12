import { CameraIcon } from './icons.jsx';

export function Hero() {
  return (
    <section className="hero glass" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">3–6 shots · per-shot looks · your format</p>
        <h1 id="hero-title">
          Step into the <span className="grad">glass photobooth</span>.
        </h1>
        <p className="lede">
          Pick a filter and a face prop for each pose, set a countdown or go hands-free, and capture
          a session your way. Switch your look between shots, choose a strip or grid layout, then
          save the keepsake to your gallery or download it in your preferred format.
        </p>
        <ol className="hero-steps">
          <li>
            <div className="hero-step-body">
              <strong>Style each shot</strong>
              <p>Change filters and props between every pose.</p>
            </div>
          </li>
          <li>
            <div className="hero-step-body">
              <strong>Capture your session</strong>
              <p>Choose 3, 4, or 6 shots with an optional countdown.</p>
            </div>
          </li>
          <li>
            <div className="hero-step-body">
              <strong>Pick a format</strong>
              <p>Classic strip, 2×2 grid, or wide row in PNG, JPEG, or WEBP.</p>
            </div>
          </li>
        </ol>
        <div className="hero-actions">
          <a className="btn" href="#booth">
            <CameraIcon /> Start the photobooth
          </a>
          <span className="hero-meta">Camera stays on your device</span>
        </div>
      </div>

      <div className="hero-art" aria-hidden="true">
        <div className="strip-preview">
          {[0, 1, 2, 3].map((i) => (
            <div className={`mini mini-${i + 1}`} key={i}>
              <span className="mini-sun" />
            </div>
          ))}
          <p className="mini-caption">
            SNAPBOOTH<small>Every pose · one story</small>
          </p>
        </div>
        <span className="floating-tag tag-a">Your timer</span>
        <span className="floating-tag tag-b">Your format</span>
      </div>
    </section>
  );
}
