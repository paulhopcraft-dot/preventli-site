"use client";

import { useEffect, useRef, useState } from "react";
import {
  ACTOR_COLOR,
  ACTOR_LABEL,
  WORKFLOW_GROUPS,
  type Actor,
  type WorkflowGroup,
} from "@/lib/welcome/workflow";
import { CHAPTERS, getChapter } from "@/lib/welcome/chapters";
import { getWatchedChapters, markChapterWatched } from "@/lib/welcome/watched";
import VideoLightbox from "./VideoLightbox";

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ---------------------------------------------------------------------
// Desktop grid geometry.
//
// 5 grid-column tracks: box | gutter | box | gutter | box
// 3 grid-row tracks: top row of boxes | elbow connector | second row of boxes
// ---------------------------------------------------------------------
const COL_TRACK: Record<0 | 1 | 2, string> = { 0: "1 / 2", 1: "3 / 4", 2: "5 / 6" };
const FULL_TRACK = "1 / 6";
const ROW_TRACK: Record<0 | 1, string> = { 0: "1 / 2", 1: "3 / 4" };
const ELBOW_ROW = "2 / 3";

const GRID_TEMPLATE_ROWS = "auto 84px auto";
const GRID_TEMPLATE_COLUMNS = "1fr 56px 1fr 56px 1fr";

// Straight, same-row connectors between adjacent boxes. Column tracks 2 and 4
// are the gutters either side of the middle box.
const ROW_ARROWS = [
  { id: "ra-r0-a", gridColumn: "2 / 3", gridRow: ROW_TRACK[0] },
  { id: "ra-r0-b", gridColumn: "4 / 5", gridRow: ROW_TRACK[0] },
  { id: "ra-r1-a", gridColumn: "2 / 3", gridRow: ROW_TRACK[1] },
];

// The single down-left elbow: the flow leaves the top-right box and returns to
// the left of the second row. x values are percentages across the full grid
// width (roughly the 16 / 50 / 84 centers of the three box columns).
const ELBOW_PATH = "M 84 0 L 84 50 L 16 50 L 16 100";

export default function WorkflowMap() {
  const [watchedChapters, setWatchedChapters] = useState<Set<string>>(new Set());
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [isTour, setIsTour] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reads localStorage, so it must happen after mount to keep the first
    // client render matching the server-rendered (empty) markup — the
    // synchronous setState here is intentional, not an effect smell.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWatchedChapters(getWatchedChapters());
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const targets = el.querySelectorAll("[data-wf-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("wf-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  function closeLightbox() {
    setActiveChapterId((current) => {
      if (current) setWatchedChapters(markChapterWatched(current));
      return null;
    });
    setIsTour(false);
  }

  function goToNextChapter() {
    setActiveChapterId((current) => {
      if (!current) return current;
      setWatchedChapters(markChapterWatched(current));
      const idx = CHAPTERS.findIndex((c) => c.id === current);
      if (idx === -1 || idx >= CHAPTERS.length - 1) {
        setIsTour(false);
        return null;
      }
      return CHAPTERS[idx + 1].id;
    });
  }

  function goToPrevChapter() {
    setActiveChapterId((current) => {
      if (!current) return current;
      const idx = CHAPTERS.findIndex((c) => c.id === current);
      if (idx <= 0) return current;
      return CHAPTERS[idx - 1].id;
    });
  }

  function openGroup(group: WorkflowGroup) {
    setIsTour(false);
    setActiveChapterId(group.chapterId);
  }

  const activeChapter = activeChapterId ? getChapter(activeChapterId) : undefined;
  const activeChapterIndex = activeChapter
    ? CHAPTERS.findIndex((c) => c.id === activeChapter.id)
    : -1;

  return (
    <section id="how-it-works" className="py-20 bg-[#0A1628]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            The full workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            How a check moves end to end
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Five stages, five short videos. Click a stage to watch it, or take the full tour from
            start to finish.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-12">
          {(Object.keys(ACTOR_LABEL) as Actor[]).map((actor) => (
            <div key={actor} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-[3px] shrink-0"
                style={{ backgroundColor: ACTOR_COLOR[actor] }}
              />
              <span className="text-gray-300 text-xs sm:text-sm font-medium">
                {ACTOR_LABEL[actor]}
              </span>
            </div>
          ))}
        </div>

        {/* Map — the centrepiece, comes before the tour button */}
        <div ref={containerRef} className="relative mb-10">
          <DesktopFlowchart watchedChapters={watchedChapters} onOpenGroup={openGroup} />
          <MobileStack watchedChapters={watchedChapters} onOpenGroup={openGroup} />
        </div>

        {/* Take the full tour */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              setIsTour(true);
              setActiveChapterId(CHAPTERS[0].id);
            }}
            className="inline-flex items-center gap-2 bg-[#00E676] text-[#0A1628] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#00C060] transition-all hover:scale-105 shadow-lg shadow-[#00E676]/20"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Take the full tour
          </button>
        </div>
      </div>

      {activeChapter && activeChapterIndex >= 0 && (
        <VideoLightbox
          chapter={activeChapter}
          chapterNumber={activeChapterIndex + 1}
          totalChapters={CHAPTERS.length}
          isTour={isTour}
          onClose={closeLightbox}
          onNextChapter={goToNextChapter}
          onPrevChapter={goToPrevChapter}
        />
      )}
    </section>
  );
}

// ---------------------------------------------------------------------
// Desktop — three boxes across, then the flow returns to a row of two
// (>= sm / 640px)
// ---------------------------------------------------------------------

function DesktopFlowchart({
  watchedChapters,
  onOpenGroup,
}: {
  watchedChapters: Set<string>;
  onOpenGroup: (group: WorkflowGroup) => void;
}) {
  return (
    <div
      className="hidden sm:grid items-stretch"
      style={{
        gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
        gridTemplateRows: GRID_TEMPLATE_ROWS,
      }}
    >
      {/* Shared arrowhead marker, referenced by every connector below. */}
      <svg width="0" height="0" aria-hidden focusable="false">
        <defs>
          <marker
            id="wf-arrow-white"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.4)" />
          </marker>
        </defs>
      </svg>

      {WORKFLOW_GROUPS.map((group, i) => (
        <GroupBox
          key={group.id}
          group={group}
          stageNumber={i + 1}
          watched={watchedChapters.has(group.chapterId)}
          onClick={() => onOpenGroup(group)}
        />
      ))}

      {ROW_ARROWS.map((arrow) => (
        <div
          key={arrow.id}
          data-wf-reveal
          className="wf-connector-cell relative"
          style={{ gridColumn: arrow.gridColumn, gridRow: arrow.gridRow }}
          aria-hidden
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full block">
            <line
              x1="6"
              y1="50"
              x2="90"
              y2="50"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2.5"
              markerEnd="url(#wf-arrow-white)"
            />
            <line
              x1="6"
              y1="50"
              x2="90"
              y2="50"
              className="wf-flow-line"
              stroke="#00E676"
              strokeWidth="2"
              strokeDasharray="5 7"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}

      <div
        data-wf-reveal
        className="wf-connector-cell relative"
        style={{ gridColumn: FULL_TRACK, gridRow: ELBOW_ROW }}
        aria-hidden
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full block">
          <path
            d={ELBOW_PATH}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="2"
            markerEnd="url(#wf-arrow-white)"
          />
          <path
            d={ELBOW_PATH}
            className="wf-flow-line"
            fill="none"
            stroke="#00E676"
            strokeWidth="2"
            strokeDasharray="5 7"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

function GroupBox({
  group,
  stageNumber,
  watched,
  onClick,
}: {
  group: WorkflowGroup;
  stageNumber: number;
  watched: boolean;
  onClick: () => void;
}) {
  const color = ACTOR_COLOR[group.actor];

  return (
    <button
      type="button"
      onClick={onClick}
      data-wf-reveal
      aria-label={`Stage ${stageNumber} of ${WORKFLOW_GROUPS.length}: ${group.title} — watch the video`}
      className="wf-node group relative hidden sm:flex flex-col text-left rounded-2xl border px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00E676] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E676]"
      style={{
        gridColumn: COL_TRACK[group.col],
        gridRow: ROW_TRACK[group.row],
        backgroundColor: hexToRgba(color, 0.12),
        borderColor: hexToRgba(color, 0.5),
        boxShadow: "none",
        transitionDelay: `${group.col * 90}ms`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 10px 26px -8px rgba(0,230,118,0.25)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
      }}
    >
      <GroupBoxBody group={group} stageNumber={stageNumber} watched={watched} color={color} />
    </button>
  );
}

// Shared between the desktop grid and the mobile stack so the two layouts can
// never drift apart in content.
function GroupBoxBody({
  group,
  stageNumber,
  watched,
  color,
}: {
  group: WorkflowGroup;
  stageNumber: number;
  watched: boolean;
  color: string;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ backgroundColor: hexToRgba(color, 0.25), color }}
          >
            {stageNumber}
          </span>
          <span
            className="text-[10px] uppercase tracking-wide font-semibold truncate"
            style={{ color }}
          >
            {ACTOR_LABEL[group.actor]}
          </span>
        </div>
        {watched && <WatchedBadge />}
      </div>

      <h3 className="text-white font-semibold text-[15px] leading-snug">{group.title}</h3>
      <p className="text-gray-400 text-[12px] mt-1 leading-snug">{group.summary}</p>

      <ul className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-3">
        {group.stages.map((stage, i) => (
          <li key={stage.label} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-gray-600 text-[10px]" aria-hidden>
                →
              </span>
            )}
            <span
              className={`inline-block rounded-md px-2 py-0.5 text-[11px] leading-tight text-gray-300 border ${
                stage.actor === "automatic" ? "border-dashed" : ""
              }`}
              style={{
                backgroundColor: hexToRgba(ACTOR_COLOR[stage.actor], 0.08),
                borderColor: hexToRgba(ACTOR_COLOR[stage.actor], 0.3),
              }}
            >
              {stage.label}
            </span>
          </li>
        ))}
      </ul>

      {/* The single play affordance for the whole box. */}
      <span className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 text-[#00E676] text-[12px] font-semibold">
        <span className="w-6 h-6 rounded-full bg-[#00E676]/15 border border-[#00E676]/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <svg width="9" height="9" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        {watched ? "Watch again" : "Watch this stage"}
      </span>
    </>
  );
}

// ---------------------------------------------------------------------
// Mobile — vertical stacked fallback (< sm / 640px)
// ---------------------------------------------------------------------

function MobileStack({
  watchedChapters,
  onOpenGroup,
}: {
  watchedChapters: Set<string>;
  onOpenGroup: (group: WorkflowGroup) => void;
}) {
  return (
    <div className="sm:hidden flex flex-col">
      {WORKFLOW_GROUPS.map((group, i) => (
        <div key={group.id}>
          {i > 0 && (
            <div
              data-wf-reveal
              className="wf-connector mx-auto w-px h-7"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <span className="wf-pulse-dot" style={{ left: "-3.5px" }} />
            </div>
          )}
          <button
            type="button"
            onClick={() => onOpenGroup(group)}
            data-wf-reveal
            aria-label={`Stage ${i + 1} of ${WORKFLOW_GROUPS.length}: ${group.title} — watch the video`}
            className="wf-node group relative flex flex-col text-left rounded-2xl border px-5 py-4 w-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E676]"
            style={{
              backgroundColor: hexToRgba(ACTOR_COLOR[group.actor], 0.12),
              borderColor: hexToRgba(ACTOR_COLOR[group.actor], 0.5),
            }}
          >
            <GroupBoxBody
              group={group}
              stageNumber={i + 1}
              watched={watchedChapters.has(group.chapterId)}
              color={ACTOR_COLOR[group.actor]}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

function WatchedBadge() {
  return (
    <span
      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#00E676] text-[#0A1628] shrink-0"
      aria-label="Watched"
      title="Watched"
    >
      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}
