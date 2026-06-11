import Link from "next/link";
import {
  ArrowRight, Upload, Check, Zap, Star, Code2, Sparkles,
  ShoppingBag, User, Megaphone, Palette, Globe,
  Download, Brush, ChevronDown, ImagePlus, Cpu, Layers, Lock,
} from "lucide-react";
import AnimatedStats from "@/components/AnimatedStats";

/* ── Use-cases — inline styles instead of dynamic Tailwind ── */
const USE_CASES = [
  {
    icon: ShoppingBag, label: "E-commerce",
    desc: "Remove product backgrounds for clean catalog shots and higher conversions.",
    pill: "Most popular",
    bg: "linear-gradient(135deg,#f97316,#e11d48)",
  },
  {
    icon: User, label: "Portraits",
    desc: "Perfect cutouts for LinkedIn headshots, ID photos, and social media profiles.",
    pill: null,
    bg: "linear-gradient(135deg,#7c3aed,#9333ea)",
  },
  {
    icon: Megaphone, label: "Marketing",
    desc: "Quickly isolate subjects for ads, banners, and social content.",
    pill: null,
    bg: "linear-gradient(135deg,#ec4899,#f43f5e)",
  },
  {
    icon: Palette, label: "Graphic Design",
    desc: "Create layered compositions. Replace any background in seconds.",
    pill: null,
    bg: "linear-gradient(135deg,#2dd4bf,#0891b2)",
  },
  {
    icon: Globe, label: "Social Media",
    desc: "Eye-catching posts with zero background noise. Works for Reels & Stories.",
    pill: null,
    bg: "linear-gradient(135deg,#60a5fa,#4f46e5)",
  },
  {
    icon: Code2, label: "Developers",
    desc: "Automate bulk removal via our REST API. Integrate in minutes with any stack.",
    pill: "API access",
    bg: "linear-gradient(135deg,#4ade80,#059669)",
  },
];

/* Demo cards — inline gradient styles */
const DEMO_CARDS = [
  { label: "Product Shot",   sub: "E-commerce",  icon: ShoppingBag, bg: "linear-gradient(135deg,#f97316,#e11d48)" },
  { label: "Portrait",       sub: "Photography", icon: User,         bg: "linear-gradient(135deg,#7c3aed,#9333ea)" },
  { label: "Logo / Icon",    sub: "Branding",    icon: Sparkles,     bg: "linear-gradient(135deg,#3b82f6,#0891b2)" },
  { label: "Object Cutout",  sub: "Design",      icon: Layers,       bg: "linear-gradient(135deg,#10b981,#0891b2)" },
];

const FEATURES = [
  { icon: Cpu,       title: "AI-Powered Engine",  desc: "Removes complex backgrounds like hair, fur, and transparent glass." },
  { icon: Brush,     title: "Brush Editor",        desc: "Fine-tune results manually — erase or restore any part of your image." },
  { icon: Layers,    title: "Background Colors",   desc: "Apply solid colors, keep transparent, or replace with a custom image." },
  { icon: Sparkles,  title: "HD Quality",          desc: "Full-resolution transparent PNGs up to your original file size." },
  { icon: Lock,      title: "Privacy First",       desc: "Free previews run 100% in your browser — photos never leave your device." },
  { icon: ImagePlus, title: "Batch Processing",    desc: "Process thousands of images automatically via our REST API." },
];

const TESTIMONIALS = [
  {
    name: "Sara Chen",  role: "E-commerce founder", avatar: "SC",
    text: "I process 200+ product photos every week. BG Remover saves me hours and the quality is as good as Photoshop.",
  },
  {
    name: "Marcus B.",  role: "Freelance photographer", avatar: "MB",
    text: "The brush editor is a game-changer. I can do touch-ups without leaving the tool. Incredibly fast workflow.",
  },
  {
    name: "Priya M.",   role: "Social media manager", avatar: "PM",
    text: "Used to spend 20 min per image. Now it's 5 seconds and the output is flawless. Absolute must-have.",
  },
];

const FAQS = [
  { q: "Is it really 100% free?", a: "Yes. Non-HD downloads are unlimited and free forever — no account, no watermarks, no time limits. Sign up for 3 free HD downloads per day." },
  { q: "What's the difference between free and HD?", a: "Free (preview) processes your image entirely in the browser using WebAssembly AI — fast and private. HD sends to our server for full-resolution output, ideal for print and commercial use." },
  { q: "Are my images private?", a: "Free preview images never leave your browser. HD images are processed on our secure servers and permanently deleted after delivery." },
  { q: "What formats are supported?", a: "Input: JPG, JPEG, PNG, WEBP up to 12MB. Output: always transparent PNG." },
  { q: "Do credits expire?", a: "Never. Your purchased credits remain valid indefinitely." },
  { q: "Can I use images commercially?", a: "Yes — you own 100% of every processed image for any personal or commercial purpose." },
];

export default function HomePage() {
  return (
    <div className="bg-[#0a0a14] text-white" style={{ overflowX: "hidden" }}>

      {/* ══ HERO ══ */}
      <section className="hero-bg min-h-screen flex items-center justify-center px-4 py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-700/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* badge */}
          <div className="inline-flex items-center gap-2 glass border border-violet-500/25 px-4 py-2 rounded-full text-sm font-semibold text-violet-300 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI-powered · 100% free · No sign-up needed
          </div>

          {/* headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.04] tracking-tight mb-6">
            Remove Any<br />
            Background<br />
            <span className="shimmer-text">Instantly Free</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI strips backgrounds in seconds. No watermarks, no credit card, no limits on preview downloads.
            Used by <strong className="text-white">500K+ designers, sellers & creators</strong> worldwide.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Link href="/tool"
              className="group flex items-center gap-3 bg-violet-600 hover:bg-violet-500 text-white font-black text-lg px-10 py-4 rounded-2xl transition-all shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.03]">
              <Upload size={20} />
              Upload Free — Start Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#how-it-works" className="flex items-center gap-2 text-gray-400 hover:text-white transition font-semibold">
              See how it works <ChevronDown size={16} />
            </Link>
          </div>

          {/* trust badges */}
          <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-500">
            {["No watermarks", "No sign-up for preview", "3 free HD/day on signup", "Credits never expire"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={13} className="text-green-400" /> {t}
              </span>
            ))}
          </div>

          {/* Demo hover cards */}
          <div className="mt-16 flex justify-center gap-4 flex-wrap">
            {[
              { label: "Product",  icon: ShoppingBag, bg: "linear-gradient(135deg,#f97316,#e11d48)" },
              { label: "Portrait", icon: User,         bg: "linear-gradient(135deg,#7c3aed,#9333ea)" },
              { label: "Logo",     icon: Sparkles,     bg: "linear-gradient(135deg,#3b82f6,#0891b2)" },
              { label: "Object",   icon: Layers,       bg: "linear-gradient(135deg,#10b981,#0891b2)" },
            ].map(({ label, icon: Icon, bg }) => (
              <div key={label}
                className="group relative w-32 h-28 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 checker-dark flex items-center justify-center">
                  <Icon size={28} className="text-white/40" />
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-green-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">✓ Removed</div>
                <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-700 group-hover:-translate-x-full"
                  style={{ background: bg }}>
                  <Icon size={28} className="text-white" />
                  <span className="text-[10px] text-white/80 font-bold mt-2">{label}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-600 mt-3">← Hover cards to preview the magic</p>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <AnimatedStats />

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-violet-400 mb-4">
              <Zap size={12} fill="currentColor" /> Simple process
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Remove backgrounds<br /><span className="gradient-text">in 3 steps</span></h2>
            <p className="text-gray-500 max-w-md mx-auto">No software, no skills, no waiting. Entirely in your browser in seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "01", icon: Upload,   title: "Upload",     desc: "Drag & drop or click to upload JPG, PNG, or WEBP. Up to 12MB." },
              { n: "02", icon: Cpu,      title: "AI Removes", desc: "Our AI model detects and removes the background in under 2 seconds." },
              { n: "03", icon: Download, title: "Download",   desc: "Save as transparent PNG. Free forever, no watermarks, no limits." },
            ].map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="relative bg-[#0d0d1f] border border-white/10 rounded-3xl p-8 text-center hover:border-violet-500/30 transition-all group card-hover">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                  <Icon size={26} className="text-white" />
                </div>
                <div className="absolute top-6 right-6 text-[44px] font-black text-white/5 leading-none select-none">{n}</div>
                <h3 className="text-lg font-black text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LIVE DEMO ══ */}
      <section className="py-20 px-4 bg-[#070712]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3">See it in action</h2>
            <p className="text-gray-500">Hover any card to see the transformation</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DEMO_CARDS.map(({ label, sub, icon: Icon, bg }) => (
              <div key={label}
                className="group relative h-44 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/25 transition-all hover:shadow-2xl card-hover">
                <div className="absolute inset-0 checker-dark flex flex-col items-center justify-center gap-2">
                  <Icon size={36} className="text-white/25" />
                  <span className="text-[10px] text-green-400/80 font-bold">Background removed</span>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-transform duration-700 ease-out group-hover:-translate-x-full"
                  style={{ background: bg }}>
                  <Icon size={38} className="text-white" />
                  <div className="text-center">
                    <div className="text-sm font-black text-white">{label}</div>
                    <div className="text-[11px] text-white/60">{sub}</div>
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  ✓ Removed
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/tool"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-black px-8 py-4 rounded-2xl transition hover:scale-[1.02] shadow-lg shadow-violet-500/20">
              <Upload size={17} /> Try it yourself — Free
            </Link>
          </div>
        </div>
      </section>

      {/* ══ USE CASES ══ */}
      <section id="use-cases" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-blue-400 mb-4">
              <Globe size={12} /> Built for everyone
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">One tool,<br /><span className="gradient-text">endless uses</span></h2>
            <p className="text-gray-500 max-w-md mx-auto">From solo creators to enterprise teams — BG Remover fits every workflow.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {USE_CASES.map(({ icon: Icon, label, desc, pill, bg }) => (
              <div key={label}
                className="group bg-[#0d0d1f] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: bg }}>
                    <Icon size={22} className="text-white" />
                  </div>
                  {pill && (
                    <span className="text-white text-[10px] font-black px-2 py-1 rounded-full" style={{ background: bg }}>
                      {pill}
                    </span>
                  )}
                </div>
                <h3 className="text-white font-black text-lg mb-2">{label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-violet-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" className="py-24 px-4 bg-[#070712]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400 mb-4">
              <Sparkles size={12} /> What makes us different
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Everything you need,<br /><span className="gradient-text">nothing you don&apos;t</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all group card-hover">
                <div className="w-11 h-11 bg-violet-500/15 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-500/25 transition-colors">
                  <Icon size={20} className="text-violet-400" />
                </div>
                <h3 className="text-white font-black mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ API SECTION ══ */}
      <section id="api" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 glass border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400 mb-5">
                <Code2 size={12} /> Developer API
              </div>
              <h2 className="text-4xl font-black mb-4">Automate background<br /><span className="gradient-text">removal at scale</span></h2>
              <p className="text-gray-400 leading-relaxed mb-6">Integrate our REST API into your pipeline and process thousands of images automatically. Works with any language, any framework.</p>
              <ul className="space-y-3 mb-8">
                {["1 API call to remove any background", "Process 1 to 100,000+ images", "Up to 50MP resolution support", "JSON response with download URL"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                    <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-emerald-400" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3 rounded-xl transition">
                Get API Access <ArrowRight size={16} />
              </Link>
            </div>

            {/* Code block */}
            <div className="bg-[#060610] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-[#0a0a18]">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs text-gray-600 font-mono">remove-bg.sh</span>
              </div>
              <pre className="p-5 text-sm font-mono leading-7 overflow-x-auto">
                <code>
                  <span className="text-gray-600">{`# One call to remove any background`}</span>{"\n\n"}
                  <span className="text-blue-400">curl</span>
                  <span className="text-yellow-400"> -X POST</span>{" \\\n  "}
                  <span className="text-green-400">https://api.bgremover.app/v1/remove</span>{" \\\n  "}
                  <span className="text-violet-400">-H </span>
                  <span className="text-orange-400">&quot;X-Api-Key: YOUR_KEY&quot;</span>{" \\\n  "}
                  <span className="text-violet-400">-F </span>
                  <span className="text-orange-400">&quot;image=@product.jpg&quot;</span>{" \\\n  "}
                  <span className="text-violet-400">-o </span>
                  <span className="text-orange-400">result.png</span>
                </code>
              </pre>
              <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  200 OK · 1.3s
                </div>
                <span className="text-gray-600 text-xs">REST · JSON · PNG output</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-24 px-4 bg-[#070712]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-yellow-400" fill="currentColor" />)}
            </div>
            <h2 className="text-4xl font-black mb-2">Loved by creators worldwide</h2>
            <p className="text-gray-500">Join 500,000+ professionals who use BG Remover daily</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, role, text, avatar }) => (
              <div key={name} className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6 hover:border-violet-500/20 transition-all card-hover">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={13} className="text-yellow-400" fill="currentColor" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                    {avatar}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{name}</div>
                    <div className="text-gray-600 text-xs">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3">Frequently asked questions</h2>
            <p className="text-gray-500">Can&apos;t find your answer? <a href="mailto:support@bgremover.com" className="text-violet-400 hover:underline">Contact us</a></p>
          </div>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group bg-[#0d0d1f] border border-white/10 hover:border-violet-500/25 rounded-2xl transition-colors">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-bold text-white hover:text-violet-300 transition-colors">
                  {q}
                  <ChevronDown size={16} className="text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-3" />
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-12 text-center overflow-hidden border-glow"
            style={{ background: "linear-gradient(135deg,#6d28d9,#7c3aed,#1d4ed8)" }}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-white/90 text-xs font-bold mb-6">
                <Sparkles size={12} /> Free forever — no credit card
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Remove your first background<br />in 5 seconds
              </h2>
              <p className="text-violet-200 text-lg mb-8 max-w-lg mx-auto">
                No signup, no watermarks, no limits on preview downloads. Sign up for 3 free HD downloads daily.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tool"
                  className="bg-white text-violet-700 font-black px-10 py-4 rounded-2xl hover:bg-violet-50 transition hover:scale-[1.03] shadow-xl flex items-center justify-center gap-2">
                  <Upload size={18} /> Start for Free
                </Link>
                <Link href="/auth/signup"
                  className="bg-white/15 hover:bg-white/25 text-white font-black px-8 py-4 rounded-2xl transition border border-white/20 flex items-center justify-center gap-2">
                  <Zap size={17} fill="currentColor" /> Sign Up for HD
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
