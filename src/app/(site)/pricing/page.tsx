"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Zap, Loader2, Calculator } from "lucide-react";

const PACKAGES = [
  { id: "starter",   credits: 10,  price: 1.00,  popular: false },
  { id: "basic",     credits: 50,  price: 4.50,  popular: false },
  { id: "pro",       credits: 100, price: 8.00,  popular: true  },
  { id: "unlimited", credits: 500, price: 35.00, popular: false },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [customImages, setCustomImages] = useState("");
  const [customBudget, setCustomBudget] = useState("");
  const [calcMode, setCalcMode] = useState<"images" | "budget">("images");

  const calcPrice = () => {
    if (calcMode === "images") {
      const n = parseInt(customImages) || 0;
      const price = n <= 10 ? n * 0.10 : n <= 50 ? n * 0.09 : n <= 100 ? n * 0.08 : n * 0.07;
      return { images: n, price: price.toFixed(2) };
    } else {
      const b = parseFloat(customBudget) || 0;
      const rate = b <= 1 ? 0.10 : b <= 4.5 ? 0.09 : b <= 8 ? 0.08 : 0.07;
      return { images: Math.floor(b / rate), price: b.toFixed(2) };
    }
  };

  const calc = calcPrice();

  async function buyPackage(credits: number, price: number, id: string) {
    if (!session) { router.push("/auth/signup"); return; }
    setLoading(id);
    const res = await fetch("/api/stripe/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credits, amount: price }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(null);
  }

  async function buyCustom() {
    if (!calc.images || !calc.price) return;
    await buyPackage(calc.images, parseFloat(calc.price), "custom");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 px-4 py-1.5 rounded-full text-violet-600 text-xs font-bold mb-5">
            <Zap size={12} fill="currentColor" /> Credits never expire
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-500 text-lg">Start free. Pay only for what you use.</p>
          {session && (
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 border border-violet-200 px-4 py-1.5 rounded-full text-sm font-bold mt-4">
              <Zap size={13} fill="currentColor" /> You have {session.user.credits} credits
            </div>
          )}
        </div>

        {/* Free tier banner */}
        <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl p-6 mb-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at top, rgba(255,255,255,0.2) 0%, transparent 70%)" }} />
          <h3 className="text-xl font-black text-white mb-1 relative">Always Free</h3>
          <p className="text-violet-100 relative text-sm">Non-HD downloads: unlimited, always free · HD downloads: 3 per day free after sign-up</p>
          {!session && (
            <Link href="/auth/signup"
              className="inline-block mt-4 bg-white text-violet-700 px-6 py-2.5 rounded-xl font-black text-sm hover:bg-violet-50 transition relative">
              Sign Up Free — Get 3 HD Credits
            </Link>
          )}
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {PACKAGES.map((pkg) => (
            <div key={pkg.id}
              className={`bg-white rounded-2xl p-6 relative transition-all card-shadow ${pkg.popular ? "ring-2 ring-violet-500" : "border border-gray-200"}`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-black px-3 py-1 rounded-full whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                  MOST POPULAR
                </div>
              )}
              <div className="text-3xl font-black text-gray-900 mb-1">${pkg.price.toFixed(2)}</div>
              <div className="text-violet-600 font-bold mb-4">{pkg.credits} HD credits</div>
              <div className="text-sm text-gray-500 mb-1">{pkg.credits} images</div>
              <div className="text-sm text-gray-400 mb-6">${(pkg.price / pkg.credits).toFixed(3)}/image</div>
              <ul className="space-y-2 mb-6">
                {["Full HD quality", "Transparent PNG", "Credits never expire", "Instant delivery"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={13} className="text-green-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => buyPackage(pkg.credits, pkg.price, pkg.id)}
                disabled={loading === pkg.id}
                className={`w-full py-2.5 rounded-xl font-black transition flex items-center justify-center gap-2 disabled:opacity-60 ${
                  pkg.popular
                    ? "btn-primary text-white hover:opacity-90"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}>
                {loading === pkg.id ? <Loader2 size={15} className="animate-spin" /> : null}
                {loading === pkg.id ? "Redirecting..." : "Buy Now"}
              </button>
            </div>
          ))}
        </div>

        {/* Custom Calculator */}
        <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#7c3aed22" }}>
              <Calculator size={20} style={{ color: "#7c3aed" }} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-lg">Custom Credit Calculator</h3>
              <p className="text-gray-500 text-sm">Enter your need — price calculates automatically</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button onClick={() => setCalcMode("images")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
                calcMode === "images" ? "bg-violet-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
              Enter Images Needed
            </button>
            <button onClick={() => setCalcMode("budget")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
                calcMode === "budget" ? "bg-violet-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
              Enter Your Budget
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              {calcMode === "images" ? (
                <>
                  <label className="block text-sm font-bold text-gray-700 mb-2">How many images do you need?</label>
                  <input
                    type="number" min="1" max="9999" value={customImages}
                    onChange={e => setCustomImages(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                    placeholder="e.g. 150"
                  />
                </>
              ) : (
                <>
                  <label className="block text-sm font-bold text-gray-700 mb-2">What is your budget? ($)</label>
                  <input
                    type="number" min="1" step="0.01" value={customBudget}
                    onChange={e => setCustomBudget(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                    placeholder="e.g. 25.00"
                  />
                </>
              )}
            </div>

            <div className="bg-violet-50 rounded-xl p-5 border border-violet-200">
              {calc.images > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm">Images</span>
                    <span className="font-black text-gray-900">{calc.images.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 text-sm">Total Price</span>
                    <span className="font-black text-2xl text-violet-600">${calc.price}</span>
                  </div>
                  <button
                    onClick={buyCustom}
                    disabled={loading === "custom"}
                    className="w-full btn-primary text-white py-2.5 rounded-xl font-black hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading === "custom" ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
                    {loading === "custom" ? "Redirecting..." : `Buy ${calc.images} Credits for $${calc.price}`}
                  </button>
                </>
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">Enter a number above to calculate price</p>
              )}
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-400 text-center">
            Volume discounts: 1–10 images = $0.10/each · 11–50 = $0.09/each · 51–100 = $0.08/each · 101+ = $0.07/each
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {[
            { q: "Do credits expire?", a: "Never. Your credits remain valid indefinitely — no rush, no expiry." },
            { q: "What counts as 1 credit?", a: "One full-resolution HD background removal of one image." },
            { q: "Can I get a refund?", a: "Yes, unused credits can be refunded within 30 days of purchase." },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white rounded-xl p-5 card-shadow border border-gray-200">
              <p className="font-black text-gray-900 mb-2">{q}</p>
              <p className="text-gray-500">{a}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
