import Link from "next/link";
import { ChevronDown, Upload, MessageCircle } from "lucide-react";

const FAQS = [
  { q: "Is BG Remover really free?", a: "Yes! Preview (non-HD) downloads are unlimited and always free — no account, no watermarks, no time limits. Sign up to get 3 free HD downloads per day." },
  { q: "Do I need to create an account?", a: "No account needed for preview downloads. Create a free account to get 3 HD downloads per day and access the brush editor and background colour tools." },
  { q: "What is the difference between preview and HD?", a: "Preview is processed entirely in your browser using WebAssembly AI — fast, private, and always free. HD is full-resolution processed by our server — ideal for print, product listings, and professional use." },
  { q: "Are my images private?", a: "Preview images are processed 100% in your browser and never leave your device. HD images are sent to our secure processor and permanently deleted immediately after delivery." },
  { q: "Do credits expire?", a: "Never. Your purchased credits stay in your account indefinitely — no pressure, no rush." },
  { q: "What image formats are supported?", a: "Input: JPG, JPEG, PNG, and WEBP up to 12MB. Output is always a transparent PNG." },
  { q: "Can I get a refund?", a: "Yes. Unused credits can be refunded within 30 days of purchase. Email us at support@bgremover.com." },
  { q: "What counts as 1 credit?", a: "One credit = one full HD background removal of one image." },
  { q: "How do I buy credits?", a: "Go to the Pricing page, choose a package or use the custom credit calculator, and pay securely with any card via Stripe." },
  { q: "Can I use the images commercially?", a: "Yes. You own 100% of every processed image and can use them for any personal or commercial purpose without restrictions." },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white py-20 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-bold text-violet-400 mb-5 border border-violet-500/20">
            <MessageCircle size={12} /> Help center
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Frequently Asked<br /><span className="gradient-text">Questions</span>
          </h1>
          <p className="text-gray-500">Everything you need to know about BG Remover.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group rounded-2xl transition-colors"
              style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))", border: "1px solid rgba(255,255,255,0.14)" }}>
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-bold text-white hover:text-violet-300 transition-colors gap-3">
                <span>{q}</span>
                <ChevronDown size={16} className="text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">{a}</div>
            </details>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-violet-600 via-violet-700 to-blue-700 rounded-2xl p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          <h3 className="text-xl font-black mb-2 relative">Still have questions?</h3>
          <p className="text-violet-200 mb-5 relative text-sm">We typically reply within a few hours.</p>
          <a href="mailto:support@bgremover.com"
            className="inline-block bg-white text-violet-700 px-6 py-2.5 rounded-xl font-black text-sm hover:bg-violet-50 transition relative">
            Email Support
          </a>
        </div>

        <div className="mt-8 text-center">
          <Link href="/tool"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-3.5 rounded-xl font-black transition shadow-lg shadow-violet-500/20">
            <Upload size={16} /> Try it Free Now
          </Link>
        </div>

      </div>
    </div>
  );
}
