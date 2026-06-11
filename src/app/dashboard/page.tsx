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
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-violet-500" /></div>;
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {paymentSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
            <CheckCircle size={18} /> Credits added to your account successfully!
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{session.user.name}</h1>
              <p className="text-gray-500 text-sm">{session.user.email}</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition text-sm">
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${tab === id ? "bg-white shadow-sm text-violet-600" : "text-gray-500 hover:text-gray-700"}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center"><Zap size={16} className="text-violet-600" /></div>
                  <span className="text-gray-500 text-sm">Credits Available</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{session.user.credits}</div>
                <p className="text-xs text-gray-400 mt-1">Never expire</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center"><Download size={16} className="text-blue-600" /></div>
                  <span className="text-gray-500 text-sm">Free HD Today</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">3</div>
                <p className="text-xs text-gray-400 mt-1">Resets at midnight</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle size={16} className="text-green-600" /></div>
                  <span className="text-gray-500 text-sm">Account Status</span>
                </div>
                <div className="text-lg font-bold text-green-600">Active</div>
                <p className="text-xs text-gray-400 mt-1">Free plan</p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/tool" className="bg-gradient-to-r from-violet-600 to-blue-500 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2 text-sm">
                  <Download size={15} /> Go to Tool
                </Link>
                <Link href="/pricing" className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition flex items-center gap-2 text-sm">
                  <CreditCard size={15} /> Buy Credits
                </Link>
              </div>
            </div>

            {/* Low credits warning */}
            {session.user.credits === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3 items-start">
                <AlertCircle size={18} className="text-amber-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800">No credits remaining</p>
                  <p className="text-amber-700 text-sm mt-1">You still get 3 free HD downloads per day. Buy credits for unlimited HD access.</p>
                  <Link href="/pricing" className="mt-2 inline-block bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition">Buy Credits</Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Credits tab */}
        {tab === "credits" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Your Credits</h3>
              <div className="flex items-center justify-between p-5 bg-violet-50 rounded-xl border border-violet-100 mb-6">
                <div>
                  <p className="text-sm text-violet-600 font-medium">Available Credits</p>
                  <p className="text-4xl font-bold text-violet-700">{session.user.credits}</p>
                  <p className="text-xs text-violet-400 mt-1">Credits never expire</p>
                </div>
                <Zap size={40} className="text-violet-300" />
              </div>
              <Link href="/pricing" className="w-full bg-gradient-to-r from-violet-600 to-blue-500 text-white py-3 rounded-xl font-semibold text-center block hover:opacity-90 transition">
                Buy More Credits
              </Link>
            </div>
          </div>
        )}

        {/* History tab */}
        {tab === "history" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Usage History</h3>
            </div>
            <div className="p-12 text-center text-gray-400">
              <Clock size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="font-medium">No history yet</p>
              <p className="text-sm mt-1">Your image processing history will appear here</p>
              <Link href="/tool" className="mt-4 inline-block bg-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-violet-700 transition">
                Start Processing
              </Link>
            </div>
          </div>
        )}

        {/* Profile tab */}
        {tab === "profile" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-6">Profile Settings</h3>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{session.user.name}</p>
                  <button className="text-sm text-violet-600 flex items-center gap-1 mt-1 hover:text-violet-700">
                    <Camera size={13} /> Change Photo
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input value={profileName} onChange={e => setProfileName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input value={session.user.email ?? ""} disabled
                    className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-400" />
                </div>
                {saveMsg && (
                  <p className={`text-sm ${saveMsg.includes("!") ? "text-green-600" : "text-red-600"}`}>{saveMsg}</p>
                )}
                <button onClick={saveProfile} disabled={saving}
                  className="bg-violet-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-violet-700 transition flex items-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : null}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
              <h3 className="font-semibold text-red-700 mb-4 flex items-center gap-2"><AlertCircle size={16} /> Danger Zone</h3>
              <p className="text-gray-500 text-sm mb-4">Permanently delete your account and all data. This cannot be undone.</p>
              <div className="flex gap-3 items-center">
                <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
                  placeholder='Type "DELETE" to confirm'
                  className="border border-red-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                <button onClick={deleteAccount} disabled={deleteConfirm !== "DELETE"}
                  className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-red-600 transition disabled:opacity-40 text-sm">
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-violet-500" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
