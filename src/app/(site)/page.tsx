import Link from "next/link";
import {
  ArrowRight, Upload, Check, Zap, Star, Code2, Sparkles,
  ShoppingBag, User, Megaphone, Palette, Globe,
  Download, Brush, ChevronDown, Cpu, Layers, Lock, ImagePlus,
} from "lucide-react";
import AnimatedStats from "@/components/AnimatedStats";

const USE_CASES = [
  { icon: ShoppingBag, label: "E-commerce",    desc: "Clean product shots that boost conversions.", color: "#f97316" },
  { icon: User,        label: "Portraits",      desc: "Perfect cutouts for LinkedIn, IDs & profiles.", color: "#7c3aed" },
  { icon: Megaphone,   label: "Marketing",      desc: "Isolate subjects for ads, banners & social.", color: "#ec4899" },
  { icon: Palette,     label: "Graphic Design", desc: "Layer compositions, replace any background.", color: "#0891b2" },
  { icon: Globe,       label: "Social Media",   desc: "Eye-catching posts for Reels & Stories.", color: "#3b82f6" },
  { icon: Code2,       label: "Developers",     desc: "Automate via REST API. Integrate in minutes.", color: "#10b981" },
];

const STEPS = [
  { n: "1", icon: Upload,   title: "Upload",     desc: "Drag & drop JPG, PNG, or WEBP up to 12MB.", color: "#7c3aed" },
  { n: "2", icon: Cpu,      title: "AI Removes", desc: "AI removes the background in under 2 seconds.", color: "#3b82f6" },
  { n: "3", icon: Download, title: "Download",   desc: "Save as transparent PNG, free, no watermarks.", color: "#10b981" },
];

const FEATURES = [
  { icon: Cpu,       title: "AI-Powered Engine",  desc: "Removes complex backgrounds — hair, fur, glass.", color: "#7c3aed" },
  { icon: Brush,     title: "Brush Editor",        desc: "Fine-tune results manually in the browser.", color: "#ec4899" },
  { icon: Layers,    title: "Background Fill",     desc: "Keep transparent, solid color, or custom image.", color: "#3b82f6" },
  { icon: Sparkles,  title: "HD Quality",          desc: "Full-res transparent PNGs, up to 50MP.", color: "#f97316" },
  { icon: Lock,      title: "Privacy First",       desc: "Free previews run 100% in browser — private.", color: "#10b981" },
  { icon: ImagePlus, title: "Batch via API",       desc: "Process thousands automatically via REST.", color: "#0891b2" },
];

const TESTIMONIALS = [
  { name: "Sara Chen",  role: "E-commerce founder",      avatar: "SC", text: "I process 200+ product photos a week. BG Remover saves hours — quality rivals Photoshop." },
  { name: "Marcus B.",  role: "Freelance photographer",  avatar: "MB", text: "The brush editor is a game-changer. Touch-ups without leaving the tool. Insanely fast." },
  { name: "Priya M.",   role: "Social media manager",    avatar: "PM", text: "Used to spend 20 min per image. Now it's 5 seconds and the output is flawless." },
];

const FAQS = [
  { q: "Is it really 100% free?",              a: "Yes. Non-HD (preview) downloads are unlimited and free forever — no account, no watermarks. Sign up for 3 free HD downloads per day." },
  { q: "Free vs HD — what's the difference?",  a: "Free runs entirely in your browser using WebAssembly AI — fast and private. HD sends to our server for full-resolution output, ideal for print and commercial use." },
  { q: "Are my images private?",               a: "Free preview images never leave your browser. HD images are processed on secure servers and permanently deleted after delivery." },
  { q: "What formats are supported?",          a: "Input: JPG, JPEG, PNG, WEBP up to 12MB. Output: always transparent PNG." },
  { q: "Do credits expire?",                   a: "Never. Your purchased credits stay valid indefinitely — no rush, no pressure." },
  { q: "Can I use images commercially?",       a: "Yes — you own 100% of every processed image for any personal or commercial purpose." },
];

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900">

      {/* ── HERO ── */}
      <section className="hero-gradient py-16 px-4 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-40 pointer-events-none"
          style={{ background: "radial-gradient(circle,#c4b5fd,transparent)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle,#93c5fd,transparent)", transform: "translate(-30%,30%)" }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle,#a78bfa,transparent)", transform: "translate(-50%,-50%)" }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left: Text + CTAs */}
            <div className="anim-up">
              <div className="inline-flex items-center gap-2 bg-white/80 border border-violet-200 text-violet-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                AI-powered · 100% free · No sign-up needed
              </div>

              <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-5 text-gray-900">
                Remove Any<br />
                Background<br />
                <span className="shimmer-text">Instantly Free</span>
              </h1>

              <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
                AI strips backgrounds in under 2 seconds. No watermarks, no credit card, no limits on free previews.
                Trusted by <strong className="text-gray-800">500K+ designers & creators</strong>.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {["No watermarks", "No sign-up needed", "3 free HD/day", "Credits never expire"].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-sm text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm font-medium">
                    <Check size={12} className="text-green-500 flex-shrink-0" /> {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/tool"
                  className="btn-primary flex items-center justify-center gap-2 font-black text-base px-8 py-4 rounded-2xl">
                  <Upload size={18} />
                  Remove Background Free
                  <ArrowRight size={16} />
                </Link>
                <Link href="/auth/signup"
                  className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-violet-400 text-gray-700 hover:text-violet-700 font-bold text-base px-6 py-4 rounded-2xl transition-all shadow-sm hover:shadow-md">
                  <Zap size={16} className="text-violet-600" />
                  Get HD Free
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["SC","MB","PM","JL"].map((a, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white"
                      style={{ background: ["linear-gradient(135deg,#7c3aed,#a855f7)","linear-gradient(135deg,#3b82f6,#0891b2)","linear-gradient(135deg,#f97316,#ec4899)","linear-gradient(135deg,#10b981,#3b82f6)"][i] }}>
                      {a}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} className="text-yellow-400" fill="currentColor" />)}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Loved by 500,000+ users</div>
                </div>
              </div>
            </div>

            {/* Right: Upload Zone Visual */}
            <div className="relative anim-up d2">
              {/* Main card */}
              <div className="relative bg-white rounded-3xl p-5 border border-gray-200/80"
                style={{ boxShadow: "0 8px 40px rgba(124,58,237,0.15), 0 2px 8px rgba(0,0,0,0.06)" }}>

                {/* Top bar */}
                <div className="flex items-center gap-2 mb-4 px-1">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="flex-1 ml-2 h-6 bg-gray-100 rounded-lg flex items-center px-3">
                    <span className="text-[10px] text-gray-400 font-mono">bgremover.app/tool</span>
                  </div>
                </div>

                {/* Upload zone */}
                <Link href="/tool">
                  <div className="border-2 border-dashed border-violet-300 bg-gradient-to-br from-violet-50/80 to-blue-50/80 rounded-2xl p-7 text-center cursor-pointer hover:border-violet-500 hover:from-violet-50 hover:to-blue-50 transition-all group">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)", boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}>
                      <Upload size={28} className="text-white" />
                    </div>
                    <p className="text-gray-900 font-black text-base mb-1">Drop your image here</p>
                    <p className="text-gray-400 text-sm mb-3">or click to browse files</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {["JPG", "PNG", "WEBP"].map(f => (
                        <span key={f} className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">{f}</span>
                      ))}
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Up to 12MB</span>
                    </div>
                  </div>
                </Link>

                {/* Before / After preview */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      <span className="text-[10px] font-bold text-gray-500 tracking-wide">ORIGINAL</span>
                    </div>
                    <div className="h-20 flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
                      <ShoppingBag size={30} className="text-orange-400" />
                    </div>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-emerald-200">
                    <div className="bg-emerald-50 px-3 py-1.5 border-b border-emerald-200 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-600 tracking-wide">REMOVED</span>
                    </div>
                    <div className="h-20 flex items-center justify-center checker">
                      <ShoppingBag size={30} className="text-gray-700" />
                    </div>
                  </div>
                </div>

                {/* Status bar */}
                <div className="mt-3 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-gray-800">Background removed in 1.2s</div>
                    <div className="text-[10px] text-gray-400">Transparent PNG ready</div>
                  </div>
                  <span className="text-[10px] font-black text-white px-3 py-1.5 rounded-lg flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                    Download
                  </span>
                </div>
              </div>

              {/* Floating badge — top right */}
              <div className="absolute -top-5 -right-3 bg-white rounded-2xl px-4 py-2 border border-gray-100 float"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={9} className="text-yellow-400" fill="currentColor" />)}
                  </div>
                  <span className="text-xs font-black text-gray-800">500K+ users</span>
                </div>
              </div>

              {/* Floating badge — bottom left */}
              <div className="absolute -bottom-5 -left-3 bg-white rounded-2xl px-3 py-2.5 border border-gray-100 float"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)", animationDelay: "1.5s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10b981,#3b82f6)" }}>
                    <Zap size={13} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-800">AI Processing</div>
                    <div className="text-[9px] text-emerald-600 font-bold">Under 2 seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <AnimatedStats />

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-3 py-1.5 rounded-full text-xs font-bold mb-4">
              <Zap size={12} fill="currentColor" /> Simple 3-step process
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              Remove backgrounds<br /><span className="gradient-text">in 3 steps</span>
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">No software, no skills, no waiting. Done in your browser.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map(({ n, icon: Icon, title, desc, color }) => (
              <div key={n} className="relative bg-white rounded-3xl p-8 text-center card-shadow border border-gray-100">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: `linear-gradient(135deg,${color}22,${color}11)`, border: `2px solid ${color}33` }}>
                  <Icon size={26} style={{ color }} />
                </div>
                <div className="absolute top-5 right-6 text-5xl font-black text-gray-100 leading-none select-none">{n}</div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── LIVE DEMO ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3 text-gray-900">See it in action</h2>
            <p className="text-gray-500">Hover any card to see the transformation</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Product Shot",  sub: "E-commerce",  icon: ShoppingBag, bg: "linear-gradient(135deg,#f97316,#ef4444)" },
              { label: "Portrait",      sub: "Photography", icon: User,         bg: "linear-gradient(135deg,#7c3aed,#a855f7)" },
              { label: "Logo / Icon",   sub: "Branding",    icon: Sparkles,     bg: "linear-gradient(135deg,#3b82f6,#0891b2)" },
              { label: "Object Cutout", sub: "Design",      icon: Layers,       bg: "linear-gradient(135deg,#10b981,#3b82f6)" },
            ].map(({ label, sub, icon: Icon, bg }) => (
              <div key={label}
                className="group relative h-44 rounded-2xl overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-violet-400 transition-all hover:shadow-xl">
                <div className="absolute inset-0 checker flex flex-col items-center justify-center gap-2">
                  <Icon size={36} className="text-gray-300" />
                  <span className="text-[10px] text-green-600 font-bold">BG Removed</span>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-transform duration-700 ease-out group-hover:-translate-x-full"
                  style={{ background: bg }}>
                  <Icon size={38} className="text-white" />
                  <div className="text-center">
                    <div className="text-sm font-black text-white">{label}</div>
                    <div className="text-[11px] text-white/70">{sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/tool"
              className="btn-primary inline-flex items-center gap-2 font-black px-8 py-4 rounded-2xl">
              <Upload size={17} /> Try it yourself — Free
            </Link>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── USE CASES ── */}
      <section id="use-cases" className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold mb-4">
              <Globe size={12} /> Built for everyone
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              One tool,<br /><span className="gradient-text">endless uses</span>
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">From solo creators to enterprise teams.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {USE_CASES.map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="group bg-white rounded-2xl p-6 card-shadow border border-gray-100">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}18`, border: `1.5px solid ${color}30` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-gray-900 font-black text-lg mb-2">{label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold mb-4">
              <Sparkles size={12} /> What makes us different
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              Everything you need,<br /><span className="gradient-text">nothing you don&apos;t</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}18`, border: `1.5px solid ${color}30` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="text-gray-900 font-black mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── API ── */}
      <section id="api" className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold mb-5">
                <Code2 size={12} /> Developer API
              </div>
              <h2 className="text-4xl font-black mb-4 text-gray-900">
                Automate removal<br /><span className="gradient-text">at scale</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">Integrate our REST API into any pipeline. Process thousands automatically in any language.</p>
              <ul className="space-y-3 mb-8">
                {["1 API call per background removal", "Process 1 to 100,000+ images", "Up to 50MP resolution", "JSON response with download URL"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-gray-700 text-sm">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-100">
                      <Check size={11} className="text-emerald-600" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing"
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-black px-6 py-3 rounded-xl transition">
                Get API Access <ArrowRight size={16} />
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-200 bg-gray-50">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-gray-400 font-mono">remove-bg.sh</span>
              </div>
              <pre className="p-5 text-sm font-mono leading-7 overflow-x-auto bg-gray-900 text-gray-100">
                <code>
                  <span className="text-gray-500">{`# Remove any background in one call`}</span>{"\n\n"}
                  <span className="text-blue-400">curl</span>
                  <span className="text-yellow-300"> -X POST</span>{" \\\n  "}
                  <span className="text-green-400">https://api.bgremover.app/v1/remove</span>{" \\\n  "}
                  <span className="text-violet-400">-H </span>
                  <span className="text-orange-300">&quot;X-Api-Key: YOUR_KEY&quot;</span>{" \\\n  "}
                  <span className="text-violet-400">-F </span>
                  <span className="text-orange-300">&quot;image=@photo.jpg&quot;</span>{" \\\n  "}
                  <span className="text-violet-400">-o </span>
                  <span className="text-orange-300">result.png</span>
                </code>
              </pre>
              <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  200 OK · 1.3s
                </div>
                <span className="text-gray-400 text-xs">REST · JSON · PNG</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-yellow-400" fill="currentColor" />)}
            </div>
            <h2 className="text-4xl font-black mb-2 text-gray-900">Loved by creators worldwide</h2>
            <p className="text-gray-500">Join 500,000+ professionals who use BG Remover daily</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, role, text, avatar }) => (
              <div key={name} className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={13} className="text-yellow-400" fill="currentColor" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                    {avatar}
                  </div>
                  <div>
                    <div className="text-gray-900 font-bold text-sm">{name}</div>
                    <div className="text-gray-400 text-xs">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3 text-gray-900">Frequently asked questions</h2>
            <p className="text-gray-500">Can&apos;t find your answer? <a href="mailto:support@bgremover.com" className="text-violet-600 hover:underline">Contact us</a></p>
          </div>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group bg-white border border-gray-200 hover:border-violet-300 rounded-2xl transition-colors">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-bold text-gray-900 hover:text-violet-700 transition-colors">
                  {q}
                  <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3" />
                </summary>
                <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-12 text-center overflow-hidden"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9,#1d4ed8)" }}>
            <div className="absolute inset-0 opacity-20"
              style={{ background: "radial-gradient(ellipse at top,rgba(255,255,255,0.3),transparent)" }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-white text-xs font-bold mb-6">
                <Sparkles size={12} /> Free forever — no credit card
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Remove your first<br />background in 5 seconds
              </h2>
              <p className="text-violet-200 text-lg mb-8 max-w-lg mx-auto">
                No signup, no watermarks, no limits on previews.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tool"
                  className="bg-white text-violet-700 font-black px-10 py-4 rounded-2xl hover:bg-violet-50 transition shadow-xl flex items-center justify-center gap-2">
                  <Upload size={18} /> Start for Free
                </Link>
                <Link href="/auth/signup"
                  className="bg-white/15 hover:bg-white/25 text-white font-black px-8 py-4 rounded-2xl transition border border-white/30 flex items-center justify-center gap-2">
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
