import type { Locator, Page } from "@playwright/test";

/**
 * Minimal in-page annotation layer for the capture harness — closes blocker
 * B1 in docs/onboarding-video-realignment-decisions-2026-07-27.md ("the
 * capture pipeline has no annotation layer at all").
 *
 * Two capabilities, matching that doc's "Needed" line:
 *
 *  1. An animated fake cursor that travels to a control and clicks it
 *     (standing rule 2: "show the click, not the result" — no cuts to an
 *     already-open dialog, no toast standing in for an unseen action).
 *  2. `ringAround(page, locator)` — a highlight ring positioned from the
 *     target element's LIVE getBoundingClientRect at call time (standing
 *     rule 5: "highlights anchor to the element, never to baked
 *     coordinates" — the shipped set's two empty rings were both offset
 *     downward from a baked position; anchoring is the fix).
 *
 * Design constraints, deliberate:
 *  - Dependency-free: injected DOM + injected CSS only, driven through
 *    Playwright's `page.evaluate`. Nothing is added to package.json.
 *  - Everything injected is namespaced `pv-annotate-*` (ids, classes, and
 *    keyframes) so nothing can collide with app styles, and a repo-wide
 *    grep for "pv-annotate" finds every trace.
 *  - Injection is idempotent and re-run by every helper, because a
 *    `page.goto` wipes injected DOM — callers never have to think about
 *    whether the layer is "installed" after a navigation.
 *  - Rings/cursor render inside the page, so Playwright's `recordVideo`
 *    captures them with zero post-processing.
 *  - `pulseCursor` plays the click animation WITHOUT dispatching any real
 *    event — used on the live-site trial form, where the whole point is
 *    that nothing is ever actually submitted.
 */

const STYLE_ID = "pv-annotate-style";
const CURSOR_ID = "pv-annotate-cursor";
const RING_CLASS = "pv-annotate-ring";

/** Spring-green brand ring (see memory: brand colour #00E676), 3px, soft glow. */
const ANNOTATE_CSS = `
#${CURSOR_ID} {
  position: fixed;
  left: 120px;
  top: 120px;
  width: 26px;
  height: 26px;
  z-index: 2147483646;
  pointer-events: none;
  opacity: 0;
  transition: left 0ms linear, top 0ms linear, opacity 200ms ease;
  will-change: left, top;
}
#${CURSOR_ID}.pv-annotate-visible { opacity: 1; }
#${CURSOR_ID} .pv-annotate-pulse {
  position: absolute;
  left: -8px;
  top: -8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2.5px solid #00E676;
  opacity: 0;
  transform: scale(0.4);
}
#${CURSOR_ID}.pv-annotate-clicking .pv-annotate-pulse {
  animation: pv-annotate-click-pulse 420ms ease-out forwards;
}
@keyframes pv-annotate-click-pulse {
  0%   { opacity: 0.9; transform: scale(0.4); }
  100% { opacity: 0;   transform: scale(1.5); }
}
.${RING_CLASS} {
  position: fixed;
  z-index: 2147483645;
  pointer-events: none;
  border: 3px solid #00E676;
  border-radius: 10px;
  box-shadow: 0 0 0 4px rgba(0, 230, 118, 0.22);
  animation: pv-annotate-ring-in 300ms ease-out;
}
@keyframes pv-annotate-ring-in {
  from { opacity: 0; transform: scale(1.06); }
  to   { opacity: 1; transform: scale(1); }
}
`;

/** White arrow cursor with a dark outline — readable on any background. */
const CURSOR_SVG = `
<svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.5 3.2 L5.5 17.8 L9.1 14.6 L11.5 20.2 L14.1 19.1 L11.7 13.6 L16.5 13.4 Z"
        fill="#ffffff" stroke="#1a1a1a" stroke-width="1.4" stroke-linejoin="round"/>
</svg>`;

/**
 * Idempotently installs the stylesheet + cursor element into the current
 * document. Safe (and cheap) to call before every use — after any
 * `page.goto` the previous injection is gone.
 */
export async function ensureAnnotationLayer(page: Page): Promise<void> {
  await page.evaluate(
    ({ styleId, cursorId, css, svg }) => {
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
      }
      if (!document.getElementById(cursorId)) {
        const cursor = document.createElement("div");
        cursor.id = cursorId;
        cursor.innerHTML = svg + '<div class="pv-annotate-pulse"></div>';
        document.body.appendChild(cursor);
      }
    },
    { styleId: STYLE_ID, cursorId: CURSOR_ID, css: ANNOTATE_CSS, svg: CURSOR_SVG },
  );
}

/**
 * Animates the fake cursor to the centre of `locator`'s element with a
 * smooth CSS left/top transition. The target position comes from the
 * element's live bounding box at call time (viewport coordinates, which is
 * exactly what position:fixed uses) — never a baked coordinate.
 *
 * Fails loudly if the element has no box (not visible) — a cursor gliding
 * to nothing is precisely the class of defect this layer exists to kill.
 */
export async function moveCursorTo(
  page: Page,
  locator: Locator,
  options: { durationMs?: number } = {},
): Promise<void> {
  const durationMs = options.durationMs ?? 900;
  await ensureAnnotationLayer(page);
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error("[annotate] moveCursorTo: target element has no bounding box (not visible?)");
  }
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.evaluate(
    ({ cursorId, x, y, durationMs }) => {
      const cursor = document.getElementById(cursorId);
      if (!cursor) return;
      cursor.classList.add("pv-annotate-visible");
      cursor.style.transition = `left ${durationMs}ms cubic-bezier(0.25, 0.6, 0.35, 1), top ${durationMs}ms cubic-bezier(0.25, 0.6, 0.35, 1), opacity 200ms ease`;
      // Force a layout so the transition starts from the current position
      // even if the cursor was only just created.
      void cursor.offsetWidth;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    },
    { cursorId: CURSOR_ID, x, y, durationMs },
  );
  // Deliberate wall-clock wait: this IS the animation's screen time, the
  // exact thing being filmed — not a correctness wait on app state.
  await page.waitForTimeout(durationMs + 80);
}

/**
 * Plays the click-pulse animation at the cursor's current position WITHOUT
 * dispatching any real input event. Exists so the never-submitted live-site
 * beats (employer chapter 1's trial form) can "show the click" per standing
 * rule 2 while guaranteeing nothing is actually clicked.
 */
export async function pulseCursor(page: Page): Promise<void> {
  await ensureAnnotationLayer(page);
  await page.evaluate((cursorId) => {
    const cursor = document.getElementById(cursorId);
    if (!cursor) return;
    cursor.classList.remove("pv-annotate-clicking");
    void cursor.offsetWidth; // restart the animation if re-triggered
    cursor.classList.add("pv-annotate-clicking");
  }, CURSOR_ID);
  await page.waitForTimeout(450);
  await page.evaluate((cursorId) => {
    document.getElementById(cursorId)?.classList.remove("pv-annotate-clicking");
  }, CURSOR_ID);
}

/**
 * The standard "show the click" beat: travel to the element, pulse, then
 * perform the REAL Playwright click on the locator (not a synthetic event at
 * coordinates — the app receives exactly the click a user would produce).
 */
export async function cursorClick(
  page: Page,
  locator: Locator,
  options: { durationMs?: number } = {},
): Promise<void> {
  await moveCursorTo(page, locator, options);
  await pulseCursor(page);
  await locator.click();
}

export interface AnnotationRing {
  /** Removes this ring from the page. Safe to call after a navigation (no-op). */
  remove: () => Promise<void>;
}

let ringCounter = 0;

/**
 * Draws a highlight ring around `locator`'s element, positioned from its
 * live bounding box at call time — element-anchored, never baked
 * coordinates (standing rule 5). Returns a handle whose `remove()` cleans
 * the ring up; `removeAllRings` clears every ring at once.
 *
 * Note the anchoring is a live read, not a live binding: if the page
 * scrolls or the element moves AFTER the ring is drawn, re-call ringAround
 * (shots in this pipeline hold still while a ring is up, so this hasn't
 * needed observer machinery — keep it minimal until a shot actually scrolls
 * under a ring).
 */
export async function ringAround(
  page: Page,
  locator: Locator,
  options: { paddingPx?: number } = {},
): Promise<AnnotationRing> {
  const paddingPx = options.paddingPx ?? 8;
  await ensureAnnotationLayer(page);
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error("[annotate] ringAround: target element has no bounding box (not visible?)");
  }
  const ringId = `pv-annotate-ring-${++ringCounter}`;
  await page.evaluate(
    ({ ringId, ringClass, box, paddingPx }) => {
      const ring = document.createElement("div");
      ring.id = ringId;
      ring.className = ringClass;
      ring.style.left = `${box.x - paddingPx}px`;
      ring.style.top = `${box.y - paddingPx}px`;
      ring.style.width = `${box.width + paddingPx * 2}px`;
      ring.style.height = `${box.height + paddingPx * 2}px`;
      document.body.appendChild(ring);
    },
    { ringId, ringClass: RING_CLASS, box, paddingPx },
  );
  return {
    remove: async () => {
      await page.evaluate((id) => document.getElementById(id)?.remove(), ringId).catch(() => {
        /* page navigated away — the ring is already gone */
      });
    },
  };
}

/** Removes every ring currently on the page (cursor stays). */
export async function removeAllRings(page: Page): Promise<void> {
  await page
    .evaluate((ringClass) => {
      document.querySelectorAll(`.${ringClass}`).forEach((el) => el.remove());
    }, RING_CLASS)
    .catch(() => {
      /* page navigated away — nothing to remove */
    });
}
