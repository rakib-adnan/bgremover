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
    <nav className="fixed top-0 w-full bg-[#0a0a14]/95 backdrop-blur border-b border-white/10 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-black text-xl text-white">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" fill="currentColor" />
          </div>
          BG Remover
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/tool" className="text-gray-400 hover:text-white transition text-sm font-medium">Tool</Link>
          <Link href="/pricing" className="text-gray-400 hover:text-white transition text-sm font-medium">Pricing</Link>
          <Link href="/#how-it-works" className="text-gray-400 hover:text-white transition text-sm font-medium">How It Works</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 glass px-3 py-2 rounded-xl transition hover:bg-white/10">
                <div className="w-7 h-7 bg-violet-500/30 rounded-full flex items-center justify-center">
                  <User size={14} className="text-violet-400" />
                </div>
                <span className="text-sm font-medium text-gray-300">{session.user.name?.split(" ")[0]}</span>
                <span className="bg-violet-500/20 text-violet-400 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap size={10} fill="currentColor" /> {session.user.credits}
                </span>
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0d0d1f] rounded-xl border border-white/10 shadow-xl py-1">
                  <Link href="/dashboard" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition">
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <button onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition w-full">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/signin"
                className="text-gray-400 hover:text-white text-sm font-medium transition">Sign In</Link>
              <Link href="/auth/signup"
                className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-black transition">
                Get Started Free
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-gray-400 hover:text-white transition" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#0d0d1f] border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          <Link href="/tool" onClick={() => setOpen(false)} className="text-gray-300 font-medium hover:text-white transition">Tool</Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="text-gray-300 font-medium hover:text-white transition">Pricing</Link>
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}
                className="text-gray-300 font-medium hover:text-white transition">
                Dashboard <span className="text-violet-400 font-bold">({session.user.credits} credits)</span>
              </Link>
              <button onClick={() => signOut()} className="text-red-400 font-medium text-left hover:text-red-300 transition">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" onClick={() => setOpen(false)} className="text-gray-300 font-medium hover:text-white transition">Sign In</Link>
              <Link href="/auth/signup" onClick={() => setOpen(false)}
                className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-center font-black transition">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
