import Link from "next/link";
import { ArrowRight, Check, Zap, Shield, Star, Clock, Upload, Sparkles, Image as ImageIcon, ShoppingBag, User, Briefcase, Camera, Palette, ChevronDown } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-[#0a0a14] text-white">

      {/* ── HERO ── */}
      <section className="hero-bg min-h-[92vh] flex items-center justify-center px-4 py-24 relative overflow-hidden">
        {/* glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-semibold text-violet-300 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            100% Free · No Sign Up · Instant Results
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            Remove Image<br />
            <span className="gradient-text">Background Free</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            AI removes backgrounds in seconds. Free forever, no watermarks, no credit card. Used by 500K+ designers, sellers & creators.
          </p>

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

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {["No watermarks", "No sign-up needed", "3 free HD/day after sign-up", "Credits never expire"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={13} className="text-green-400" /> {t}
              </span>
            ))}
          </div>

          {/* floating preview cards */}
          <div className="mt-16 flex justify-center gap-6 flex-wrap">
            {[
              { label: "Product", color: "from-orange-500/30 to-red-500/30" },
              { label: "Portrait", color: "from-violet-500/30 to-blue-500/30" },
              { label: "Logo", color: "from-green-500/30 to-teal-500/30" },
            ].map((c, i) => (
              <div key={c.label} className="glass rounded-2xl p-4 w-32 text-center float" style={{ animationDelay: `${i * 0.8}s` }}>
                <div className={`w-full h-20 rounded-xl bg-gradient-to-br ${c.color} mb-2 flex items-center justify-center`}>
                  <ImageIcon size={24} className="text-white/60" />
                </div>
                <p className="text-xs text-gray-400">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 px-4 bg-[#0d0d1f] border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "500K+", label: "Images Processed" },
            { val: "99%", label: "Accuracy Rate" },
            { val: "< 5s", label: "Processing Time" },
            { val: "Free", label: "Forever Always" },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black gradient-text mb-1">{s.val}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4 bg-[#0a0a14]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-violet-400 font-bold text-sm tracking-widest uppercase mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Remove Background in <span className="gradient-text">3 Steps</span></h2>
            <p className="text-gray-500 max-w-xl mx-auto">No skills needed. Our AI does everything automatically in seconds.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "01", icon: Upload, title: "Upload Your Image", desc: "Drag & drop or click to upload. JPG, PNG, WEBP up to 12MB.", color: "text-violet-400 bg-violet-500/10" },
              { n: "02", icon: Sparkles, title: "AI Removes Background", desc: "Our AI instantly detects the subject and removes the background with precision.", color: "text-blue-400 bg-blue-500/10" },
              { n: "03", icon: ArrowRight, title: "Download Free", desc: "Get your transparent PNG instantly. Free download, no watermark.", color: "text-green-400 bg-green-500/10" },
            ].map(s => (
              <div key={s.n} className="glass rounded-3xl p-8 card-hover">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center`}>
                    <s.icon size={22} />
                  </div>
                  <span className="text-4xl font-black text-white/10">{s.n}</span>
                </div>
                <h3 className="text-lg font-black text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-24 px-4 bg-[#0d0d1f]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-violet-400 font-bold text-sm tracking-widest uppercase mb-3">Use Cases</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Perfect For <span className="gradient-text">Every Need</span></h2>
            <p className="text-gray-500 max-w-xl mx-auto">From e-commerce to social media, BG Remover helps professionals and creators worldwide.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: ShoppingBag, title: "E-Commerce", desc: "Clean product photos with transparent backgrounds for your online store.", color: "from-orange-600/20 to-red-600/20 border-orange-500/20" },
              { icon: User, title: "Profile Photos", desc: "Perfect headshots and profile pictures with custom backgrounds.", color: "from-violet-600/20 to-purple-600/20 border-violet-500/20" },
              { icon: Briefcase, title: "Marketing", desc: "Create stunning banners, ads and marketing materials effortlessly.", color: "from-blue-600/20 to-cyan-600/20 border-blue-500/20" },
              { icon: Camera, title: "Photography", desc: "Replace or remove backgrounds from any portrait or landscape photo.", color: "from-green-600/20 to-teal-600/20 border-green-500/20" },
              { icon: Palette, title: "Graphic Design", desc: "Isolate subjects for posters, logos and creative compositions.", color: "from-pink-600/20 to-rose-600/20 border-pink-500/20" },
              { icon: ImageIcon, title: "Social Media", desc: "Eye-catching images for Instagram, Facebook, TikTok and more.", color: "from-yellow-600/20 to-amber-600/20 border-yellow-500/20" },
            ].map(u => (
              <div key={u.title} className={`rounded-3xl p-7 border bg-gradient-to-br ${u.color} card-hover`}>
                <u.icon size={28} className="text-white/70 mb-4" />
                <h3 className="font-black text-white mb-2">{u.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 bg-[#0a0a14]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-violet-400 font-bold text-sm tracking-widest uppercase mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Why <span className="gradient-text">BG Remover</span> is #1</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Zap, title: "Lightning Fast AI", desc: "Background removed in under 5 seconds using the latest AI models.", badge: "5s avg" },
              { icon: Shield, title: "100% Private", desc: "Preview images processed in your browser. HD images never stored.", badge: "Zero storage" },
              { icon: Star, title: "HD Full Resolution", desc: "Download full-resolution PNG with transparent background. No quality loss.", badge: "Full HD" },
              { icon: Clock, title: "Free Forever", desc: "Unlimited free previews, 3 HD downloads daily after sign-up. No hidden fees.", badge: "Always free" },
              { icon: Sparkles, title: "Manual Brush Tool", desc: "Fine-tune results with our manual brush tool. Erase or restore any area.", badge: "New" },
              { icon: ImageIcon, title: "Custom Backgrounds", desc: "Add solid colour, gradient or custom image backgrounds after removal.", badge: "Pro feature" },
            ].map(f => (
              <div key={f.title} className="glass rounded-2xl p-6 flex gap-4 card-hover">
                <div className="w-11 h-11 bg-violet-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <f.icon size={20} className="text-violet-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-white">{f.title}</h3>
                    <span className="bg-violet-500/20 text-violet-300 text-xs font-bold px-2 py-0.5 rounded-full">{f.badge}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE vs SIGNED IN ── */}
      <section className="py-24 px-4 bg-[#0d0d1f]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Start Free. <span className="gradient-text">Always.</span></h2>
            <p className="text-gray-500">No tricks. No hidden costs. Genuinely free.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-3xl p-8">
              <div className="text-2xl font-black text-white mb-1">Free</div>
              <div className="text-gray-500 text-sm mb-6">No account needed · Start instantly</div>
              <ul className="space-y-3 mb-8">
                {["Unlimited background removal", "Free preview download (optimised)", "No watermarks ever", "JPG, PNG, WEBP support", "Manual brush refinement"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 bg-green-500/15 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-green-400" />
                    </div> {f}
                  </li>
                ))}
              </ul>
              <Link href="/tool" className="block w-full text-center glass border border-white/20 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition">
                Start Free Now
              </Link>
            </div>

            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-violet-600 to-blue-600 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute -top-3 right-6 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full">BEST VALUE</div>
              <div className="text-2xl font-black text-white mb-1">Free Account</div>
              <div className="text-violet-200 text-sm mb-6">Sign up free · No card needed</div>
              <ul className="space-y-3 mb-8">
                {["Everything in Free", "3 full HD downloads daily (free)", "Full resolution transparent PNG", "Credits never expire", "Download history & dashboard", "Priority processing"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-violet-100">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-white" />
                    </div> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="block w-full text-center bg-white text-violet-700 py-3 rounded-xl font-black hover:bg-violet-50 transition">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 bg-[#0a0a14]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Loved by <span className="gradient-text">Creators</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Sarah M.", role: "E-commerce seller", text: "I process 50+ product images daily. BG Remover saves me hours every week and the quality is incredible.", stars: 5 },
              { name: "James K.", role: "Graphic designer", text: "The AI accuracy is outstanding. Even complex hair and transparent objects come out perfectly.", stars: 5 },
              { name: "Priya R.", role: "Social media manager", text: "Free, fast and no watermarks. I switched from remove.bg and saved $30/month.", stars: 5 },
            ].map(t => (
              <div key={t.name} className="glass rounded-2xl p-6 card-hover">
                <div className="flex gap-0.5 mb-3">
                  {Array(t.stars).fill(0).map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO FAQ ── */}
      <section className="py-24 px-4 bg-[#0d0d1f]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Frequently Asked <span className="gradient-text">Questions</span></h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Is BG Remover really free?", a: "Yes — 100% free. Unlimited preview downloads with no watermarks. Sign up (free) to get 3 full HD downloads per day." },
              { q: "How does the AI background removal work?", a: "Our AI uses deep learning to detect the main subject in your image and separate it from the background. The process takes under 5 seconds and works on photos, logos, illustrations and more." },
              { q: "What image formats are supported?", a: "We support JPG, JPEG, PNG, and WEBP. The output is always a transparent PNG with the background removed." },
              { q: "Is my image data private?", a: "Preview images are processed entirely in your browser using WebAssembly — they never leave your device. HD images are sent securely, processed, and immediately deleted." },
              { q: "Do purchased credits expire?", a: "Never. Credits you purchase remain in your account indefinitely and roll over month to month." },
              { q: "Can I remove background from a photo of a person?", a: "Yes — our AI excels at portraits, headshots, and full-body photos. It accurately detects hair, skin, and clothing edges for professional results." },
            ].map(({ q, a }) => (
              <details key={q} className="glass rounded-2xl group">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-bold text-white hover:text-violet-300 transition">
                  {q}
                  <ChevronDown size={18} className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-4 text-gray-400 text-sm leading-relaxed">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 relative overflow-hidden bg-[#0a0a14]">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Remove a background <span className="gradient-text">right now</span>
          </h2>
          <p className="text-gray-400 mb-8 text-lg">No account. No payment. Just upload and download.</p>
          <Link href="/tool"
            className="inline-flex items-center gap-3 bg-violet-600 hover:bg-violet-500 text-white font-black text-lg px-12 py-5 rounded-2xl transition-all shadow-2xl shadow-violet-600/40 hover:scale-[1.03]">
            <Upload size={20} /> Try It Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
