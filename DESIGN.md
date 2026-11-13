---
name: Snapbooth Glass
description: A luminous, glass-wrapped browser photobooth for playful premium keepsakes.
colors:
  midnight-void: '#070b1d'
  glass-ink: '#f4f6ff'
  mist-muted: '#d3dbf5'
  cool-label: '#cbd3f2'
  mist-text: '#cbd4f2'
  bright-label: '#d7def9'
  electric-amethyst: '#7c5cff'
  royal-amethyst: '#6a47f0'
  aurora-mint: '#2ee6d6'
  seafoam-glint: '#9df3ea'
  flash-magenta: '#ff5fa2'
  deep-magenta: '#e0408a'
  warm-filament: '#ffc46b'
  focus-cyan: '#7ff3e8'
  success-mint: '#3cf0a0'
  strip-ink: '#1b2150'
  strip-caption: '#6a74a8'
  edge-faint: 'rgba(255, 255, 255, 0.14)'
  edge-strong: 'rgba(255, 255, 255, 0.28)'
  edge-glass: 'rgba(255, 255, 255, 0.16)'
  surface-frost: 'rgba(255, 255, 255, 0.07)'
  surface-frost-hover: 'rgba(255, 255, 255, 0.16)'
  glass-panel: 'rgba(9, 13, 22, 0.16)'
  glass-nav: 'rgba(8, 11, 18, 0.28)'
  glass-overlay: 'rgba(10, 14, 36, 0.65)'
  notice-border: '#ff5fa2'
  hero-lilac: '#d9d4ff'
  hero-mint: '#a6fff4'
  hero-violet: '#b8a5ff'
  hero-rose: '#ffb7d3'
  step-seafoam: '#9dfff4'
  strip-lavender: '#cdd6ff'
  button-ink: '#0a0e1a'
  chrome-blue: '#4c7dff'
  chrome-teal: '#19d3c5'
  primary-lift: '#8b6bff'
  mask-ink: '#000'
  shadow-soft: 'rgba(0, 0, 0, 0.45)'
  shadow-deep: 'rgba(0, 0, 0, 0.55)'
typography:
  display:
    fontFamily: 'Syne, system-ui, sans-serif'
    fontSize: 'clamp(2.5rem, 6vw, 4.1rem)'
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: '-0.035em'
  display-compact:
    fontFamily: 'Syne, system-ui, sans-serif'
    fontSize: 'clamp(1.8rem, 8.2vw, 2.6rem)'
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: '-0.035em'
  headline-lg:
    fontFamily: 'Syne, system-ui, sans-serif'
    fontSize: '1.3rem'
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: '-0.01em'
  headline:
    fontFamily: 'Syne, system-ui, sans-serif'
    fontSize: '1.18rem'
    fontWeight: 800
    lineHeight: 1
    letterSpacing: '-0.01em'
  title:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: '1.05rem'
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.55
  body-strong:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: '0.94rem'
    fontWeight: 600
    lineHeight: 1.4
  body-ui:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: '0.92rem'
    fontWeight: 600
    lineHeight: 1.4
  small:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: '0.85rem'
    fontWeight: 600
    lineHeight: 1.4
  meta:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: '0.82rem'
    fontWeight: 500
    lineHeight: 1.45
  caption:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: '0.8rem'
    fontWeight: 500
    lineHeight: 1.4
  micro:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: '0.78rem'
    fontWeight: 600
    lineHeight: 1.3
  fine:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: '0.76rem'
    fontWeight: 600
    lineHeight: 1.3
  label:
    fontFamily: 'Figtree, system-ui, sans-serif'
    fontSize: '0.72rem'
    fontWeight: 700
    lineHeight: 1
    letterSpacing: '0.16em'
rounded:
  xs: '10px'
  mini: '11px'
  sm: '12px'
  md: '14px'
  lg: '16px'
  card: '18px'
  panel-lg: '20px'
  panel: '22px'
  prop: '24px'
  hero: '30px'
  pill: '999px'
spacing:
  xs: '8px'
  sm: '10px'
  md: '12px'
  lg: '14px'
  xl: '16px'
  2xl: '18px'
  3xl: '22px'
  4xl: '24px'
  section: '30px'
  wrap-x: 'clamp(14px, 4vw, 32px)'
  wrap-y: 'clamp(18px, 3vw, 30px)'
components:
  button-primary:
    backgroundColor: '{colors.glass-ink}'
    textColor: '{colors.button-ink}'
    typography: '{typography.body}'
    rounded: '{rounded.pill}'
    padding: '0 24px'
    height: '52px'
  button-quiet:
    backgroundColor: '{colors.surface-frost}'
    textColor: '{colors.glass-ink}'
    typography: '{typography.body}'
    rounded: '{rounded.pill}'
    padding: '0 24px'
    height: '52px'
  chip:
    backgroundColor: '{colors.surface-frost}'
    textColor: '{colors.glass-ink}'
    typography: '{typography.body}'
    rounded: '{rounded.pill}'
    padding: '0 16px'
    height: '44px'
  chip-active:
    backgroundColor: 'linear-gradient(150deg, rgba(255,255,255,0.34), rgba(255,255,255,0.12)), rgba(124,92,255,0.2)'
    textColor: '{colors.glass-ink}'
    typography: '{typography.body}'
    rounded: '{rounded.pill}'
    padding: '0 16px'
    height: '44px'
  glass-panel:
    backgroundColor: '{colors.glass-panel}'
    textColor: '{colors.glass-ink}'
    rounded: '{rounded.hero}'
    padding: '18px'
  nav-pill:
    backgroundColor: '{colors.glass-nav}'
    textColor: '{colors.mist-muted}'
    typography: '{typography.body}'
    rounded: '{rounded.pill}'
    padding: '9px 13px'
    height: '44px'
---

# Design System: Snapbooth Glass

## Overview

**Creative North Star: "The Aurora Kiosk"**

Snapbooth Glass is a luminous, glass-wrapped photobooth: a compact kiosk of frosted panes, soft monochrome light, and crisp specular highlights that feels premium yet playful in a live event moment. The interface behaves like stacked glass set against a deep midnight scene—light drifts behind it, surfaces catch highlights, and controls invite touch without stealing attention from the camera and the keepsake strip.

The visual philosophy is playful, luminous, polished. Translucency, blur, and soft light blooms create atmosphere; confident Syne display moments and calm Figtree UI copy keep the experience legible and effortless. Density stays comfortable for quick, in-the-moment decisions (style, shoot, retake, save/share) while giving the resulting strip a sense of occasion.

**Key Characteristics:**

- Frosted glass layering with specular rims, soft ambient lift, and neutral backlighting (never flat slabs).
- Deep midnight grounds (`#070b1d`) washed by soft monochrome light; Electric Amethyst, Aurora Mint, Flash Magenta, and Warm Filament are reserved for controls, keepsakes, and glow accents.
- Syne for expressive display/brand moments; Figtree for clear, friendly controls and body text.
- Tactile pill controls and panels with visible hover/focus/pressed states and generous tap targets (≥44px).
- Photo/strip content remains the hero; UI chrome frames and elevates the keepsake rather than competing with it.

## Colors

A nocturnal, smoked-glass palette: vivid luminous accents float over a softly lit neutral glass field and midnight neutrals.

### Primary

- **Electric Amethyst** (#7c5cff): Core brand/accent energy. Drives primary gradients, active glows, and key emphasis moments.
- **Royal Amethyst** (#6a47f0): Deeper support tone in primary button gradients and shadow/glow accents, adding weight and contrast.
- **Aurora Mint** (#2ee6d6): Signature cool accent. Used for highlights, step markers, focus-adjacent emphasis, active outlines, links/icons, and luminous details that signal freshness and clarity.

### Secondary

- **Flash Magenta** (#ff5fa2): Playful warm accent in gradients and attention states (e.g. notices/danger-leaning highlights) that add celebratory energy.
- **Deep Magenta** (#e0408a): Rich magenta anchor in primary gradients, grounding Flash Magenta with a polished finish.

### Tertiary

- **Warm Filament** (#ffc46b): A warm glow accent for gradient warmth and small luminous details; used sparingly to keep the scene lively without dominating.
- **Seafoam Glint** (#9df3ea): Soft mint highlight for eyebrow/overline text and luminous details.
- **Focus Cyan** (#7ff3e8): High-visibility focus ring (`:focus-visible`) to keep keyboard navigation unmistakable on dark glass.
- **Success Mint** (#3cf0a0): Positive status indicator dot/glow (e.g. ready/meta cues).

### Neutral

- **Midnight Void** (#070b1d): Global background base behind neutral light washes and glass layers.
- **Glass Ink** (#f4f6ff): Primary text on dark/glass surfaces; also the light end of controls and slider thumbs.
- **Mist Muted** (#d3dbf5): Secondary text, helper copy, and subdued UI labels.
- **Cool Label** (#cbd3f2): Uppercase field labels and restrained UI headings.
- **Bright Label** (#d7def9): Emphasized helper text on darker overlays (e.g. permission copy).
- **Strip Ink** (#1b2150): Dark ink on the decorative/light photo-strip preview.
- **Strip Caption** (#6a74a8): Subdued caption/meta text on the light strip preview.
- **Edge Faint** (rgba(255, 255, 255, 0.14)) / **Edge Strong** (rgba(255, 255, 255, 0.28)) / **Edge Glass** (rgba(255, 255, 255, 0.16)): Translucent borders defining glass edges at varying emphasis.
- **Surface Frost** (rgba(255, 255, 255, 0.07)) / **Surface Frost Hover** (rgba(255, 255, 255, 0.16)): Default and hover fills for quiet controls and chips.
- **Glass Panel** (rgba(9, 13, 22, 0.2)) / **Glass Nav** (rgba(8, 11, 18, 0.26)) / **Glass Overlay** (rgba(10, 14, 36, 0.65)): Translucent neutral structural fills for panels, navigation, and overlays with backdrop blur.

**The Luminous Rarity Rule.** Aurora accents (especially Electric Amethyst, Aurora Mint, Flash Magenta) earn attention through contrast against Midnight Void and neutral frosted glass. Use saturated accents for actions, focus, active/selected states, and glow accents—not as large flat fills that drown the camera view or the strip.

## Typography

**Display Font:** Syne (with system-ui, sans-serif fallback)
**Body Font:** Figtree (with system-ui, -apple-system, "Segoe UI", sans-serif fallback)
**Label/Mono Font:** None distinct (Figtree carries labels and UI text).

**Character:** Confident and contemporary—Syne brings expressive, geometric personality to headlines and brand marks, while Figtree stays warm, clear, and highly legible for controls and guidance in a fast, tap-first flow.

### Hierarchy

- **Display** (800, clamp(2.5rem, 6vw, 4.1rem), 0.98 line-height, -0.035em tracking): Hero headline (`h1`). Bold, compact, and celebratory; use `text-wrap: balance` for composed lines.
- **Headline** (800, ~1.15–1.18rem, ~1–1.2 line-height, -0.01em tracking): Brand wordmark, section heads, and key card/permission titles. Distinctive without overpowering content.
- **Title** (700, 1.05rem, 1.3 line-height): Panel/field titles (`h2`) and supporting headings; clear and steady.
- **Body** (400–600, 0.98–1.08rem fluid for ledes, 1rem base, ~1.55 line-height): Paragraphs, ledes, and general UI copy. Comfortable reading with `text-wrap: pretty` where used.
- **Label** (700, 0.72–0.85rem, 0.16–0.22em tracking, uppercase where specified): Eyebrows, field labels, nav/badge microcopy, and small metadata. Crisp, spaced, and secondary to content.

**The Camera-First Voice Rule.** Typography frames the moment; it does not compete with the live preview or the photo strip. Reserve Syne’s weight and tight tracking for a few key moments (hero, brand, section anchors) and let Figtree carry instructions and controls.

## Layout

- **Container:** A centered content column `.wrap` with `max-width: 1120px` (70rem), fluid padding `clamp(18px, 3vw, 30px) clamp(14px, 4vw, 32px)` and generous bottom breathing room (~56px).
- **Flow:** Single-column by default: sticky top navigation, hero, booth grid (camera + controls alongside strip/output), gallery, then footer.
- **Booth grid:** `.grid` is 1 column with 22px gap; at `min-width: 900px` it becomes two columns `minmax(0, 1.3fr) minmax(0, 1fr)` aligned to start, giving the camera/stage comfortable dominance.
- **Hero:** 1 column stacking to two columns at `min-width: 960px` (`minmax(0, 1.2fr) minmax(260px, 0.8fr)`), aligning copy and decorative strip art.
- **Rhythm & density:** Consistent 8–24px spacing steps in practice (gaps/padding commonly 8/10/12/14/16/18/22/24/30px). Panels use ~18–22px internal padding; controls cluster with 10–14px gaps for quick scanning.
- **Responsive behavior:** At ≤560px the top bar compacts (badge hidden, tighter nav), hero/strip art scale down, and footer reflows; at ≤420px the brand name becomes sr-only, nav tightens, and gallery tiles shrink to ~112px minimum. Safe-area insets are respected on `body`.
- **Scrolling:** `scroll-behavior: smooth` and `scroll-padding-top: 92px` (disabled under reduced motion) to accommodate the sticky nav.

## Elevation & Depth

Depth is **glass layering with ambient lift**. Surfaces read as frosted panes stacked over a softly lit neutral field rather than opaque cards casting heavy drop shadows.

- **Material:** Translucent fills (`rgba(...)` whites/dark blues), `backdrop-filter: blur(36px) saturate(190%) brightness(0.68)` on panels and lighter blur on small controls, and layered gradient sheens (top bloom, diagonal glare, bottom bounce) create separation. A fine film-grain overlay on `body` adds tactile texture without obscuring content.
- **Light & speculars:** Panels and nav use top/inner highlights (`inset 0 1px 0 ...`), a bright masked gradient rim, a faint inner edge ring, and a soft bottom inner glow that reads as glass thickness.
- **Ambient shadows:** Soft, wide, low-contrast outer shadows (e.g. `0 34px 78px -26px ...`, `0 24px 50px -26px ...`) lift panes gently; the camera stage uses inner vignette/shadow for depth.
- **Atmosphere:** Fixed monochrome light orbs and neutral radial gradients supply luminance behind glass; hover states can add restrained colored glow (e.g. gallery hover).

**The Glass, Not Weight Rule.** Prefer translucency, blur, rim light, and ambient separation over heavy opaque elevation steps. Lift communicates layering; it must never muddy the camera feed or reduce text/strip contrast.

## Shapes

- **Overall form:** Soft, rounded geometry throughout—pill controls, generously rounded panels, and circular accents—echoing the friendly, kiosk-like character.
- **Radii scale (observed):** 10–12px for small controls/icons, 14–16px for chips/inner elements, 18–22px for cards/panels/nav containers, 30px (`--radius-xl`) for primary glass panels/hero/footer, and 999px for pills, badges, and nav links.
- **Borders:** Subtle translucent strokes (`1px solid rgba(255,255,255,0.14–0.28)`) define edges on glass; `.glass` panels gain a luminous gradient rim via a masked pseudo-element.
- **Clipping & highlights:** Rounded corners clip internal sheens/glare (`overflow: hidden` on hero, stage, preview) so specular highlights feel contained within each pane.

## Components

Components are tactile glass controls: frosted, rounded, and responsive, with clear state feedback and minimum 44px interactive targets.

### Buttons

- **Shape:** Pill (999px radius). Comfortable heights (≥44–52px).
- **Primary (`.btn`):** Frosted glass-white fill (translucent white gradient over blur), deep-ink text, a bright rim, top highlight, cool inner shading at the base for thickness, and ambient neutral shadow. Hover lifts slightly and brightens toward pure white; active compresses with a softer inner shadow. Disabled dims with no lift/shadow. No colored gradient or moving sheen.
- **Quiet (`.btn.quiet`):** Dark frosted glass — translucent white sheen over a blurred dark fill, brighter rim and inner highlight with light text; hover increases frost opacity and rim brightness. Used for secondary actions.
- **Focus:** Prominent `:focus-visible` outline in Focus Cyan (#7ff3e8, 3px, offset 3px) across interactive elements.

### Chips & Toggles

- **Shape:** Pill chips (`.chip`, min-height 44px) with frosted fill, translucent border, and inner highlight.
- **Default/Hover:** Subtle frost that brightens on hover; gentle press scale.
- **Active/Selected (`[aria-pressed="true"]`):** Brighter glass gradient with amethyst tint, stronger border/highlight, and a soft violet glow to clearly indicate selection.

### Cards / Containers

- **Glass Panels (`.glass`):** Large radius (~30px), translucent layered background (top bloom + diagonal body wash + base fill) over deeper blur+saturate, ambient outer shadows, bright masked rim, inner edge ring, bottom inner glow, and a two-direction glare overlay for specular depth.
- **Stage (`.stage`):** Rounded camera viewport (20px) with dark radial ground, inner vignette, and a top-left specular sheen; contains overlays, pills, and video.
- **Hero/Info tiles:** Frosted rounded blocks (16px) with soft borders and inner highlights for steps/meta.
- **Footer:** A wide glass bar (20–30px effective) aligning brand, note, and nav.

### Inputs / Fields

- **Range (`.quality-range`):** Custom-styled slider with an aurora-mint-to-amethyst track, light thumb, soft glow, and Focus Cyan focus behavior.
- **Field grouping (`.field`):** Vertical stack with uppercase Cool Label headings (0.72rem, tracked) and muted helper notes.

### Navigation

- **Top bar (`.topbar`):** Sticky, pill-shaped frosted nav with blur/saturate, rim highlight, brand mark, compact links, and a status badge (hidden on very small screens).
- **Links:** Rounded pills with muted default color, frost hover fill, and clear text color shift; brand mark has a subtle hover tilt/lift.
- **Skip link:** High-contrast, focus-revealed shortcut to the booth.

### Thumbnails & Gallery

- **Thumb grid:** Dashed/frosted slots, rounded (12px), with active outline (Aurora Mint) and focusable buttons.
- **Gallery items:** Padded glass tiles with rounded image corners; hover/focus lifts slightly with a restrained violet glow and image scale, while icon buttons provide clear destructive/action affordance.

### Icon Buttons

- **Shape:** Circular (44×44px) frosted buttons with blur; hover/focus shifts to Flash Magenta for a clear, energetic action state.

### Overlays & Feedback

- **Permission/notice overlays:** Darkened blurred backdrops with centered frosted content, clear headings, and primary actions.
- **Status cues:** Pill badges, spinner, countdown, and flash states provide immediate capture feedback (flash simplified under reduced motion).

## Do's and Don'ts

Concrete guardrails grounded in the incumbent "Aurora Kiosk" glass system and the chosen world.

### Do:

- **Do** preserve frosted glass layering: pair translucent fills (e.g. `rgba(9,13,22,0.2)` / `rgba(255,255,255,0.16)`) with `backdrop-filter: blur(...) saturate(...) brightness(...)`, soft ambient shadows, and specular rims/highlights as in `.glass`/`.topbar`/`.btn`.
- **Do** keep the camera preview and photo strip as the visual focus; use Midnight Void (#070b1d) grounds and restrained UI chrome so captures remain clear.
- **Do** use Syne 800 for display/brand anchors and Figtree for body/controls, maintaining the observed scale (display `clamp(2.5rem,6vw,4.1rem)/0.98`, labels 0.72–0.85rem tracked/uppercase where established).
- **Do** use tactile pill controls (min 44px targets) with explicit hover, active, selected (`aria-pressed="true"`), and disabled states; keep `:focus-visible` highly visible with Focus Cyan (#7ff3e8).
- **Do** apply aurora accents (Electric Amethyst #7c5cff, Aurora Mint #2ee6d6, Flash Magenta #ff5fa2, Warm Filament #ffc46b) for gradients, glows, selection, and emphasis per the Luminous Rarity Rule.
- **Do** honor reduced motion (`prefers-reduced-motion: reduce`) by disabling/simplifying animations, transitions, and transform effects as the current implementation does.

### Don't:

- **Don't** flatten the system into opaque, solid panels or remove blur/rim-light layering; depth must read as glass with ambient lift, not heavy material slabs.
- **Don't** introduce large flat floods of saturated accent color behind the camera/stage or strip; accents should glow and highlight, not overpower content.
- **Don't** replace Syne/Figtree with unestablished typefaces or collapse the display-vs-UI hierarchy into a single uniform text style.
- **Don't** create controls without clear state feedback or with tap targets below 44px; avoid hover-only affordances.
- **Don't** add heavy drop shadows, harsh borders, or busy textures that compete with the frosted/aurora material or reduce legibility on dark glass.
- **Don't** ignore accessibility baselines: maintain WCAG 2.1 AA contrast on text/controls, visible focus, and reduced-motion support.
