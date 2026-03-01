"use client";

import { useEffect, useRef, useState } from "react";

const doctors = [
  { name: "Dr. Sarah Chen", specialty: "Occupational Medicine", image: "👩‍⚕️" },
  { name: "Dr. Michael Torres", specialty: "General Practice", image: "👨‍⚕️" },
  { name: "Dr. Emily Watson", specialty: "Mental Health", image: "👩‍⚕️" },
  { name: "Dr. James Park", specialty: "Injury Prevention", image: "👨‍⚕️" },
  { name: "Physio Alex", specialty: "Physical Rehabilitation", image: "🧑‍⚕️" },
];

const services = [
  { icon: "📋", title: "Pre-Employment", desc: "Health assessments for new starters" },
  { icon: "🦺", title: "Injury Prevention", desc: "Ergonomic reviews & risk assessments" },
  { icon: "🧠", title: "Mental Health", desc: "Stress, anxiety & wellbeing support" },
  { icon: "🚪", title: "Exit Assessments", desc: "End-of-employment health reviews" },
  { icon: "💚", title: "General Wellbeing", desc: "Ongoing health & lifestyle support" },
];

export default function OnlineDoctor() {
  const ref = useRef<HTMLDivElement>(null);
  const [currentDoctor, setCurrentDoctor] = useState(0);

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

  // Rotate through doctors
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDoctor((prev) => (prev + 1) % doctors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const doctor = doctors[currentDoctor];

  return (
    <section id="online-doctor" className="py-20 bg-gradient-to-b from-[#F8F9FA] to-white">
      <div
        ref={ref}
        className="section-observe max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
              Telehealth Network
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-6">
              Your online doctor —<br />
              <span className="text-[#00E676]">available when you need one</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Access our national network of telehealth doctors instantly. 
              No waiting rooms, no delays. Get expert medical assessments 
              and clearances from anywhere in Australia.
            </p>

            {/* Services grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
              {services.map((service, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center hover:border-[#00E676] transition-colors cursor-pointer">
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <h3 className="font-bold text-[#0A1628] text-sm mb-1">{service.title}</h3>
                  <p className="text-gray-500 text-xs">{service.desc}</p>
                </div>
              ))}
            </div>

            {/* Three access points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-[#00E676] transition-colors cursor-pointer">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-bold text-[#0A1628] mb-2">Chat Now</h3>
                <p className="text-gray-500 text-sm">
                  Start immediately with our AI health assistant. Doctor reviews within 24 hours.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-[#00E676] transition-colors cursor-pointer">
                <div className="text-3xl mb-3">📹</div>
                <h3 className="font-bold text-[#0A1628] mb-2">Video Call</h3>
                <p className="text-gray-500 text-sm">
                  Book a telehealth video consultation with a doctor from our national network.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-[#00E676] transition-colors cursor-pointer">
                <div className="text-3xl mb-3">🏥</div>
                <h3 className="font-bold text-[#0A1628] mb-2">Face-to-Face</h3>
                <p className="text-gray-500 text-sm">
                  Book an in-person appointment at a clinic near you.
                </p>
              </div>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#00E676] text-[#0A1628] px-6 py-3 rounded-full font-semibold hover:bg-[#00ff84] transition-colors"
            >
              Talk to a Doctor Today
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Right: Doctor rotation card */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 w-80 text-center border border-gray-100">
                <div className="w-20 h-20 bg-[#00E676]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl">
                  {doctor.image}
                </div>
                <div className="text-xs text-[#00E676] font-semibold uppercase tracking-wider mb-2">
                  Available Now
                </div>
                <h3 className="text-xl font-bold text-[#0A1628] mb-1">
                  {doctor.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  {doctor.specialty}
                </p>
                <div className="flex gap-3 justify-center">
                  <button className="flex-1 bg-[#00E676] text-[#0A1628] py-3 rounded-xl font-semibold hover:bg-[#00ff84] transition-colors">
                    Book
                  </button>
                  <button className="flex-1 border border-[#0A1628] text-[#0A1628] py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    Chat
                  </button>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-100">
                <span className="text-sm font-semibold text-[#0A1628]">🇦🇺 Australia-wide</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-100">
                <span className="text-sm font-semibold text-[#0A1628]">⚡ 24hr response</span>
              </div>

              {/* Doctor rotation indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {doctors.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentDoctor ? "bg-[#00E676]" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
