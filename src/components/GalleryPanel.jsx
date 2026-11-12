import { TrashIcon } from './icons.jsx';

export function GalleryPanel({ gallery, remove, hasMore, loadMore }) {
  const onRemove = (name) => {
    if (window.confirm('Delete this strip from your private gallery?')) {
      remove(name);
    }
  };

  return (
    <section className="glass gallery" id="gallery" aria-label="Saved strips">
      <div className="section-head">
        <h2>Gallery</h2>
        <span className="count-pill" aria-live="polite">
          {gallery.length} saved
        </span>
      </div>
      {gallery.length === 0 ? (
        <p className="muted">
          No saved strips yet. Saved strips are kept in your private gallery on this server for this
          browser session.
        </p>
      ) : (
        <>
          <ul>
            {gallery.map((g) => (
              <li key={g.name}>
                <a href={g.url} target="_blank" rel="noreferrer">
                  <img src={g.url} alt="A saved photo strip" loading="lazy" decoding="async" />
                </a>
                <button
                  className="icon-btn"
                  onClick={() => onRemove(g.name)}
                  aria-label="Delete this strip"
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
          {hasMore && (
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn quiet" onClick={loadMore}>
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
