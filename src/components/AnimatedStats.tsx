"use client";
import { useEffect, useRef, useState } from "react";
import { Zap, Clock, Smile, Shield } from "lucide-react";

const STATS = [
  { end: 10, suffix: "M+", label: "Images Processed", icon: Zap, color: "text-violet-400" },
  { end: 2,  suffix: "s",  label: "Average Speed",    icon: Clock, color: "text-blue-400" },
  { end: 500,suffix: "K+", label: "Happy Creators",   icon: Smile, color: "text-emerald-400" },
  { end: 0,  suffix: "",   label: "Watermarks",       icon: Shield, color: "text-pink-400" },
];

function Counter({ end, suffix, run }: { end: number; suffix: string; run: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let start = 0;
    const raf = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1400, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * end));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run, end]);
  return <>{val}{suffix}</>;
}

export default function AnimatedStats() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative bg-[#0d0d1f] border-y border-white/10 py-10 overflow-hidden">
      {/* gradient streak */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-blue-600/5 to-emerald-600/5 pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map(({ end, suffix, label, icon: Icon, color }, i) => (
          <div key={label}
            className={`text-center ${visible ? "anim-fade-up" : "opacity-0"}`}
            style={{ animationDelay: `${i * 0.12}s` }}>
            <div className={`text-4xl md:text-5xl font-black ${color} mb-1 tabular-nums`}>
              <Counter end={end} suffix={suffix} run={visible} />
            </div>
            <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm">
              <Icon size={13} className={color} />
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
