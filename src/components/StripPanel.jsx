import { FRAMES, LAYOUTS } from '../compose.js';
import { OUTPUT_FORMAT_OPTIONS } from '../config.js';
import { CameraIcon, DownloadIcon, RetakeIcon, SaveIcon } from './icons.jsx';

export function StripPanel({
  strip,
  hasShots,
  layout,
  setLayout,
  frame,
  setFrame,
  outputFormat,
  setOutputFormat,
  outputQuality,
  setOutputQuality,
  save,
  download,
  share,
  retake,
  status,
  shooting,
}) {
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <section className="glass slot" aria-label="Photo strip">
      {strip ? (
        <>
          <img className="strip" src={strip} alt="Your photo strip" />
          <div className="field">
            <h2 id="layouts">Format</h2>
            <div className="row" role="group" aria-labelledby="layouts">
              {LAYOUTS.map((l) => (
                <button
                  key={l.id}
                  className="chip"
                  aria-pressed={layout.id === l.id}
                  onClick={() => setLayout(l)}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <h2 id="frames">Frame</h2>
            <div className="row" role="group" aria-labelledby="frames">
              {FRAMES.map((f) => (
                <button
                  key={f.id}
                  className="chip"
                  aria-pressed={frame.id === f.id}
                  onClick={() => setFrame(f)}
                >
                  <span
                    className="swatch"
                    style={{ background: `linear-gradient(135deg, ${f.from}, ${f.to})` }}
                  />
                  {f.name}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <h2 id="output">Output</h2>
            <div className="row" role="group" aria-labelledby="output">
              {OUTPUT_FORMAT_OPTIONS.map((fmt) => (
                <button
                  key={fmt}
                  className="chip"
                  aria-pressed={outputFormat === fmt}
                  onClick={() => setOutputFormat(fmt)}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
            {outputFormat !== 'png' && (
              <label className="quality-control">
                <span className="quality-label">
                  Quality <strong>{Math.round(outputQuality * 100)}%</strong>
                </span>
                <input
                  className="quality-range"
                  type="range"
                  min="0.4"
                  max="1"
                  step="0.05"
                  value={outputQuality}
                  onChange={(e) => setOutputQuality(Number(e.target.value))}
                  aria-label="Output quality"
                />
              </label>
            )}
          </div>
          <div className="row">
            <button className="btn" onClick={save}>
              <SaveIcon /> Save to gallery
            </button>
            <button className="btn quiet" onClick={download}>
              <DownloadIcon /> Download
            </button>
            {canShare && (
              <button className="btn quiet" onClick={share}>
                Share
              </button>
            )}
            <button className="btn quiet" onClick={retake}>
              <RetakeIcon /> Retake all
            </button>
          </div>
          {status && (
            <p className="status" key={status} role="status">
              {status}
            </p>
          )}
        </>
      ) : (
        <div className="empty">
          <CameraIcon />
          <h2>
            {shooting
              ? 'Capturing your photos…'
              : hasShots
                ? 'Keep going'
                : 'Your strip appears here'}
          </h2>
          <p>
            {shooting
              ? 'Pose for each shot. You can retake individual photos after.'
              : hasShots
                ? 'Complete or retake shots to finish your strip.'
                : 'Pick your settings and press Start photobooth.'}
          </p>
        </div>
      )}
    </section>
  );
}
