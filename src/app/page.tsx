import Link from "next/link";
import { ArrowRight, Check, Zap, Shield, Star, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="pt-20 pb-16 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
            <Zap size={13} fill="currentColor" /> 100% Free — No Sign Up Required
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
            Remove Image<br />
            <span className="text-violet-600">Background</span> Free
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
            Upload a photo and get a transparent background instantly. No watermarks. No limits. 100% free.
          </p>

          {/* Upload CTA */}
          <Link href="/tool"
            className="inline-flex items-center gap-3 bg-violet-600 hover:bg-violet-700 text-white text-lg font-bold px-10 py-5 rounded-2xl transition-all shadow-xl shadow-violet-200 hover:shadow-violet-300 hover:scale-[1.02]">
            Upload Image — It&apos;s Free
            <ArrowRight size={20} />
          </Link>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> No sign up needed</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> Unlimited free downloads</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> No watermarks ever</span>
          </div>
        </div>
      </section>

      {/* Before/After visual */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-3xl overflow-hidden shadow-2xl shadow-gray-200">
            <div className="bg-gray-100 aspect-square flex items-center justify-center relative">
              <div className="absolute top-3 left-3 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full">BEFORE</div>
              <div className="w-32 h-40 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl" />
            </div>
            <div className="aspect-square flex items-center justify-center relative" style={{background:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23e5e7eb'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23e5e7eb'/%3E%3Crect x='10' y='0' width='10' height='10' fill='%23fff'/%3E%3Crect x='0' y='10' width='10' height='10' fill='%23fff'/%3E%3C/svg%3E\")"}}>
              <div className="absolute top-3 left-3 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full">AFTER</div>
              <div className="w-32 h-40 bg-gradient-to-br from-violet-400 to-violet-600 rounded-2xl opacity-80" />
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm mt-4">Background removed in under 3 seconds</p>
        </div>
      </section>

      {/* Free vs Signed In */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-3">What You Get</h2>
          <p className="text-gray-500 text-center mb-12">Free for everyone. Even better when signed in.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="text-2xl font-black text-gray-900 mb-1">Free</div>
              <div className="text-gray-400 text-sm mb-6">No account needed</div>
              <ul className="space-y-3">
                {[
                  "Unlimited background removal",
                  "Instant preview download",
                  "No watermarks",
                  "JPG, PNG, WEBP support",
                  "No sign up ever",
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-green-600" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/tool" className="mt-6 block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                Start Free
              </Link>
            </div>

            {/* Signed In */}
            <div className="bg-violet-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full">BEST</div>
              <div className="text-2xl font-black mb-1">Sign In Free</div>
              <div className="text-violet-200 text-sm mb-6">Free account · 3 HD/day</div>
              <ul className="space-y-3">
                {[
                  "Everything in Free",
                  "3 full HD downloads daily",
                  "Full resolution PNG",
                  "Credits never expire",
                  "Download history",
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-violet-100">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-white" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="mt-6 block w-full text-center bg-white text-violet-600 py-3 rounded-xl font-black hover:bg-violet-50 transition">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-3">How It Works</h2>
          <p className="text-gray-500 mb-12">Three steps. Five seconds.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "1", title: "Upload", desc: "Drag & drop or click to upload any image", color: "bg-violet-100 text-violet-600" },
              { n: "2", title: "Process", desc: "AI removes the background instantly", color: "bg-blue-100 text-blue-600" },
              { n: "3", title: "Download", desc: "Save your transparent PNG for free", color: "bg-green-100 text-green-600" },
            ].map(s => (
              <div key={s.n} className="text-center">
                <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4`}>{s.n}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Why BG Remover?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Zap, label: "Instant", desc: "Under 5 seconds" },
              { icon: Shield, label: "Private", desc: "Stays in your browser" },
              { icon: Star, label: "HD Quality", desc: "Full resolution output" },
              { icon: Clock, label: "Always Free", desc: "No hidden charges" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
                <Icon size={24} className="text-violet-600 mx-auto mb-3" />
                <div className="font-bold text-gray-900 mb-1">{label}</div>
                <div className="text-gray-400 text-xs">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4">Remove a background right now</h2>
          <p className="text-gray-400 mb-8">No account. No payment. Just upload and download.</p>
          <Link href="/tool" className="inline-flex items-center gap-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg px-10 py-5 rounded-2xl transition">
            Try It Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  );
}
