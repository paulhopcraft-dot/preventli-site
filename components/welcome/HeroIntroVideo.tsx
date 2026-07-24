"use client";

import { useRef, useState } from "react";

export default function HeroIntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function start() {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    void v.play();
  }

  return (
    <div className="relative mx-auto max-w-2xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black"
        src="/welcome/intro.mp4"
        poster="/welcome/intro-poster.jpg"
        controls={started}
        preload="metadata"
        aria-label="Preventli introduction video"
        onPlay={() => setStarted(true)}
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label="Play the introduction video"
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/30 hover:bg-black/20 transition-colors cursor-pointer"
        >
          <span className="flex items-center justify-center w-20 h-20 rounded-full bg-[#00E676] shadow-lg shadow-[#00E676]/30 transition-transform hover:scale-110">
            <svg viewBox="0 0 24 24" className="w-9 h-9 ml-1" fill="#0A1628" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="text-white font-semibold text-sm sm:text-base bg-[#0A1628]/70 px-4 py-1.5 rounded-full border border-white/10">
            Watch the intro — 22 seconds
          </span>
        </button>
      )}
    </div>
  );
}
