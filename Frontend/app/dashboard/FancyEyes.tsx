"use client";

import { useEffect, useRef } from "react";

export function FancyEyes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPupil = useRef<HTMLDivElement>(null);
  const rightPupil = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveEyes = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = (e.clientX - cx) / 25;
      const dy = (e.clientY - cy) / 25;

      [leftPupil.current, rightPupil.current].forEach((pupil) => {
        if (pupil) {
          pupil.style.transform = `translate(${dx}px, ${dy}px)`;
        }
      });

      containerRef.current.style.transform = `
        translate(-50%, -50%)
        rotateX(${-dy}deg)
        rotateY(${dx}deg)
      `;
    };

    window.addEventListener("mousemove", moveEyes);
    return () => window.removeEventListener("mousemove", moveEyes);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute left-1/2 top-1/2 hidden md:flex gap-6
                 transition-transform duration-150
                 [perspective:1000px]"
    >
      {/* Eye */}
      {[leftPupil, rightPupil].map((pupilRef, i) => (
        <div
          key={i}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br
                     from-slate-100 to-slate-300
                     shadow-[inset_0_-8px_16px_rgba(0,0,0,0.25),0_20px_40px_rgba(0,0,0,0.4)]
                     border border-slate-400
                     animate-float
                     overflow-hidden"
        >
          {/* Iris */}
          <div
            className="absolute inset-3 rounded-full"
            style={{
              background:
                i === 0
                  ? "conic-gradient(#ff0080,#7928ca,#4338ca,#ff0080)"
                  : "conic-gradient(#0ea5e9,#22c55e,#eab308,#0ea5e9)",
              boxShadow: "inset 0 0 18px rgba(0,0,0,.6)",
            }}
          >
            {/* Pupil */}
            <div
              ref={pupilRef}
              className="absolute left-1/2 top-1/2
                         -translate-x-1/2 -translate-y-1/2
                         w-6 h-6 bg-black rounded-full
                         shadow-[0_0_10px_rgba(0,0,0,0.8)]
                         transition-transform duration-75"
            >
              {/* Reflection */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-80" />
            </div>
          </div>

          {/* Glass shine */}
          <div className="absolute top-2 left-3 w-8 h-4 bg-white/40 rounded-full blur-sm rotate-[-15deg]" />

          {/* Blink */}
          <div className="absolute inset-0 bg-slate-200 origin-top scale-y-0 animate-blink" />
        </div>
      ))}
    </div>
  );
}
