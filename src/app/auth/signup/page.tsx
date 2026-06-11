"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff, Check, Zap } from "lucide-react";

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
    <div className="min-h-screen hero-bg flex items-center justify-center px-4 py-12">
      {/* Glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-[#0d0d1f]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">

          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
              <Zap size={24} className="text-white" fill="white" />
            </div>
            <h1 className="text-2xl font-black text-white">Create free account</h1>
            <p className="text-gray-500 text-sm mt-1">Get 3 free HD downloads — no card needed</p>
          </div>

          {/* Benefits */}
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-1 gap-1.5">
              {["3 free HD downloads on signup", "3 HD downloads every day free", "Credits never expire"].map(b => (
                <div key={b} className="flex items-center gap-2 text-sm text-violet-300 font-medium">
                  <Check size={13} className="text-violet-500 flex-shrink-0" /> {b}
                </div>
              ))}
            </div>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 glass border border-white/15 hover:bg-white/10 rounded-xl py-3 font-bold text-white transition mb-5 disabled:opacity-60">
            {googleLoading ? <Loader2 size={18} className="animate-spin" /> : (
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
            )}
            {googleLoading ? "Connecting…" : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 font-medium">or with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={e => set("name", e.target.value)} required autoComplete="name"
                className="w-full bg-[#0a0a14] border border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition placeholder-gray-600"
                placeholder="John Smith" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)} required autoComplete="email"
                className="w-full bg-[#0a0a14] border border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition placeholder-gray-600"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} required autoComplete="new-password"
                  className="w-full bg-[#0a0a14] border border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 pr-11 text-sm text-white outline-none transition placeholder-gray-600"
                  placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition">
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)} required autoComplete="new-password"
                className="w-full bg-[#0a0a14] border border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition placeholder-gray-600"
                placeholder="Repeat password" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-black transition flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && <Loader2 size={17} className="animate-spin" />}
              {loading ? "Creating Account…" : "Create Free Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-violet-400 font-black hover:text-violet-300 transition">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
