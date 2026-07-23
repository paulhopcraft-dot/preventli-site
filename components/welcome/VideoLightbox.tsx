"use client";

import { useEffect, useRef } from "react";
import type { Chapter } from "@/lib/welcome/chapters";

type Props = {
  chapter: Chapter;
  chapterNumber: number;
  totalChapters: number;
  isTour: boolean;
  onClose: () => void;
  onNextChapter: () => void;
  onPrevChapter: () => void;
};

export default function VideoLightbox({
  chapter,
  chapterNumber,
  totalChapters,
  isTour,
  onClose,
  onNextChapter,
  onPrevChapter,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (isTour && e.key === "ArrowRight") onNextChapter();
      if (isTour && e.key === "ArrowLeft") onPrevChapter();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, onNextChapter, onPrevChapter, isTour]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-sm animate-fade-in-up"
      style={{ animationDuration: "0.25s" }}
      role="dialog"
      aria-modal="true"
      aria-label={`${chapter.title} video`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-12 right-0 sm:top-0 sm:-right-12 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
          {/* TODO(video): set src to the real hosted chapter video. When that
              lands, wire this onEnded handler to onNextChapter() during a
              tour so playback auto-advances without the manual buttons
              below. */}
          <video
            ref={videoRef}
            key={chapter.id}
            className="w-full aspect-video bg-black"
            poster={chapter.poster}
            controls
            preload="none"
            aria-label={`${chapter.title} — video coming soon`}
            onEnded={() => {
              if (isTour) onNextChapter();
            }}
          />

          <div className="flex items-center justify-between gap-4 px-5 py-4 bg-[#0A1628] border-t border-white/10">
            <div>
              <div className="text-white/40 text-xs font-mono uppercase tracking-wide mb-0.5">
                Chapter {chapterNumber} of {totalChapters}
              </div>
              <div className="text-white font-semibold">{chapter.title}</div>
              <p className="text-gray-400 text-sm mt-0.5">{chapter.description}</p>
            </div>

            {isTour && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onPrevChapter}
                  disabled={chapterNumber <= 1}
                  className="w-9 h-9 rounded-full border border-white/15 text-white flex items-center justify-center hover:border-[#00E676] hover:text-[#00E676] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Previous chapter"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={onNextChapter}
                  className="h-9 px-4 rounded-full bg-[#00E676] text-[#0A1628] text-sm font-bold flex items-center justify-center hover:bg-[#00C060] transition-colors"
                >
                  {chapterNumber >= totalChapters ? "Finish" : "Next chapter"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
