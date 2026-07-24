export default function WelcomeHero() {
  return (
    <section className="relative overflow-hidden bg-[#0A1628] pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div className="absolute inset-0 hero-grid" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #00E676 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 mb-8">
          <span className="text-white font-bold text-lg">
            Prevent<span className="text-[#00E676]">li</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
          Welcome to <span className="text-[#00E676]">Preventli</span>
        </h1>
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-2">
          This is your partner workspace.
        </p>
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-10">
          Here&apos;s everything you need to run pre-employment and injury-prevention checks
          through Preventli — start to finish, in about two minutes.
        </p>

        {/* TODO(video): swap for the real ~20s cinematic intro once produced.
            Do not point src at a file that doesn't exist yet — leave it unset
            so the missing-media state below stays visible instead of a
            silent 404. */}
        <div className="relative mx-auto max-w-2xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
          <video
            className="w-full aspect-video bg-black"
            poster="/welcome/video-placeholder.svg"
            controls
            preload="none"
            aria-label="Preventli introduction video — coming soon"
          />
          <div className="pointer-events-none absolute top-3 left-3 bg-[#0A1628]/80 border border-white/10 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full">
            Intro video — coming soon
          </div>
        </div>
      </div>
    </section>
  );
}
