"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff, Check, Zap, Star, Sparkles } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  if (session) { router.push("/tool"); return null; }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/tool" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Sign up failed. Please try again."); setLoading(false); return; }

    const login = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    if (login?.error) {
      setError("Account created! Please sign in.");
      setLoading(false);
      router.push("/auth/signin");
      return;
    }
    router.push("/tool");
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel — gradient branding */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(145deg,#1e3a5f 0%,#1e40af 45%,#4c1d95 100%)" }}>

        {/* Background orbs */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle,#93c5fd,transparent)", transform: "translate(-30%,-30%)" }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle,#a78bfa,transparent)", transform: "translate(30%,30%)" }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/15 border border-white/25">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <span className="text-white font-black text-lg">BG Remover</span>
        </div>

        {/* Middle */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 px-3 py-1.5 rounded-full text-xs font-bold mb-6">
            <Sparkles size={11} /> Free forever — no credit card
          </div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Start removing<br />backgrounds today
          </h2>
          <p className="text-blue-200 text-base leading-relaxed mb-8">
            Create your free account and get 3 HD downloads every day — forever.
          </p>

          {/* Plan card */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-black text-sm">Free Plan</span>
              <span className="text-white/60 text-xs bg-white/10 px-2.5 py-1 rounded-full font-bold">Current</span>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "HD downloads/day", value: "3" },
                { label: "Preview downloads", value: "Unlimited" },
                { label: "Credits expiry", value: "Never" },
                { label: "API access", value: "Available" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">{label}</span>
                  <span className="text-white text-xs font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {["No credit card required", "Cancel or upgrade anytime", "Commercial use included"].map(b => (
              <div key={b} className="flex items-center gap-3 text-white/85">
                <div className="w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-emerald-300" />
                </div>
                <span className="text-sm font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="relative flex items-center gap-4">
          <div className="flex -space-x-2">
            {["SC","MB","PM"].map((a, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-[9px] font-black text-white bg-white/20">
                {a}
              </div>
            ))}
          </div>
          <div>
            <div className="flex gap-0.5 mb-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={10} className="text-yellow-400" fill="currentColor" />)}
            </div>
            <div className="text-white/60 text-xs">Trusted by 500K+ creators</div>
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

            <div className="mb-6">
              <h1 className="text-2xl font-black text-gray-900 mb-1">Create free account</h1>
              <p className="text-gray-500 text-sm">Get 3 HD downloads/day — no card needed</p>
            </div>

            {/* Google button */}
            <button onClick={handleGoogle} disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl py-3.5 font-bold text-gray-700 transition-all mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
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

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                <input type="text" value={form.name} onChange={e => set("name", e.target.value)} required autoComplete="name"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition placeholder-gray-400"
                  placeholder="John Smith" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email address</label>
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)} required autoComplete="email"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition placeholder-gray-400"
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} required autoComplete="new-password"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition placeholder-gray-400"
                    placeholder="Min 6 characters" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-0.5">
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm Password</label>
                <input type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)} required autoComplete="new-password"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition placeholder-gray-400"
                  placeholder="Repeat password" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full btn-primary text-white py-3.5 rounded-xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed !mt-5">
                {loading && <Loader2 size={17} className="animate-spin" />}
                {loading ? "Creating Account…" : "Create Free Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-violet-600 font-black hover:text-violet-700 transition">Sign in →</Link>
            </p>

            <p className="text-center text-[11px] text-gray-400 mt-4 leading-relaxed">
              By creating an account you agree to our{" "}
              <a href="#" className="underline hover:text-gray-600">Terms</a> and{" "}
              <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
