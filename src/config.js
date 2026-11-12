// Centralized defaults and tunables. Phase 0 locks decisions; later phases wire these through UI/logic.

export const SHOT_COUNT_OPTIONS = [3, 4, 6];
export const DEFAULT_SHOT_COUNT = 4;

// Seconds per shot; 0 means no countdown.
export const COUNTDOWN_OPTIONS = [0, 3, 5, 10, 15];
export const DEFAULT_COUNTDOWN_SECONDS = 15;

export const OUTPUT_FORMAT_OPTIONS = ['png', 'jpeg', 'webp'];
export const DEFAULT_OUTPUT_FORMAT = 'png';
export const DEFAULT_OUTPUT_QUALITY = 0.92; // used for jpeg/webp

export const DEFAULT_MIRRORED = true;

export const CAPTURE_WIDTH = 800;
export const CAPTURE_HEIGHT = 600;

export const FACE_DETECT_INTERVAL_MS = 90;
export const FACE_SMOOTHING = 0.45;
export const FACE_STALE_HIDE_MS = 1500;
export const FACE_STALE_FREEZE_MS = 500;
export const FACE_RECENT_FOR_CAPTURE_MS = 1000;

// Server/gallery
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // decoded image cap target (enforced server-side in later phase)
export const GALLERY_PAGE_SIZE = 24;

// Gallery access model (Phase 3): 'private-session' | 'shared-local'
export const GALLERY_MODE = 'private-session';
export const SESSION_HEADER = 'X-Booth-Session';
export const SESSION_STORAGE_KEY = 'snapbooth.sessionId';
