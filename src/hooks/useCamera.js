import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_MIRRORED } from '../config.js';

export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const busy = useRef(false);
  const [facingMode, setFacingMode] = useState('user');
  const [mirrored, setMirrored] = useState(DEFAULT_MIRRORED);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [requesting, setRequesting] = useState(false);
  // `checking` covers the first moment while we ask the browser whether camera
  // access was already granted, so the permission gate doesn't flash.
  const [checking, setChecking] = useState(true);

  const release = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setReady(false);
  }, []);

  const start = useCallback(
    async (mode = facingMode) => {
      if (busy.current) return;
      busy.current = true;
      setError('');
      setReady(false);
      setChecking(false);
      setRequesting(true);
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        });
        release();
        if (!videoRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
      } catch (e) {
        setError(
          e?.name === 'NotAllowedError'
            ? 'Camera access is blocked. Allow the camera in your browser’s site settings, then try again.'
            : 'No camera found. Camera access needs HTTPS or localhost, and a connected camera.'
        );
      } finally {
        busy.current = false;
        setRequesting(false);
        setChecking(false);
      }
    },
    [release, facingMode]
  );

  const stop = useCallback(() => {
    release();
  }, [release]);

  const toggleFacingMode = useCallback(async () => {
    const next = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
    if (ready || requesting || streamRef.current) {
      await start(next);
    }
  }, [facingMode, ready, requesting, start]);

  const toggleMirror = useCallback(() => setMirrored((m) => !m), []);

  // Camera access is explicit: only auto-start when the browser already reports
  // the permission as granted. Otherwise the stage shows an "Allow camera" gate.
  useEffect(() => {
    let alive = true;
    (async () => {
      let granted = false;
      try {
        const status = await navigator.permissions?.query({ name: 'camera' });
        granted = status?.state === 'granted';
      } catch {
        granted = false;
      }
      if (!alive) return;
      if (granted) start('user');
      else setChecking(false);
    })();
    return () => {
      alive = false;
      release();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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
  };
}
