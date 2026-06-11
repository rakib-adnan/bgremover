import Link from "next/link";
import { Upload, Wand2, Download, Shield, Zap, Star, ChevronRight, Check } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-violet-50 via-white to-blue-50 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap size={14} /> AI-Powered · Free · Instant
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Remove Image Background<br />
            <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              Free & Instantly
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload any image and our AI removes the background in seconds.
            Get 3 free HD downloads daily. No watermarks. No credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tool" className="bg-gradient-to-r from-violet-600 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-violet-200">
              <Upload size={20} /> Upload Image Free
            </Link>
            <Link href="/pricing" className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 border border-gray-200">
              View Pricing <ChevronRight size={18} />
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">✓ 3 free HD images/day &nbsp; ✓ No watermarks &nbsp; ✓ No signup for preview</p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-500 mb-12">Three simple steps to a perfect cutout</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Upload, step: "1", title: "Upload Image", desc: "Drag & drop or click to upload any JPG, PNG, or WEBP image." },
              { icon: Wand2, step: "2", title: "AI Removes Background", desc: "Our AI instantly detects and removes the background with precision." },
              { icon: Download, step: "3", title: "Download Result", desc: "Download free preview or use credits for full HD transparent PNG." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Icon size={22} className="text-white" />
                </div>
                <div className="absolute top-4 right-4 w-7 h-7 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs font-bold">{step}</div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BG Remover?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "100% Private", desc: "Previews processed in your browser. HD images processed securely and never stored." },
              { icon: Zap, title: "Lightning Fast", desc: "AI removes backgrounds in under 5 seconds. No waiting, no queues." },
              { icon: Star, title: "HD Quality", desc: "Full resolution PNG with transparent background. Perfect for professional use." },
              { icon: Check, title: "No Watermarks", desc: "Even free downloads come watermark-free. Clean, professional results always." },
              { icon: Upload, title: "Any Image Type", desc: "Supports JPG, PNG, WEBP and more. Works with people, products, pets and objects." },
              { icon: Download, title: "Credits Never Expire", desc: "Buy once, use anytime. Your credits roll over and never expire." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Banner */}
      <section className="py-20 px-4 bg-gradient-to-br from-violet-600 to-blue-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-violet-100 mb-8">Start free. Pay only for what you use. Credits never expire.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Free", sub: "3 HD/day", price: "$0" },
              { label: "10 credits", sub: "10 images", price: "$1.00" },
              { label: "50 credits", sub: "50 images", price: "$4.50" },
              { label: "100 credits", sub: "100 images", price: "$8.00" },
            ].map((p) => (
              <div key={p.label} className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold">{p.price}</div>
                <div className="text-violet-100 text-sm">{p.sub}</div>
              </div>
            ))}
          </div>
          <Link href="/pricing" className="bg-white text-violet-600 px-8 py-3 rounded-xl font-semibold hover:bg-violet-50 transition inline-flex items-center gap-2">
            View All Plans <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Remove Backgrounds?</h2>
          <p className="text-gray-500 mb-8">No signup needed. Start for free right now.</p>
          <Link href="/tool" className="bg-gradient-to-r from-violet-600 to-blue-500 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition shadow-lg shadow-violet-200 inline-flex items-center gap-2">
            <Upload size={20} /> Try It Free Now
          </Link>
        </div>
      </section>
    </div>
  );
}
