import Link from "next/link";
import {
  ArrowRight, Upload, Check, Zap, Star, Code2, Sparkles,
  ShoppingBag, User, Megaphone, Palette, Globe, Lock,
  Download, Brush, ChevronDown, ImagePlus, Cpu, Layers,
} from "lucide-react";
import AnimatedStats from "@/components/AnimatedStats";

/* ── data ──────────────────────────────────────────── */
const USE_CASES = [
  {
    icon: ShoppingBag, label: "E-commerce",
    desc: "Remove product backgrounds for clean catalog shots. Increase conversions with transparent PNGs.",
    pill: "Most popular",
    from: "from-orange-500", to: "to-rose-600",
    glow: "group-hover:shadow-orange-500/20",
    border: "group-hover:border-orange-500/40",
  },
  {
    icon: User, label: "Portraits",
    desc: "Perfect cutouts for LinkedIn headshots, ID photos, and social media profile pictures.",
    pill: null,
    from: "from-violet-500", to: "to-purple-600",
    glow: "group-hover:shadow-violet-500/20",
    border: "group-hover:border-violet-500/40",
  },
  {
    icon: Megaphone, label: "Marketing",
    desc: "Quickly isolate subjects for ads, banners, and social content. No Photoshop skills needed.",
    pill: null,
    from: "from-pink-500", to: "to-rose-500",
    glow: "group-hover:shadow-pink-500/20",
    border: "group-hover:border-pink-500/40",
  },
  {
    icon: Palette, label: "Graphic Design",
    desc: "Create layered compositions. Replace or add any background colour or image in seconds.",
    pill: null,
    from: "from-teal-400", to: "to-cyan-600",
    glow: "group-hover:shadow-teal-500/20",
    border: "group-hover:border-teal-500/40",
  },
  {
    icon: Globe, label: "Social Media",
    desc: "Eye-catching posts with zero background noise. Works perfectly for Reels, Stories & thumbnails.",
    pill: null,
    from: "from-blue-400", to: "to-indigo-600",
    glow: "group-hover:shadow-blue-500/20",
    border: "group-hover:border-blue-500/40",
  },
  {
    icon: Code2, label: "Developers",
    desc: "Automate bulk removal via our REST API. Integrate in minutes with any stack.",
    pill: "API access",
    from: "from-emerald-400", to: "to-green-600",
    glow: "group-hover:shadow-emerald-500/20",
    border: "group-hover:border-emerald-500/40",
  },
];

const FEATURES = [
  { icon: Cpu,       title: "AI-Powered Engine",    desc: "State-of-the-art model removes even complex backgrounds like hair, fur, and glass." },
  { icon: Brush,     title: "Brush Editor",          desc: "Fine-tune results manually — erase or restore any part of your image with precision." },
  { icon: Layers,    title: "Background Colors",     desc: "Instantly apply solid colors, gradients, or keep it transparent. 8 presets included." },
  { icon: Sparkles,  title: "HD Quality",            desc: "Download full-resolution transparent PNGs up to your original file size." },
  { icon: Lock,      title: "Privacy First",         desc: "Free previews run 100% in your browser. Your photos never touch our servers." },
  { icon: ImagePlus, title: "Batch Processing",      desc: "Process hundreds of images at once via API. Perfect for large product catalogues." },
];

const TESTIMONIALS = [
  {
    name: "Sara Chen",  role: "E-commerce founder",
    text: "I process 200+ product photos every week. BG Remover saves me hours and the quality is just as good as Photoshop.",
    stars: 5, avatar: "SC",
  },
  {
    name: "Marcus B.",  role: "Freelance photographer",
    text: "The brush editor is a game-changer. I can do touch-ups without leaving the tool. Incredibly fast workflow.",
    stars: 5, avatar: "MB",
  },
  {
    name: "Priya M.",   role: "Social media manager",
    text: "Used to spend 20 min per image. Now it takes 5 seconds and the output is flawless. Absolute must-have.",
    stars: 5, avatar: "PM",
  },
];

const FAQS = [
  { q: "Is it really 100% free?", a: "Yes. Non-HD downloads are unlimited and free forever — no account, no watermarks, no time limits. Sign up for 3 free HD downloads per day." },
  { q: "What's the difference between free and HD?", a: "Free (preview) processes your image entirely in the browser using WebAssembly AI — fast and private. HD sends to our server for full-resolution output suitable for print and commercial use." },
  { q: "Do my images get stored?", a: "Free preview images never leave your browser. HD images are processed on our secure servers and permanently deleted after delivery." },
  { q: "What formats are supported?", a: "Input: JPG, JPEG, PNG, WEBP up to 12MB. Output: always transparent PNG." },
  { q: "Do credits expire?", a: "Never. Your purchased credits remain valid indefinitely." },
  { q: "Can I use processed images commercially?", a: "Yes — you own 100% of the output and can use it for any personal or commercial purpose." },
];

/* ── component ──────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="bg-[#0a0a14] text-white overflow-x-hidden">

      {/* ══════════ HERO ══════════ */}
      <section className="hero-bg min-h-[95vh] flex items-center justify-center px-4 py-28 relative overflow-hidden">
        {/* ambient glows */}
        <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-violet-700/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/5 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">

          {/* badge */}
          <div className="anim-fade-in inline-flex items-center gap-2 glass border border-violet-500/25 px-4 py-2 rounded-full text-sm font-semibold text-violet-300 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI-powered · 100% free · No sign-up needed
          </div>

          {/* headline */}
          <h1 className="anim-fade-up d1 text-5xl sm:text-6xl md:text-7xl font-black leading-[1.04] tracking-tight mb-6">
            Remove Any<br />
            Background<br />
            <span className="shimmer-text">Instantly Free</span>
          </h1>

          <p className="anim-fade-up d3 text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI strips backgrounds in seconds. No watermarks, no credit card, no limits on preview downloads.
            Used by <strong className="text-white">500K+ designers, sellers & creators</strong> worldwide.
          </p>

          {/* CTAs */}
          <div className="anim-fade-up d4 flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Link href="/tool"
              className="group flex items-center gap-3 bg-violet-600 hover:bg-violet-500 text-white font-black text-lg px-10 py-4 rounded-2xl transition-all shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.03]">
              <Upload size={20} />
              Upload Free — Start Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#how-it-works"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition font-semibold">
              See how it works <ChevronDown size={16} />
            </Link>
          </div>

          {/* trust badges */}
          <div className="anim-fade-up d5 flex flex-wrap justify-center gap-5 text-sm text-gray-500">
            {["No watermarks", "No sign-up for preview", "3 free HD/day on signup", "Credits never expire"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={13} className="text-green-400" /> {t}
              </span>
            ))}
          </div>

          {/* Demo hover cards */}
          <div className="anim-scale-in d6 mt-16 flex justify-center gap-4 flex-wrap">
            {[
              { label: "Product", icon: ShoppingBag, from: "from-orange-400", to: "to-rose-600" },
              { label: "Portrait", icon: User,        from: "from-violet-400", to: "to-purple-700" },
              { label: "Logo",    icon: Sparkles,     from: "from-blue-400",   to: "to-cyan-600" },
              { label: "Object",  icon: Layers,       from: "from-emerald-400",to: "to-teal-700" },
            ].map(({ label, icon: Icon, from, to }, i) => (
              <div key={label}
                className="group relative w-32 h-28 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/25 transition-all hover:scale-105 hover:shadow-xl"
                style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
                {/* after — transparent checker */}
                <div className="absolute inset-0 checker-dark flex items-center justify-center">
                  <Icon size={28} className="text-white/40" />
                </div>
                {/* after label */}
                <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-green-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">✓ Done</div>
                {/* before overlay slides away */}
                <div className={`absolute inset-0 bg-gradient-to-br ${from} ${to} flex flex-col items-center justify-center transition-transform duration-700 group-hover:-translate-x-full`}>
                  <Icon size={28} className="text-white" />
                  <span className="text-[10px] text-white/80 font-bold mt-2">{label}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-600 mt-3 anim-fade-in d8">← Hover cards to preview the magic</p>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <AnimatedStats />

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-bold text-violet-400 mb-4">
              <Zap size={12} fill="currentColor" /> Simple process
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Remove backgrounds<br /><span className="gradient-text">in 3 steps</span></h2>
            <p className="text-gray-500 max-w-md mx-auto">No software, no skills, no waiting. Entirely in your browser in seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* connector lines */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-violet-600/40 to-blue-600/40" />

            {[
              { n: "01", icon: Upload,    title: "Upload",    desc: "Drag & drop or click to upload JPG, PNG, or WEBP. Up to 12MB." },
              { n: "02", icon: Cpu,       title: "AI Removes", desc: "Our AI model detects and removes the background in under 2 seconds." },
              { n: "03", icon: Download,  title: "Download",  desc: "Save as transparent PNG. Free forever, no watermarks, no limits." },
            ].map(({ n, icon: Icon, title, desc }, i) => (
              <div key={n}
                className={`anim-fade-up relative bg-[#0d0d1f] border border-white/10 rounded-3xl p-8 text-center hover:border-violet-500/30 transition-all group`}
                style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                  <Icon size={26} className="text-white" />
                </div>
                <div className="absolute top-6 right-6 text-[40px] font-black text-white/5 leading-none">{n}</div>
                <h3 className="text-lg font-black text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ LIVE DEMO ══════════ */}
      <section className="py-20 px-4 bg-[#070712]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3">See it in action</h2>
            <p className="text-gray-500">Hover any card to see the transformation</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Product Shot",  sub: "E-commerce",   icon: ShoppingBag, from: "from-orange-500", to: "to-rose-600",   delay: "" },
              { label: "Portrait",       sub: "Photography",  icon: User,         from: "from-violet-500",to: "to-purple-700", delay: "d1" },
              { label: "Logo / Icon",    sub: "Branding",     icon: Sparkles,     from: "from-blue-500",  to: "to-cyan-600",   delay: "d2" },
              { label: "Object Cutout",  sub: "Design",       icon: Layers,       from: "from-emerald-500",to:"to-teal-700",   delay: "d3" },
            ].map(({ label, sub, icon: Icon, from, to, delay }) => (
              <div key={label}
                className={`group relative h-40 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/20 transition-all hover:shadow-2xl anim-scale-in ${delay}`}>
                {/* after state */}
                <div className="absolute inset-0 checker-dark flex items-center justify-center flex-col gap-2">
                  <Icon size={36} className="text-white/30" />
                  <span className="text-[10px] text-green-400/80 font-bold">Background removed</span>
                </div>
                {/* before state slides away */}
                <div className={`absolute inset-0 bg-gradient-to-br ${from} ${to} flex flex-col items-center justify-center gap-2 transition-transform duration-700 ease-out group-hover:-translate-x-full`}>
                  <Icon size={38} className="text-white" />
                  <div className="text-center">
                    <div className="text-sm font-black text-white">{label}</div>
                    <div className="text-[11px] text-white/60">{sub}</div>
                  </div>
                </div>
                {/* hover hint */}
                <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity">
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

      {/* ══════════ USE CASES ══════════ */}
      <section id="use-cases" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-bold text-blue-400 mb-4">
              <Globe size={12} /> Built for everyone
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">One tool,<br /><span className="gradient-text">endless uses</span></h2>
            <p className="text-gray-500 max-w-md mx-auto">From solo creators to enterprise teams — BG Remover fits every workflow.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {USE_CASES.map(({ icon: Icon, label, desc, pill, from, to, glow, border }, i) => (
              <div key={label}
                className={`group bg-[#0d0d1f] border border-white/10 ${border} rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl ${glow} card-hover anim-fade-up`}
                style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${from} ${to} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  {pill && (
                    <span className={`bg-gradient-to-r ${from} ${to} text-white text-[10px] font-black px-2 py-1 rounded-full`}>{pill}</span>
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

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="py-24 px-4 bg-[#070712]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400 mb-4">
              <Sparkles size={12} /> What makes us different
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Everything you need,<br /><span className="gradient-text">nothing you don&apos;t</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div key={title}
                className="grad-border bg-[#0d0d1f] rounded-2xl p-6 border border-white/10 hover:border-transparent transition-all group card-hover anim-fade-up"
                style={{ animationDelay: `${i * 0.09}s` }}>
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

      {/* ══════════ API SECTION ══════════ */}
      <section id="api" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="anim-slide-r">
              <div className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400 mb-5">
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
            <div className="anim-fade-up d2">
              <div className="bg-[#060610] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* window chrome */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-[#0a0a18]">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-3 text-xs text-gray-600 font-mono">remove-bg.sh</span>
                </div>
                {/* code */}
                <pre className="p-5 text-sm font-mono leading-7 overflow-x-auto">
                  <code>
                    <span className="text-gray-600"># One API call to remove any background</span>{"\n"}
                    {"\n"}
                    <span className="text-blue-400">curl</span>{" "}
                    <span className="text-yellow-400">-X POST</span>{" \\\n"}
                    {"  "}
                    <span className="text-green-400">https://api.bgremover.app/v1/remove</span>{" \\\n"}
                    {"  "}
                    <span className="text-violet-400">-H</span>{" "}
                    <span className="text-orange-400">&quot;X-Api-Key: YOUR_KEY&quot;</span>{" \\\n"}
                    {"  "}
                    <span className="text-violet-400">-F</span>{" "}
                    <span className="text-orange-400">&quot;image=@product.jpg&quot;</span>{" \\\n"}
                    {"  "}
                    <span className="text-violet-400">-o</span>{" "}
                    <span className="text-orange-400">result.png</span>{"\n"}
                    {"\n"}
                    <span className="text-gray-600"># Output: transparent PNG, instant delivery</span>
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
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-24 px-4 bg-[#070712]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-5 text-yellow-400 mb-4 justify-center">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
            </div>
            <h2 className="text-4xl font-black mb-2">Loved by creators worldwide</h2>
            <p className="text-gray-500">Join 500,000+ professionals who use BG Remover daily</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, role, text, stars, avatar }, i) => (
              <div key={name}
                className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6 hover:border-violet-500/25 transition-all card-hover anim-fade-up"
                style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(stars)].map((_, j) => <Star key={j} size={13} className="text-yellow-400" fill="currentColor" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-black">
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

      {/* ══════════ FAQ ══════════ */}
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
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-3">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-violet-600 via-violet-700 to-blue-700 rounded-3xl p-12 text-center overflow-hidden border-glow">
            {/* bg glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.12),transparent)] pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />

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
