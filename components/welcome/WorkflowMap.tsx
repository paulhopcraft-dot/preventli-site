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

export default function WorkflowMap() {
  const [watchedChapters, setWatchedChapters] = useState<Set<string>>(new Set());
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [isTour, setIsTour] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const activeChapter = activeChapterId ? getChapter(activeChapterId) : undefined;
  const activeChapterIndex = activeChapter
    ? CHAPTERS.findIndex((c) => c.id === activeChapter.id)
    : -1;

  return (
    <section id="how-it-works" className="py-20 bg-[#0A1628]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10">
          {(Object.keys(ACTOR_LABEL) as Actor[]).map((actor) => (
            <div key={actor} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: ACTOR_COLOR[actor] }}
              />
              <span className="text-gray-300 text-xs sm:text-sm font-medium">
                {ACTOR_LABEL[actor]}
              </span>
            </div>
          ))}
        </div>

        {/* Take the full tour */}
        <div className="flex justify-center mb-14">
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

        {/* Map */}
        <div ref={containerRef} className="relative">
          <div className="flex flex-col gap-3">
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
                <WorkflowNodeCard
                  node={node}
                  watched={watchedChapters.has(node.chapterId)}
                  chapterNumber={CHAPTERS.findIndex((c) => c.id === node.chapterId) + 1}
                  onClick={() => {
                    setIsTour(false);
                    setActiveChapterId(node.chapterId);
                  }}
                />
              </div>
            ))}
          </div>
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

function WorkflowNodeCard({
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
      className={`wf-node group relative text-left rounded-2xl border px-5 py-4 transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E676] ${
        node.fullWidth ? "w-full" : "w-full sm:w-[420px] mx-auto"
      } ${
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
            {watched && (
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#00E676] text-[#0A1628] shrink-0"
                aria-label="Watched"
                title="Watched"
              >
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
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

        <span className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 w-8 h-8 rounded-full bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] flex items-center justify-center">
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
    </button>
  );
}
