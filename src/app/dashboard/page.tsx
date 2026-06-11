"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import {
  Zap, User, CreditCard, Clock, Settings,
  Download, LogOut, CheckCircle, AlertCircle, Loader2, Camera
} from "lucide-react";

type Tab = "overview" | "profile" | "credits" | "history";

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

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
  }, [status, router]);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    if (session?.user?.name) setProfileName(session.user.name);
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-violet-500" />
      </div>
    );
  }
  if (!session) return null;

  async function saveProfile() {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/users/me`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session!.user.wpToken}` },
        body: JSON.stringify({ name: profileName }),
      });
      if (res.ok) { setSaveMsg("Profile updated!"); await update(); }
      else setSaveMsg("Update failed. Try again.");
    } catch { setSaveMsg("Update failed."); }
    setSaving(false);
  }

  async function deleteAccount() {
    if (deleteConfirm !== "DELETE") return;
    await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/users/me?force=true&reassign=1`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session!.user.wpToken}` },
    });
    await signOut({ callbackUrl: "/" });
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Zap },
    { id: "credits", label: "Credits", icon: CreditCard },
    { id: "history", label: "History", icon: Clock },
    { id: "profile", label: "Profile", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a14] py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {paymentSuccess && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
            <CheckCircle size={18} /> Credits added to your account successfully!
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h1 className="text-xl font-black text-white">{session.user.name}</h1>
              <p className="text-gray-500 text-sm">{session.user.email}</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition text-sm font-medium">
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#0d0d1f] border border-white/10 p-1 rounded-xl w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
                tab === id
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0d0d1f] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-violet-500/15 rounded-xl flex items-center justify-center">
                    <Zap size={16} className="text-violet-400" />
                  </div>
                  <span className="text-gray-500 text-sm">Credits Available</span>
                </div>
                <div className="text-3xl font-black text-white">{session.user.credits}</div>
                <p className="text-xs text-gray-600 mt-1">Never expire</p>
              </div>
              <div className="bg-[#0d0d1f] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-blue-500/15 rounded-xl flex items-center justify-center">
                    <Download size={16} className="text-blue-400" />
                  </div>
                  <span className="text-gray-500 text-sm">Free HD Today</span>
                </div>
                <div className="text-3xl font-black text-white">3</div>
                <p className="text-xs text-gray-600 mt-1">Resets at midnight</p>
              </div>
              <div className="bg-[#0d0d1f] rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-green-500/15 rounded-xl flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-400" />
                  </div>
                  <span className="text-gray-500 text-sm">Account Status</span>
                </div>
                <div className="text-lg font-black text-green-400">Active</div>
                <p className="text-xs text-gray-600 mt-1">Free plan</p>
              </div>
            </div>

            <div className="bg-[#0d0d1f] rounded-2xl p-6 border border-white/10">
              <h3 className="font-black text-white mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/tool"
                  className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 text-sm">
                  <Download size={14} /> Go to Tool
                </Link>
                <Link href="/pricing"
                  className="glass hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 text-sm border border-white/20">
                  <CreditCard size={14} /> Buy Credits
                </Link>
              </div>
            </div>

            {session.user.credits === 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex gap-3 items-start">
                <AlertCircle size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-black text-amber-300">No credits remaining</p>
                  <p className="text-amber-400/70 text-sm mt-1">You still get 3 free HD downloads per day. Buy credits for unlimited HD access.</p>
                  <Link href="/pricing"
                    className="mt-3 inline-block bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-400 transition">
                    Buy Credits
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Credits tab */}
        {tab === "credits" && (
          <div className="space-y-5">
            <div className="bg-[#0d0d1f] rounded-2xl p-6 border border-white/10">
              <h3 className="font-black text-white mb-5">Your Credits</h3>
              <div className="flex items-center justify-between p-5 bg-violet-500/10 rounded-xl border border-violet-500/20 mb-6">
                <div>
                  <p className="text-sm text-violet-400 font-bold">Available Credits</p>
                  <p className="text-4xl font-black text-white">{session.user.credits}</p>
                  <p className="text-xs text-gray-600 mt-1">Credits never expire</p>
                </div>
                <Zap size={40} className="text-violet-500/40" />
              </div>
              <Link href="/pricing"
                className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3 rounded-xl font-black text-center block hover:opacity-90 transition">
                Buy More Credits
              </Link>
            </div>
          </div>
        )}

        {/* History tab */}
        {tab === "history" && (
          <div className="bg-[#0d0d1f] rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="font-black text-white">Usage History</h3>
            </div>
            <div className="p-12 text-center">
              <Clock size={40} className="mx-auto mb-3 text-gray-700" />
              <p className="font-bold text-gray-400">No history yet</p>
              <p className="text-sm mt-1 text-gray-600">Your image processing history will appear here</p>
              <Link href="/tool"
                className="mt-5 inline-block bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-black transition">
                Start Processing
              </Link>
            </div>
          </div>
        )}

        {/* Profile tab */}
        {tab === "profile" && (
          <div className="space-y-5">
            <div className="bg-[#0d0d1f] rounded-2xl p-6 border border-white/10">
              <h3 className="font-black text-white mb-6">Profile Settings</h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div>
                  <p className="font-black text-white">{session.user.name}</p>
                  <button className="text-sm text-violet-400 flex items-center gap-1 mt-1 hover:text-violet-300 transition">
                    <Camera size={13} /> Change Photo
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1.5">Full Name</label>
                  <input value={profileName} onChange={e => setProfileName(e.target.value)}
                    className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1.5">Email Address</label>
                  <input value={session.user.email ?? ""} disabled
                    className="w-full bg-[#060610] border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-600" />
                </div>
                {saveMsg && (
                  <p className={`text-sm font-medium ${saveMsg.includes("!") ? "text-green-400" : "text-red-400"}`}>{saveMsg}</p>
                )}
                <button onClick={saveProfile} disabled={saving}
                  className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl font-black transition flex items-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : null}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            <div className="bg-[#0d0d1f] rounded-2xl p-6 border border-red-500/20">
              <h3 className="font-black text-red-400 mb-4 flex items-center gap-2">
                <AlertCircle size={16} /> Danger Zone
              </h3>
              <p className="text-gray-500 text-sm mb-4">Permanently delete your account and all data. This cannot be undone.</p>
              <div className="flex gap-3 items-center flex-wrap">
                <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
                  placeholder='Type "DELETE" to confirm'
                  className="bg-[#0a0a14] border border-red-500/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition" />
                <button onClick={deleteAccount} disabled={deleteConfirm !== "DELETE"}
                  className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-black hover:bg-red-600 transition disabled:opacity-30 text-sm">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
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
