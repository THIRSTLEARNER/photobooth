import { useRef } from 'react';
import { TopBar } from './components/TopBar.jsx';
import { Hero } from './components/Hero.jsx';
import { CameraStage } from './components/CameraStage.jsx';
import { ControlsPanel } from './components/ControlsPanel.jsx';
import { StripPanel } from './components/StripPanel.jsx';
import { GalleryPanel } from './components/GalleryPanel.jsx';
import { Footer } from './components/Footer.jsx';
import { useCamera } from './hooks/useCamera.js';
import { useFaceTracking } from './hooks/useFaceTracking.js';
import { useCaptureSession } from './hooks/useCaptureSession.js';
import { useGallery } from './hooks/useGallery.js';

export default function App() {
  const camera = useCamera();
  const {
    videoRef,
    ready,
    error,
    requesting,
    checking,
    start,
    stop,
    mirrored,
    facingMode,
    toggleFacingMode,
    toggleMirror,
  } = camera;
  const faceRef = useRef(null);
  const detectorRef = useRef(null);

  const { gallery, nextCursor, status, setStatus, saveStrip, removeStrip, loadMore } = useGallery();

  const capture = useCaptureSession({
    videoRef,
    faceRef,
    detectorRef,
    mirrored,
    setStatus,
  });

  const tracking = useFaceTracking({
    videoRef,
    ready,
    prop: capture.prop,
    activeProp: capture.activeProp,
    mirrored,
    faceRef,
    detectorRef,
  });

  const shooting = capture.phase === 'shooting';

  const onSave = async () => {
    const dataUrl = await capture.getStripDataUrl();
    if (dataUrl) await saveStrip(dataUrl);
  };

  const onShare = async () => {
    const ok = await capture.share();
    if (!ok) setStatus('Sharing is not available on this device/browser.');
  };

  return (
    <>
      <div className="orbs" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <main className="wrap" id="top">
        <a className="skip-link" href="#booth">
          Skip to the booth
        </a>
        <TopBar />
        <Hero />

        <div className="grid" id="booth">
          <section className="glass lens" aria-label="Camera">
            <CameraStage
              videoRef={videoRef}
              ready={ready}
              error={error}
              requesting={requesting}
              checking={checking}
              start={start}
              filter={capture.filter}
              activeProp={capture.activeProp}
              propLayerRef={tracking.propLayerRef}
              dogTongue={capture.dogTongue}
              toggleDogTongue={capture.toggleDogTongue}
              shooting={shooting}
              count={capture.count}
              flash={capture.flash}
              shots={capture.shots}
              shotCount={capture.shotCount}
              activeIndex={capture.activeIndex}
              mirrored={mirrored}
              onRetakeShot={capture.retakeShot}
              onCancel={capture.cancel}
            />

            <ControlsPanel
              filter={capture.filter}
              setFilter={capture.setFilter}
              prop={capture.prop}
              setProp={capture.setProp}
              activeProp={capture.activeProp}
              shooting={shooting}
              trackingNote={tracking.trackingNote}
              trackingLoading={tracking.trackingLoading}
              ready={ready}
              error={error}
              requesting={requesting}
              start={start}
              stop={stop}
              run={capture.run}
              phase={capture.phase}
              shotCount={capture.shotCount}
              setShotCount={capture.setShotCount}
              countdownSeconds={capture.countdownSeconds}
              setCountdownSeconds={capture.setCountdownSeconds}
              mirrored={mirrored}
              toggleMirror={toggleMirror}
              toggleFacingMode={toggleFacingMode}
              facingMode={facingMode}
            />
          </section>

          <StripPanel
            strip={capture.strip}
            hasShots={capture.filledShots.length > 0}
            layout={capture.layout}
            setLayout={capture.setLayout}
            frame={capture.frame}
            setFrame={capture.setFrame}
            outputFormat={capture.outputFormat}
            setOutputFormat={capture.setOutputFormat}
            outputQuality={capture.outputQuality}
            setOutputQuality={capture.setOutputQuality}
            save={onSave}
            download={capture.download}
            share={onShare}
            retake={capture.retake}
            status={status}
            shooting={shooting}
          />
        </div>

        <GalleryPanel
          gallery={gallery}
          remove={removeStrip}
          hasMore={!!nextCursor}
          loadMore={loadMore}
        />
        <Footer />
      </main>
    </>
  );
}
