"use client";

import { useEffect, useRef, useState } from "react";
import {
  ACTOR_COLOR,
  ACTOR_LABEL,
  WORKFLOW_NODES,
  type Actor,
  type WorkflowNode,
} from "@/lib/welcome/workflow";
import { CHAPTERS, getChapter } from "@/lib/welcome/chapters";
import { getWatchedChapters, markChapterWatched } from "@/lib/welcome/watched";
import VideoLightbox from "./VideoLightbox";

const AUTOMATIC_ACTORS: Actor[] = ["automatic"];

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ---------------------------------------------------------------------
// Desktop flowchart grid geometry.
//
// 5 grid-column tracks: box | gutter | box | gutter | box
// 13 grid-row tracks: 7 content rows interleaved with 6 connector rows
// (row N's box sits on track 2N+1; the connector between row N and N+1
// sits on track 2N+2).
// ---------------------------------------------------------------------
const COL_TRACK: Record<0 | 1 | 2, string> = { 0: "1 / 2", 1: "3 / 4", 2: "5 / 6" };
const WIDE_TRACK = "2 / 5"; // spans gutter + middle box + gutter, still centered
const FULL_TRACK = "1 / 6";

function rowTrack(row: number): string {
  const start = row * 2 + 1;
  return `${start} / ${start + 1}`;
}
function gapTrack(afterRow: number): string {
  const start = afterRow * 2 + 2;
  return `${start} / ${start + 1}`;
}

const GRID_TEMPLATE_ROWS = "auto 72px auto 72px auto 72px auto 72px auto 72px auto";
const GRID_TEMPLATE_COLUMNS = "1fr 48px 1fr 48px 1fr";

type RowArrow = {
  id: string;
  kind: "solid" | "dashed-reverse";
  gridColumn: string;
  gridRow: string;
};

// Straight, same-row connectors between adjacent boxes.
const ROW_ARROWS: RowArrow[] = [
  { id: "ra-signup-login", kind: "solid", gridColumn: "2 / 3", gridRow: rowTrack(0) },
  { id: "ra-login-dash", kind: "solid", gridColumn: "4 / 5", gridRow: rowTrack(0) },
  { id: "ra-client-jd", kind: "solid", gridColumn: "2 / 3", gridRow: rowTrack(1) },
  { id: "ra-check-send", kind: "solid", gridColumn: "2 / 3", gridRow: rowTrack(2) },
  { id: "ra-opens-completes", kind: "solid", gridColumn: "2 / 3", gridRow: rowTrack(3) },
  // Reminders sits to the right of the candidate steps and feeds back in.
  { id: "ra-reminders-into", kind: "dashed-reverse", gridColumn: "4 / 5", gridRow: rowTrack(3) },
  { id: "ra-report-review", kind: "solid", gridColumn: "2 / 3", gridRow: rowTrack(4) },
  { id: "ra-review-approved", kind: "solid", gridColumn: "4 / 5", gridRow: rowTrack(4) },
];

type Elbow = { id: string; gridRow: string; xSource: number; xTarget: number; straight?: boolean };

// Down-left elbow connectors between rows. x values are percentages across
// the full grid width (matches the roughly 16 / 50 / 84 centers of the
// left / center / right box columns).
const ELBOWS: Elbow[] = [
  { id: "e-dash-client", gridRow: gapTrack(0), xSource: 84, xTarget: 16 },
  { id: "e-jd-check", gridRow: gapTrack(1), xSource: 50, xTarget: 16 },
  { id: "e-send-opens", gridRow: gapTrack(2), xSource: 50, xTarget: 16 },
  { id: "e-completes-report", gridRow: gapTrack(3), xSource: 50, xTarget: 16 },
  { id: "e-approved-notified", gridRow: gapTrack(4), xSource: 84, xTarget: 50 },
];

function elbowPath({ xSource, xTarget, straight }: Elbow): string {
  if (straight || xSource === xTarget) {
    return `M ${xSource} 0 L ${xTarget} 100`;
  }
  return `M ${xSource} 0 L ${xSource} 50 L ${xTarget} 50 L ${xTarget} 100`;
}

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

  function openNode(node: WorkflowNode) {
    setIsTour(false);
    setActiveChapterId(node.chapterId);
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
            Click any stage to watch a short chapter of the walkthrough, or take the full tour
            from start to finish.
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
          <DesktopFlowchart
            watchedChapters={watchedChapters}
            onOpenNode={openNode}
          />
          <MobileStack
            watchedChapters={watchedChapters}
            onOpenNode={openNode}
          />
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
// Desktop — real 2D flowchart (>= sm / 640px)
// ---------------------------------------------------------------------

function DesktopFlowchart({
  watchedChapters,
  onOpenNode,
}: {
  watchedChapters: Set<string>;
  onOpenNode: (node: WorkflowNode) => void;
}) {
  return (
    <div
      className="hidden sm:grid"
      style={{
        gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
        gridTemplateRows: GRID_TEMPLATE_ROWS,
      }}
    >
      {/* Shared arrowhead markers, referenced by every connector below. */}
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
          <marker
            id="wf-arrow-gray"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="rgba(139,152,168,0.75)" />
          </marker>
        </defs>
      </svg>

      {WORKFLOW_NODES.map((node) => (
        <FlowchartNodeBox
          key={node.id}
          node={node}
          watched={watchedChapters.has(node.chapterId)}
          chapterNumber={CHAPTERS.findIndex((c) => c.id === node.chapterId) + 1}
          onClick={() => onOpenNode(node)}
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
            {arrow.kind === "dashed-reverse" ? (
              <line
                x1="92"
                y1="50"
                x2="8"
                y2="50"
                stroke="rgba(139,152,168,0.55)"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                markerEnd="url(#wf-arrow-gray)"
              />
            ) : (
              <>
                <line x1="6" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" markerEnd="url(#wf-arrow-white)" />
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
              </>
            )}
          </svg>
        </div>
      ))}

      {ELBOWS.map((elbow) => (
        <div
          key={elbow.id}
          data-wf-reveal
          className="wf-connector-cell relative"
          style={{ gridColumn: FULL_TRACK, gridRow: elbow.gridRow }}
          aria-hidden
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full block">
            <path d={elbowPath(elbow)} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" markerEnd="url(#wf-arrow-white)" />
            <path
              d={elbowPath(elbow)}
              className="wf-flow-line"
              fill="none"
              stroke="#00E676"
              strokeWidth="2"
              strokeDasharray="5 7"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

function FlowchartNodeBox({
  node,
  watched,
  chapterNumber,
  onClick,
}: {
  node: WorkflowNode;
  watched: boolean;
  chapterNumber: number;
  onClick: () => void;
}) {
  const color = ACTOR_COLOR[node.actor];
  const dashed = AUTOMATIC_ACTORS.includes(node.actor);
  const gridColumn = node.wide ? WIDE_TRACK : COL_TRACK[node.col];
  const delay = node.col * 90;

  return (
    <button
      type="button"
      onClick={onClick}
      data-wf-reveal
      title={`Chapter ${chapterNumber}: watch this stage`}
      className={`wf-node group relative hidden sm:flex flex-col justify-center text-left rounded-xl border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00E676] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E676] min-h-[84px] ${
        dashed ? "border-dashed" : ""
      }`}
      style={{
        gridColumn,
        gridRow: rowTrack(node.row),
        backgroundColor: hexToRgba(color, dashed ? 0.05 : 0.12),
        borderColor: hexToRgba(color, dashed ? 0.35 : 0.5),
        boxShadow: "none",
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 26px -8px rgba(0,230,118,0.25)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-white font-semibold text-[13px] leading-snug">{node.label}</h3>
            {watched && <WatchedBadge />}
          </div>
          <p className="text-gray-400 text-[11px] mt-0.5 leading-snug">{node.detail}</p>
        </div>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 w-6 h-6 rounded-full bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] flex items-center justify-center">
          <svg width="9" height="9" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------
// Mobile — vertical stacked fallback (< sm / 640px)
// ---------------------------------------------------------------------

function MobileStack({
  watchedChapters,
  onOpenNode,
}: {
  watchedChapters: Set<string>;
  onOpenNode: (node: WorkflowNode) => void;
}) {
  return (
    <div className="sm:hidden flex flex-col gap-3">
      {WORKFLOW_NODES.map((node, i) => (
        <div key={node.id}>
          {i > 0 && (
            <div
              data-wf-reveal
              className="wf-connector mx-auto w-px h-6"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <span className="wf-pulse-dot" style={{ left: "-3.5px" }} />
            </div>
          )}
          <MobileNodeCard
            node={node}
            watched={watchedChapters.has(node.chapterId)}
            chapterNumber={CHAPTERS.findIndex((c) => c.id === node.chapterId) + 1}
            onClick={() => onOpenNode(node)}
          />
        </div>
      ))}
    </div>
  );
}

function MobileNodeCard({
  node,
  watched,
  chapterNumber,
  onClick,
}: {
  node: WorkflowNode;
  watched: boolean;
  chapterNumber: number;
  onClick: () => void;
}) {
  const color = ACTOR_COLOR[node.actor];
  const isMuted = AUTOMATIC_ACTORS.includes(node.actor);

  return (
    <button
      type="button"
      onClick={onClick}
      data-wf-reveal
      className={`wf-node group relative text-left rounded-2xl border px-5 py-4 transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E676] w-full sm:w-[420px] mx-auto ${
        isMuted
          ? "border-dashed border-white/15 bg-white/[0.02] hover:border-[#00E676]/50"
          : "border-white/10 bg-white/[0.04] hover:border-[#00E676]/50"
      }`}
      style={{
        boxShadow: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 12px 30px -8px rgba(0,230,118,0.25)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-semibold text-base">{node.label}</h3>
            {watched && <WatchedBadge />}
          </div>
          <p className="text-gray-400 text-sm mt-1 leading-snug">{node.detail}</p>
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[10px] uppercase tracking-wide font-semibold" style={{ color }}>
              {ACTOR_LABEL[node.actor]}
            </span>
            <span className="text-gray-600 text-[10px]">·</span>
            <span className="text-gray-500 text-[10px]">Chapter {chapterNumber}</span>
          </div>
        </div>

        <span className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0 w-8 h-8 rounded-full bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] flex items-center justify-center">
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
    </button>
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
