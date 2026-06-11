import Link from "next/link";
import { ChevronDown, Upload } from "lucide-react";

const FAQS = [
  { q: "Is BG Remover really free?", a: "Yes! Non-HD downloads are unlimited and always free. You also get 3 free HD downloads per day after signing up — no credit card needed." },
  { q: "Do I need to create an account?", a: "No account needed for preview (non-HD) downloads. Create a free account to get 3 HD downloads per day free." },
  { q: "What is the difference between preview and HD?", a: "Preview is a lower-resolution version processed entirely in your browser. HD is full-resolution processed by our AI — perfect for professional use." },
  { q: "Are my images private?", a: "Preview images are processed entirely in your browser — they never leave your device. HD images are sent to our secure processor and immediately deleted after processing." },
  { q: "Do credits expire?", a: "Never. Your purchased credits stay in your account indefinitely." },
  { q: "What image formats are supported?", a: "We support JPG, JPEG, PNG, and WEBP. Output is always a transparent PNG." },
  { q: "Can I get a refund?", a: "Yes. Unused credits can be refunded within 30 days of purchase. Contact us at support@bgremover.com." },
  { q: "What counts as 1 credit?", a: "One credit = one full HD background removal of one image." },
  { q: "How do I buy more credits?", a: "Go to the Pricing page, choose a package or use the custom calculator, and pay with any card or Apple/Google Pay via Stripe." },
  { q: "Can I use the images commercially?", a: "Yes. You own 100% of the processed images and can use them for any commercial or personal purpose." },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-500">Everything you need to know about BG Remover</p>
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="bg-white rounded-2xl border border-gray-100 shadow-sm group">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-semibold text-gray-900 hover:text-violet-600 transition">
                {q}
                <ChevronDown size={18} className="text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">{a}</div>
            </details>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-violet-600 to-blue-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-violet-100 mb-4">Contact us and we'll get back to you within 24 hours.</p>
          <a href="mailto:support@bgremover.com" className="bg-white text-violet-600 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-violet-50 transition inline-block">
            Contact Support
          </a>
        </div>

        <div className="mt-8 text-center">
          <Link href="/tool" className="bg-gradient-to-r from-violet-600 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition inline-flex items-center gap-2">
            <Upload size={16} /> Try It Free Now
          </Link>
        </div>
      </div>
    </div>
  );
}
