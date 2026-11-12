import { FILTERS } from '../compose.js';
import { PROPS } from '../props.js';
import { COUNTDOWN_OPTIONS, SHOT_COUNT_OPTIONS } from '../config.js';
import { CameraIcon, RetakeIcon } from './icons.jsx';

export function ControlsPanel({
  filter,
  setFilter,
  prop,
  setProp,
  activeProp,
  shooting,
  trackingNote,
  trackingLoading,
  ready,
  error,
  requesting,
  start,
  stop,
  run,
  phase,
  shotCount,
  setShotCount,
  countdownSeconds,
  setCountdownSeconds,
  mirrored,
  toggleMirror,
  toggleFacingMode,
  facingMode,
}) {
  const canConfigure = !shooting;
  return (
    <>
      <details className="field field-disclosure" open>
        <summary className="field-summary">
          <h2 id="session">Session</h2>
        </summary>
        <div className="field-content">
          <div className="row" role="group" aria-label="Shot count">
            <span className="chip chip-static" aria-hidden="true">
              Shots
            </span>
            {SHOT_COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                className="chip"
                aria-pressed={shotCount === n}
                onClick={() => canConfigure && setShotCount(n)}
                disabled={!canConfigure}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="row" role="group" aria-label="Countdown seconds">
            <span className="chip chip-static" aria-hidden="true">
              Countdown
            </span>
            {COUNTDOWN_OPTIONS.map((n) => (
              <button
                key={n}
                className="chip"
                aria-pressed={countdownSeconds === n}
                onClick={() => canConfigure && setCountdownSeconds(n)}
                disabled={!canConfigure}
              >
                {n === 0 ? 'Off' : `${n}s`}
              </button>
            ))}
          </div>
        </div>
      </details>

      <details className="field field-disclosure" open>
        <summary className="field-summary">
          <h2 id="camera">Camera</h2>
        </summary>
        <div className="field-content">
          <div className="row" role="group" aria-labelledby="camera">
            <button
              className="chip"
              onClick={toggleFacingMode}
              disabled={requesting}
              aria-pressed={facingMode === 'environment'}
            >
              {facingMode === 'environment' ? 'Rear camera' : 'Front camera'}
            </button>
            <button className="chip" onClick={toggleMirror} aria-pressed={mirrored}>
              Mirror: {mirrored ? 'On' : 'Off'}
            </button>
            {ready ? (
              <button className="chip" onClick={stop}>
                Stop camera
              </button>
            ) : null}
          </div>
        </div>
      </details>

      <details className="field field-disclosure" open>
        <summary className="field-summary">
          <h2 id="filters">Filter</h2>
        </summary>
        <div className="field-content">
          <div className="row" role="group" aria-labelledby="filters">
            {FILTERS.map((f) => (
              <button
                key={`${f.id}-${filter.id === f.id}`}
                className="chip"
                aria-pressed={filter.id === f.id}
                onClick={() => setFilter(f)}
              >
                {f.name}
              </button>
            ))}
          </div>
          {shooting && (
            <p className="field-note">
              Switch filters between shots for a different look each time.
            </p>
          )}
        </div>
      </details>

      <details className="field field-disclosure" open>
        <summary className="field-summary">
          <h2 id="props">Face props</h2>
        </summary>
        <div className="field-content">
          <div className="row" role="group" aria-labelledby="props">
            {PROPS.map((p) => (
              <button
                key={`${p.id}-${prop.id === p.id}`}
                className="chip"
                aria-pressed={prop.id === p.id}
                onClick={() => setProp(p)}
              >
                {p.name}
              </button>
            ))}
          </div>
          {shooting ? (
            <p className="field-note">
              Swap props between shots too — each photo keeps what you picked.
            </p>
          ) : trackingNote ? (
            <p className="field-note">{trackingNote}</p>
          ) : null}
          {activeProp.id === 'dog' && (
            <p className="field-note">
              Tap the dog in the preview to stick its tongue out or pull it back in. Taps are baked
              into your photos.
            </p>
          )}
        </div>
      </details>

      {error ? (
        <button className="btn" onClick={() => start()} disabled={requesting}>
          <RetakeIcon /> Try the camera again
        </button>
      ) : ready ? (
        <button className="btn" onClick={run} disabled={shooting || trackingLoading}>
          <CameraIcon />
          {trackingLoading
            ? 'Loading face filter…'
            : shooting
              ? 'Hold still…'
              : phase === 'done'
                ? 'Shoot a new session'
                : 'Start photobooth'}
        </button>
      ) : null}
    </>
  );
}
