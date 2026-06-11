"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";
import Link from "next/link";
import {
  Zap, User, CreditCard, Clock, Settings, LayoutDashboard,
  Download, LogOut, CheckCircle, AlertCircle, Loader2, Camera,
  Copy, RefreshCw, Code2, ArrowRight, Star, ExternalLink,
  ShoppingBag, Image as ImageIcon, Layers,
} from "lucide-react";

type Tab = "overview" | "api" | "credits" | "history" | "profile";

const NAV = [
  { id: "overview" as Tab, label: "Overview",   icon: LayoutDashboard },
  { id: "api"      as Tab, label: "API & Tools", icon: Code2 },
  { id: "credits"  as Tab, label: "Credits",     icon: CreditCard },
  { id: "history"  as Tab, label: "History",     icon: Clock },
  { id: "profile"  as Tab, label: "Settings",    icon: Settings },
];

/* ── ring chart ── */
function CreditRing({ credits, max = 50 }: { credits: number; max?: number }) {
  const pct = Math.min((credits / max) * 100, 100);
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1a1a30" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none"
          stroke="url(#cg)" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          className="transition-all duration-1000" />
        <defs>
          <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-white">{credits}</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">credits</span>
      </div>
    </div>
  );
}

/* ── API key block ── */
function ApiKeyBlock({ apiKey }: { apiKey: string }) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [apiKey]);

  const masked = apiKey.slice(0, 8) + "••••••••••••••••••••" + apiKey.slice(-4);

  return (
    <div className="bg-[#0a0a14] border border-white/10 rounded-xl p-4 flex items-center gap-3">
      <code className="flex-1 text-sm font-mono text-violet-300 truncate">
        {show ? apiKey : masked}
      </code>
      <button onClick={() => setShow(s => !s)} className="text-gray-500 hover:text-white transition text-xs font-bold">
        {show ? "Hide" : "Show"}
      </button>
      <button onClick={copy}
        className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:bg-white/10 transition">
        <Copy size={12} /> {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

/* ── main dashboard ── */
function DashboardContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("overview");
  const [profileName, setProfileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);

  useEffect(() => { if (status === "unauthenticated") router.push("/auth/signin"); }, [status, router]);
  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 6000);
    }
  }, [searchParams]);
  useEffect(() => { if (session?.user?.name) setProfileName(session.user.name); }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-violet-500 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }
  if (!session) return null;

  const credits = session.user.credits ?? 0;
  const apiKey = `brk_${session.user.email?.replace(/[^a-z0-9]/gi, "").slice(0, 8)}_live_${"x".repeat(24)}`;

  async function saveProfile() {
    setSaving(true); setSaveMsg("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/users/me`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session!.user.wpToken}` },
        body: JSON.stringify({ name: profileName }),
      });
      if (res.ok) { setSaveMsg("Profile updated!"); await update(); }
      else setSaveMsg("Update failed.");
    } catch { setSaveMsg("Update failed."); }
    setSaving(false);
  }

  async function deleteAccount() {
    if (deleteConfirm !== "DELETE") return;
    await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/users/me?force=true&reassign=1`, {
      method: "DELETE", headers: { Authorization: `Bearer ${session!.user.wpToken}` },
    });
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#0a0a14]">

      {/* ── SIDEBAR (desktop) ── */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-[#0d0d1f] border-r border-white/10">
        {/* User card */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold text-sm truncate">{session.user.name}</div>
              <div className="text-gray-500 text-xs truncate">{session.user.email}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-3 py-2 rounded-xl">
            <Zap size={13} className="text-violet-400" fill="currentColor" />
            <span className="text-violet-300 text-sm font-black">{credits} credits</span>
            <span className="text-gray-600 text-xs ml-auto">remaining</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link href="/tool"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full">
            <ImageIcon size={16} /> Open Tool
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOP TABS ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d1f]/95 backdrop-blur border-t border-white/10 flex justify-around px-2 py-2">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              tab === id ? "text-violet-400" : "text-gray-600 hover:text-gray-400"
            }`}>
            <Icon size={18} />
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto p-5 lg:p-8 pb-24 lg:pb-8">
        <div className="max-w-4xl mx-auto">

          {paymentSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2 mb-6 anim-slide-up">
              <CheckCircle size={18} /> Credits added successfully! Ready to use.
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-black text-white">Good to see you, {session.user.name?.split(" ")[0]} 👋</h1>
                <p className="text-gray-500 text-sm mt-1">Here&apos;s your account at a glance.</p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Available Credits",   value: credits,  sub: "Never expire",         color: "from-violet-600 to-blue-600",  icon: Zap },
                  { label: "Free HD Today",        value: 3,        sub: "Resets at midnight",   color: "from-blue-600 to-cyan-600",    icon: Download },
                  { label: "Account Status",       value: "Active", sub: "Free plan",            color: "from-emerald-600 to-teal-600", icon: CheckCircle },
                ].map(({ label, value, sub, color, icon: Icon }) => (
                  <div key={label} className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                    <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div className="text-2xl font-black text-white">{value}</div>
                    <div className="text-gray-400 text-sm font-bold mt-0.5">{label}</div>
                    <div className="text-gray-600 text-xs mt-0.5">{sub}</div>
                  </div>
                ))}
              </div>

              {/* Credit ring + actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6 flex items-center gap-6">
                  <CreditRing credits={credits} />
                  <div>
                    <h3 className="text-white font-black text-lg mb-1">Credit Balance</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      {credits === 0 ? "No credits left. Buy to unlock HD downloads." : `${credits} HD downloads available.`}
                    </p>
                    <Link href="/pricing"
                      className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-black px-4 py-2 rounded-xl transition">
                      <Zap size={13} fill="currentColor" /> Buy Credits
                    </Link>
                  </div>
                </div>

                <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-black mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { href: "/tool", icon: ImageIcon, label: "Remove Background", sub: "Free, instant" },
                      { href: "/pricing", icon: CreditCard, label: "Buy Credits", sub: "HD downloads" },
                    ].map(({ href, icon: Icon, label, sub }) => (
                      <Link key={href} href={href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition group">
                        <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-violet-500/20 transition">
                          <Icon size={16} className="text-gray-400 group-hover:text-violet-400 transition" />
                        </div>
                        <div>
                          <div className="text-white text-sm font-bold">{label}</div>
                          <div className="text-gray-600 text-xs">{sub}</div>
                        </div>
                        <ArrowRight size={14} className="text-gray-600 ml-auto group-hover:text-violet-400 transition" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {credits === 0 && (
                <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-5 flex gap-3">
                  <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-amber-300 mb-1">No credits remaining</p>
                    <p className="text-amber-400/70 text-sm">You still get 3 free HD downloads per day. Buy credits for unlimited HD.</p>
                    <Link href="/pricing" className="mt-3 inline-block bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-lg text-sm font-black transition">
                      Buy Credits →
                    </Link>
                  </div>
                </div>
              )}

              {/* Recent use case thumbnails - visual placeholder */}
              <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-black">Recent Removals</h3>
                  <button onClick={() => setTab("history")} className="text-violet-400 text-sm font-bold hover:text-violet-300 transition">View all →</button>
                </div>
                <div className="flex gap-3">
                  {[ShoppingBag, User, Layers, ImageIcon].map((Icon, i) => (
                    <div key={i} className="w-16 h-16 rounded-xl checker-dark flex items-center justify-center border border-white/10">
                      <Icon size={20} className="text-white/20" />
                    </div>
                  ))}
                  <div className="w-16 h-16 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
                    <span className="text-gray-600 text-xs text-center leading-tight">Process<br />more</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── API & TOOLS ── */}
          {tab === "api" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-black text-white">API & Tools</h1>
                <p className="text-gray-500 text-sm mt-1">Integrate BG Remover into your own apps and workflows.</p>
              </div>

              {/* API Key card */}
              <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-white font-black text-lg">Your API Key</h3>
                    <p className="text-gray-500 text-sm">Use this key to authenticate API requests.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-xs font-bold">Active</span>
                  </div>
                </div>
                <ApiKeyBlock apiKey={apiKey} />
                <div className="flex items-center gap-3 mt-4">
                  <button onClick={() => setKeyLoading(true)}
                    className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10 transition">
                    {keyLoading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                    Regenerate
                  </button>
                  <span className="text-gray-600 text-xs">Regenerating will invalidate the current key</span>
                </div>
              </div>

              {/* API usage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "API Calls Today", value: "—", sub: "Resets midnight" },
                  { label: "Credits via API", value: credits, sub: "Available" },
                  { label: "Rate Limit", value: "100/min", sub: "Per API key" },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="bg-[#0d0d1f] border border-white/10 rounded-xl p-4">
                    <div className="text-xl font-black text-white">{value}</div>
                    <div className="text-gray-400 text-sm font-bold">{label}</div>
                    <div className="text-gray-600 text-xs mt-0.5">{sub}</div>
                  </div>
                ))}
              </div>

              {/* Code example */}
              <div className="bg-[#060610] border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-[#0a0a18]">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-xs text-gray-600 font-mono">Quick start</span>
                </div>
                <pre className="p-5 text-xs font-mono leading-6 overflow-x-auto text-gray-300">
{`curl -X POST \\
  https://api.bgremover.app/v1/remove \\
  -H "X-Api-Key: ${apiKey.slice(0, 20)}..." \\
  -F "image=@your_photo.jpg" \\
  -o result.png`}
                </pre>
              </div>

              {/* Tool downloads */}
              <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-black mb-4">Integrations & Tools</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: "🔌", label: "Photoshop Plugin",  sub: "Remove BG inside Photoshop" },
                    { icon: "🖥",  label: "Desktop App",       sub: "Windows & macOS" },
                    { icon: "📱", label: "Mobile App",        sub: "iOS & Android" },
                    { icon: "🔗", label: "Zapier Integration", sub: "Automate with 5000+ apps" },
                  ].map(({ icon, label, sub }) => (
                    <div key={label}
                      className="flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/5 transition cursor-pointer group">
                      <span className="text-2xl">{icon}</span>
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm">{label}</div>
                        <div className="text-gray-500 text-xs">{sub}</div>
                      </div>
                      <ExternalLink size={13} className="text-gray-600 group-hover:text-violet-400 transition" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CREDITS ── */}
          {tab === "credits" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-black text-white">Credits & Billing</h1>
                <p className="text-gray-500 text-sm mt-1">Credits never expire. Buy once, use anytime.</p>
              </div>

              <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6 flex items-center gap-6">
                <CreditRing credits={credits} max={100} />
                <div>
                  <div className="text-gray-400 text-sm font-bold">Available Credits</div>
                  <div className="text-4xl font-black text-white">{credits}</div>
                  <div className="text-gray-600 text-xs mt-1">1 credit = 1 HD background removal</div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-green-400 text-xs font-bold">Credits never expire</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { credits: 10, price: "$1.00",  per: "$0.10", hot: false },
                  { credits: 50, price: "$4.50",  per: "$0.09", hot: false },
                  { credits: 100,price: "$8.00",  per: "$0.08", hot: true },
                  { credits: 500,price: "$35.00", per: "$0.07", hot: false },
                ].map(({ credits: c, price, per, hot }) => (
                  <Link key={c} href="/pricing"
                    className={`relative bg-[#0d0d1f] border rounded-2xl p-5 text-center hover:scale-[1.03] transition-all block ${hot ? "border-violet-500/50 shadow-lg shadow-violet-500/10" : "border-white/10 hover:border-violet-500/25"}`}>
                    {hot && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap">BEST VALUE</div>}
                    <div className="text-2xl font-black text-white">{price}</div>
                    <div className="text-violet-400 font-black text-sm mt-1">{c} credits</div>
                    <div className="text-gray-600 text-xs mt-0.5">{per} each</div>
                    <div className="mt-4 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-xs font-black py-2 rounded-xl transition">
                      Buy Now →
                    </div>
                  </Link>
                ))}
              </div>

              <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-5">
                <h3 className="text-white font-black mb-3">What you get free</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {["Unlimited preview (non-HD) downloads", "3 HD downloads every day after sign-up", "Brush editor & background colours", "API key for testing (5 req/day)"].map(f => (
                    <div key={f} className="flex items-center gap-2 text-gray-400">
                      <CheckCircle size={14} className="text-green-400 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── HISTORY ── */}
          {tab === "history" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-black text-white">Usage History</h1>
                <p className="text-gray-500 text-sm mt-1">Track every HD removal you&apos;ve processed.</p>
              </div>
              <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <span className="text-white font-black">All Removals</span>
                  <span className="text-gray-500 text-sm">0 total</span>
                </div>
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock size={28} className="text-gray-700" />
                  </div>
                  <p className="text-gray-400 font-bold mb-1">No history yet</p>
                  <p className="text-gray-600 text-sm mb-5">Your processed images will appear here after HD downloads</p>
                  <Link href="/tool"
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-black transition">
                    <ImageIcon size={15} /> Process your first image
                  </Link>
                </div>
              </div>

              {/* Feature preview */}
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-5 flex gap-4 items-start">
                <Star size={20} className="text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-violet-300 font-black mb-1">History tracking coming soon</p>
                  <p className="text-violet-400/60 text-sm">We&apos;re building full history with thumbnails, timestamps and re-download links.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {tab === "profile" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-black text-white">Profile Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your account information.</p>
              </div>

              <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl p-6">
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                  <div className="relative">
                    <div className="w-18 h-18 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black w-[72px] h-[72px]">
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0d0d1f] border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition">
                      <Camera size={12} className="text-gray-400" />
                    </button>
                  </div>
                  <div>
                    <div className="text-white font-black text-lg">{session.user.name}</div>
                    <div className="text-gray-500 text-sm">{session.user.email}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-green-400 text-xs font-bold">Active account</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1.5">Full Name</label>
                    <input value={profileName} onChange={e => setProfileName(e.target.value)}
                      className="w-full bg-[#0a0a14] border border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition placeholder-gray-600"
                      placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1.5">Email Address</label>
                    <input value={session.user.email ?? ""} disabled
                      className="w-full bg-[#060610] border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-600 cursor-not-allowed" />
                    <p className="text-xs text-gray-600 mt-1">Contact support to change your email.</p>
                  </div>
                  {saveMsg && (
                    <div className={`text-sm font-bold px-4 py-2 rounded-xl ${saveMsg.includes("!") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                      {saveMsg}
                    </div>
                  )}
                  <button onClick={saveProfile} disabled={saving}
                    className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl font-black transition flex items-center gap-2 disabled:opacity-60">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>

              {/* Danger zone */}
              <div className="bg-[#0d0d1f] border border-red-500/20 rounded-2xl p-6">
                <h3 className="text-red-400 font-black flex items-center gap-2 mb-2">
                  <AlertCircle size={16} /> Danger Zone
                </h3>
                <p className="text-gray-500 text-sm mb-4">Permanently delete your account and all data. This cannot be undone.</p>
                <div className="flex gap-3 flex-wrap items-center">
                  <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
                    placeholder='Type "DELETE" to confirm'
                    className="bg-[#0a0a14] border border-red-500/20 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition" />
                  <button onClick={deleteAccount} disabled={deleteConfirm !== "DELETE"}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-black text-sm transition disabled:opacity-30">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-violet-500" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
