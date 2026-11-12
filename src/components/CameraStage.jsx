import { CameraIcon } from './icons.jsx';

export function CameraStage({
  videoRef,
  ready,
  error,
  requesting,
  checking,
  start,
  filter,
  activeProp,
  propLayerRef,
  dogTongue,
  toggleDogTongue,
  shooting,
  count,
  flash,
  shots,
  shotCount,
  activeIndex,
  mirrored = true,
  onRetakeShot,
  onCancel,
}) {
  return (
    <>
      <div className={`stage${!ready && !error ? ' stage-gate' : ''}`}>
        <video
          ref={videoRef}
          playsInline
          muted
          aria-label="Live camera preview"
          style={{ filter: filter.css, transform: mirrored ? 'scaleX(-1)' : 'none' }}
        />
        {ready && activeProp.url && (
          <img
            key={activeProp.id}
            ref={propLayerRef}
            className={`prop-layer${activeProp.id === 'dog' ? ' prop-layer-tap' : ''}`}
            src={activeProp.url}
            alt={activeProp.id === 'dog' ? 'Dog filter' : ''}
            {...(activeProp.id === 'dog'
              ? {
                  role: 'button',
                  tabIndex: 0,
                  'aria-pressed': dogTongue,
                  'aria-label': dogTongue
                    ? 'Dog filter — tap to pull the tongue back in'
                    : 'Dog filter — tap to stick the tongue out',
                  onClick: toggleDogTongue,
                  onKeyDown: (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      toggleDogTongue();
                    }
                  },
                }
              : { 'aria-hidden': 'true' })}
          />
        )}
        {!ready && !error && (
          <div className="overlay permission">
            {checking || requesting ? (
              <>
                <span className="spinner" aria-hidden="true" />
                <p role="status">
                  {requesting ? 'Waiting for camera permission…' : 'Checking camera…'}
                </p>
                {requesting && <small>Choose “Allow” in your browser’s prompt.</small>}
              </>
            ) : (
              <>
                <span className="permission-icon" aria-hidden="true">
                  <CameraIcon />
                </span>
                <h2>Camera access needed</h2>
                <p>
                  Snapbooth uses your camera for the live preview and photos. Nothing is uploaded
                  until you save to the gallery.
                </p>
                <button className="btn" onClick={() => start()}>
                  <CameraIcon /> Allow camera
                </button>
              </>
            )}
          </div>
        )}
        {error && (
          <div className="overlay">
            <p className="notice" role="alert">
              {error}
            </p>
          </div>
        )}
        {shooting && count > 0 && (
          <div className="count-badge" aria-hidden="true">
            <span className="count" key={count}>
              {count}
            </span>
          </div>
        )}
        {shooting && (
          <span className="pill">
            Photo{' '}
            {Math.min(
              (activeIndex >= 0 ? activeIndex : shots.filter(Boolean).length) + 1,
              shotCount
            )}{' '}
            of {shotCount} · change your look
          </span>
        )}
        {shooting && (
          <button className="btn quiet stage-cancel" onClick={onCancel} type="button">
            Cancel
          </button>
        )}
        {flash > 0 && <div className="flash" key={flash} />}
        <span className="sr" aria-live="polite" aria-atomic="true">
          {shooting && count > 0 ? `Countdown ${count}` : ''}
        </span>
      </div>

      <div className="thumbs" aria-label="Captured shots">
        {Array.from({ length: shotCount }, (_, i) => {
          const src = shots[i];
          const canRetake = !shooting && !!src && typeof onRetakeShot === 'function';
          const content = src ? (
            <img src={src} alt="" className="thumb-shot" />
          ) : (
            <span className="thumb-empty">{i + 1}</span>
          );
          return (
            <div key={i} className={activeIndex === i ? 'thumb-active' : ''}>
              {canRetake ? (
                <button
                  type="button"
                  className="thumb-btn"
                  onClick={() => onRetakeShot(i)}
                  aria-label={`Retake photo ${i + 1}`}
                  title="Retake this photo"
                >
                  {content}
                </button>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
