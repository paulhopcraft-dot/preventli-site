"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Vicky Kos",
    role: "Facility Manager",
    company: "St Basils Aged Care",
    industry: "Aged Care",
    size: "120 employees",
    quote:
      "We halved our premium in just two years…we had seen claims rising 20% one year and 30% the next, which was alarming to say the least. We engaged Preventia and within the first twelve months claims had fallen by 30% and our premium also began to decline. Since working with Preventia, we now understand that it's the internal management that counts.",
    rating: 5,
    initials: "VK",
    color: "bg-blue-500",
  },
  {
    name: "Malcolm Ross-Gilder",
    role: "Plant Manager",
    company: "H.B. Fuller Australia",
    industry: "Manufacturing",
    size: "150 employees",
    quote:
      "The team at preVentia was engaged at the time when our organisation did not have a good culture. They supported us in providing a framework to improve our processes from being reactive to proactive, specifically in the management of potential claims. Outside of improving our claims experiences during the time they were engaged, the culture of openness between management and worker improved and continues to do so.",
    rating: 5,
    initials: "MR",
    color: "bg-orange-500",
  },
  {
    name: "Tony Fitzgerald",
    role: "CEO",
    company: "Outlook Disability Services Victoria",
    industry: "Disability Services",
    size: "180 employees",
    quote:
      "What Preventia taught us to do was an entirely new approach to be more proactive in the way we manage our people and block exposure. Through improved hiring and management practices, we have seen costs fall dramatically and this is now to the point where we are now one of the best performers in disability services in Victoria.",
    rating: 5,
    initials: "TF",
    color: "bg-emerald-500",
  },
  {
    name: "George Tahan",
    role: "Managing Director",
    company: "IKON Cleaning Services",
    industry: "Cleaning Services",
    size: "200 employees",
    quote:
      "The preVentia approach has taught us how to block exposure to potential claims and at the same time look after our workforce better. Through improvements in awareness by our supervisors, we are now more proactively managing our cleaners and all have a clear process to follow across our company which is consistent. This has resulted in a premium which is significantly below the industry standard.",
    rating: 5,
    initials: "GT",
    color: "bg-indigo-500",
  },
  {
    name: "Anthony Raffa",
    role: "General Manager",
    company: "Allseps Confectionary",
    industry: "Food Manufacturing",
    size: "110 employees",
    quote:
      "preVentia has been a part of Allseps over 10 years, Allseps has dramatically reduced our workcover levies to become one of the lowest contributers in the food industry. We have also understood clearly how to prevent claims with the help and guidance from preVentia.",
    rating: 5,
    initials: "AR",
    color: "bg-pink-500",
  },
  {
    name: "Ellen Flint",
    role: "General Manager People Development",
    company: "BENETAS",
    industry: "Healthcare",
    size: "300 employees",
    quote:
      "Although our Workers Compensation premium was under control it was the exposure we were facing that preVentia helped us with. The application of the preVentia program produced outstanding results in terms of how we managed our staff from pre-employment through to post-exit. Our managers were already overworked so having a framework in place we could apply consistently made all the difference. We engaged preVentia with our worst performing site against our benchmarks which over a short period of became one of best performing sites!",
    rating: 5,
    initials: "EF",
    color: "bg-teal-500",
  },
  {
    name: "Martin Day",
    role: "CEO",
    company: "St Vincent's Private Hospitals",
    industry: "Healthcare",
    size: "500 employees",
    quote:
      "The introduction of the Preventia Program into our Private Hospitals has seen a vast turnaround in our culture and performance of our people management in particular in relation to the management aspects of our staff Health and Wellbeing. The preVentia program is not a theory. It works",
    rating: 5,
    initials: "MD",
    color: "bg-red-500",
  },
  {
    name: "Graham Church",
    role: "CEO",
    company: "Alpine MDF Industries",
    industry: "Manufacturing",
    size: "140 employees",
    quote:
      "Alpine MDF has been working with preVentia for a number of years now. The goal has always been to get 'win win' outcomes for both the business and the employee and I can say we have been delighted with the outcomes.",
    rating: 5,
    initials: "GC",
    color: "bg-amber-500",
  },
  {
    name: "Peter Vero",
    role: "Managing Director",
    company: "CMR Personnel",
    industry: "Labor Hire",
    size: "250 employees",
    quote:
      "Working with preVentia has allowed us to manage the health and safety of our workforce with greater efficiency. This has led to far less claims over the past 3 years, which in turn has had a dramatic reduction of our Workcover premium!",
    rating: 5,
    initials: "PV",
    color: "bg-cyan-500",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#FF8F00"
          stroke="none"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll carousel
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 3 >= testimonials.length ? 0 : prev + 3));
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);
  const totalPages = Math.ceil(testimonials.length / 3);
  const currentPage = Math.floor(currentIndex / 3);

  return (
    <section className="py-20 bg-[#0A1628]">
      <div
        ref={ref}
        className="section-observe max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-14">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            Client Results
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            Real businesses, real savings
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Don&apos;t take our word for it — here&apos;s what our clients say
            after working with Preventli.
          </p>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {visibleTestimonials.map((t, i) => (
            <div
              key={i}
              className="card-hover bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col"
            >
              {/* Quote mark */}
              <div className="text-[#00E676] text-5xl font-serif leading-none mb-4 opacity-50">
                &ldquo;
              </div>

              <p className="text-gray-300 leading-relaxed flex-1 mb-6 italic">
                {t.quote}
              </p>

              <div className="border-t border-white/10 pt-6">
                <StarRating count={t.rating} />
                <div className="flex items-center gap-3 mt-4">
                  <div
                    className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white text-sm font-bold">
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      {t.name}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {t.role}, {t.company}
                    </div>
                    <div className="text-[#00E676] text-xs mt-0.5">
                      {t.size}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i * 3)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentPage === i
                  ? "bg-[#00E676] w-8"
                  : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap justify-center items-center gap-8 opacity-50">
          {[
            "Safe Work Australia",
            "WorkSafe Victoria",
            "SafeWork NSW",
            "WorkCover QLD",
          ].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 text-gray-400 text-sm"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
