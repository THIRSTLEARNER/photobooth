# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary users:** Event and party guests (e.g. weddings, parties, gatherings) using Snapbooth Glass in a social setting to capture fun, keepsake photo strips.
- **Job/situation:** Step up to a browser-based photobooth, style poses with filters/props/frames, run a short photo session, and leave with a strip they can save, download, or share.

## Product Purpose

- **What it does:** A browser-based (web) photobooth that captures configurable photo sessions (3/4/6 shots, optional countdown, per-shot retake/cancel) with live camera preview, filters, face-tracked props, frames/layouts (strip/grid/wide), and export in PNG/JPEG/WEBP. Users can save strips to a private, per-browser-session gallery on the server, or download/share them.
- **Why it exists:** To deliver a playful, premium in-browser photobooth experience that produces styled keepsakes people want to save and share at events and gatherings.
- **Success:** Guests complete a session smoothly and come away with a polished, fun strip in their preferred format/layout that feels worth keeping or sharing.

## Positioning

A glassmorphism-styled, in-browser photobooth focused on playful premium keepsakes: per-shot looks (change filters and face props between poses), flexible session/countdown controls, multiple layouts and export formats, and a private per-session gallery—delivered as a self-contained web app (React/Vite front end, Express back end) without requiring a native kiosk app.

## Operating Context

- **Environment:** Used on devices with a camera in modern browsers; camera access works on `localhost` or over HTTPS. Can be run locally for development or served as a built app.
- **Workflow:** Allow camera access → configure/style shots (filters, props, mirror/facing where supported) → capture a session with optional countdown and retakes → choose layout/frame/output format and quality → save to gallery, download, or share.
- **Privacy/storage:** Live preview and capture run in the browser. Saving uploads the composed image to the server gallery scoped to a random per-browser session token (`X-Booth-Session`) stored under `server/strips/<session>/` with basic retention/size limits (env-configurable). Saved strips are user data.

## Capabilities and Constraints

- **Confirmed capabilities:** Camera start/stop, front/rear switch (where supported), mirror toggle; 3/4/6 shots; countdown off/3/5/10/15s; per-shot retake and cancel; filters, frames, layouts (strip/grid/wide), face-tracked props via local MediaPipe assets with static fallback if assets missing; PNG/JPEG/WEBP export with quality control; download/share; private per-session gallery with pagination/delete; server API for listing/saving/deleting strips.
- **Technical constraints:** Requires camera permission and a secure context (HTTPS or localhost). Face-tracking props depend on local MediaPipe/model assets in `public/mediapipe/` and `public/models/`. Fonts are self-hosted/bundled.
- **Terminology:** “Strip” refers to the composed output (including strip/grid/wide layouts) saved or exported.
- **Open/undecided (not specified):** Specific deployment/hosting targets beyond trusted/local or general HTTPS guidance; any formal analytics, accounts, or cross-device gallery requirements.

## Brand Commitments

- **Name:** “Snapbooth Glass” (as used in product copy/UI).
- **Identity cues present in repo:** Glassmorphism photobooth presentation and copy emphasizing a playful, premium keepsake experience. No additional binding voice guide or external brand assets were specified.

## Evidence on Hand

- **In repo:** Product description and feature/privacy/API documentation (`README.md`), UI copy and implementation (`index.html`, `src/**`), self-hosted fonts/assets and local MediaPipe/model files, and existing visual implementation/styles.
- **Absences (must not be fabricated):** No real customer testimonials, case studies, press mentions, usage metrics/benchmarks, pricing, or licensing claims provided.

## Product Principles

1. **Keepsakes over snapshots:** Prioritize outputs that feel polished, personal, and worth saving or sharing.
2. **Playful control:** Let guests easily style each shot and configure sessions without friction or confusion.
3. **Trust by default:** Keep camera experience clear and gallery/storage private per browser session, with honest communication about what is saved.
4. **Works in the moment:** Favor reliable, responsive capture flows (including fallbacks and clear states) suitable for live event use on the web.
5. **Accessible to guests:** Ensure the booth experience is usable and perceivable for a broad range of people.

## Accessibility & Inclusion

- **Binding requirement:** Meet **WCAG 2.1 Level AA** as the baseline accessibility standard for future work (in addition to existing good practices in the project such as keyboard/focus considerations and reduced-motion support noted in docs).
