"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff, Zap, Check, Star, Upload, Sparkles } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  if (session) { router.push("/dashboard"); return null; }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/tool" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Wrong email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/tool");
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel — gradient branding */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(145deg,#4c1d95 0%,#6d28d9 40%,#1e40af 100%)" }}>

        {/* Background orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle,#a78bfa,transparent)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle,#93c5fd,transparent)", transform: "translate(-30%,30%)" }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/15 border border-white/25">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <span className="text-white font-black text-lg">BG Remover</span>
        </div>

        {/* Middle content */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 px-3 py-1.5 rounded-full text-xs font-bold mb-6">
            <Sparkles size={11} /> AI-Powered Background Removal
          </div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Remove backgrounds<br />in under 2 seconds
          </h2>
          <p className="text-violet-200 text-base leading-relaxed mb-8">
            Join 500,000+ creators, designers, and sellers who use BG Remover every day.
          </p>

          <div className="space-y-3">
            {[
              "3 free HD downloads every day",
              "No watermarks on any download",
              "Credits never expire",
              "Works on portraits, products & more",
            ].map(b => (
              <div key={b} className="flex items-center gap-3 text-white/90">
                <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-white" />
                </div>
                <span className="text-sm font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative bg-white/10 border border-white/15 rounded-2xl p-5">
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-yellow-400" fill="currentColor" />)}
          </div>
          <p className="text-white/85 text-sm italic leading-relaxed mb-4">
            &ldquo;I process 200+ product photos a week. BG Remover saves hours — quality rivals Photoshop.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black bg-white/20">
              SC
            </div>
            <div>
              <div className="text-white text-sm font-bold">Sara Chen</div>
              <div className="text-white/60 text-xs">E-commerce founder</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="text-gray-900 font-black text-lg">BG Remover</span>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-8"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>

            <div className="mb-7">
              <h1 className="text-2xl font-black text-gray-900 mb-1">Welcome back</h1>
              <p className="text-gray-500 text-sm">Sign in to access your HD downloads</p>
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl py-3.5 font-bold text-gray-700 transition-all mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              {googleLoading ? <Loader2 size={18} className="animate-spin text-gray-400" /> : (
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                  <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
                  <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
                </svg>
              )}
              {googleLoading ? "Connecting…" : "Continue with Google"}
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium px-1">or with email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-[10px] font-black">!</span>
                </div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required autoComplete="email"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-bold text-gray-700">Password</label>
                  <a href="#" className="text-xs text-violet-600 hover:text-violet-700 font-semibold transition">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-0.5">
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full btn-primary text-white py-3.5 rounded-xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                {loading && <Loader2 size={17} className="animate-spin" />}
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-center gap-1.5">
              <span className="text-sm text-gray-500">No account?</span>
              <Link href="/auth/signup" className="text-sm text-violet-600 font-black hover:text-violet-700 transition">
                Create one free →
              </Link>
            </div>

            {/* Quick benefits */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex justify-center gap-4 flex-wrap">
                {["Free previews", "HD downloads", "No watermarks"].map(b => (
                  <span key={b} className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                    <Upload size={9} className="text-violet-400" /> {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
