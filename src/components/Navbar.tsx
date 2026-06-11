"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-black text-xl text-gray-900">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
            <Zap size={16} className="text-white" fill="currentColor" />
          </div>
          BG Remover
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/upload" onClick={() => setOpen(false)} className="text-gray-700 font-medium hover:text-violet-600 transition py-1">Upload</Link>
          <Link href="/pricing" className="text-gray-600 hover:text-violet-600 transition text-sm font-medium">Pricing</Link>
          <Link href="/blog" className="text-gray-600 hover:text-violet-600 transition text-sm font-medium">Blog</Link>
          <Link href="/#how-it-works" className="text-gray-600 hover:text-violet-600 transition text-sm font-medium">How It Works</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-xl hover:border-violet-300 transition bg-white">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                  <User size={13} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{session.user.name?.split(" ")[0]}</span>
                <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap size={10} fill="currentColor" /> {session.user.credits}
                </span>
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-1">
                  <Link href="/dashboard" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <button onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition w-full">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition">Sign In</Link>
              <Link href="/auth/signup"
                className="btn-primary text-white px-4 py-2 rounded-xl text-sm font-black">
                Get Started Free
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-gray-600 hover:text-gray-900 transition" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3 shadow-lg">
          <Link href="/upload" onClick={() => setOpen(false)} className="text-gray-700 font-medium hover:text-violet-600 transition py-1">Upload</Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="text-gray-700 font-medium hover:text-violet-600 transition py-1">Pricing</Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="text-gray-700 font-medium hover:text-violet-600 transition py-1">Blog</Link>
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-gray-700 font-medium hover:text-violet-600 transition py-1">
                Dashboard <span className="text-violet-600 font-bold">({session.user.credits} credits)</span>
              </Link>
              <button onClick={() => signOut()} className="text-red-500 font-medium text-left hover:text-red-600 transition py-1">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" onClick={() => setOpen(false)} className="text-gray-700 font-medium hover:text-violet-600 transition py-1">Sign In</Link>
              <Link href="/auth/signup" onClick={() => setOpen(false)}
                className="btn-primary text-white px-4 py-2.5 rounded-xl text-center font-black">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
