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
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          BG Remover
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/tool" className="text-gray-600 hover:text-gray-900 transition">Tool</Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</Link>
          <Link href="/#how-it-works" className="text-gray-600 hover:text-gray-900 transition">How It Works</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition">
                <div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center">
                  <User size={14} className="text-violet-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{session.user.name?.split(" ")[0]}</span>
                <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5 rounded-full">{session.user.credits} credits</span>
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1">
                  <Link href="/dashboard" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <button onClick={() => signOut()} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition">Sign In</Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-violet-600 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
                Get Started Free
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <Link href="/tool" onClick={() => setOpen(false)} className="text-gray-700 font-medium">Tool</Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="text-gray-700 font-medium">Pricing</Link>
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-gray-700 font-medium">Dashboard ({session.user.credits} credits)</Link>
              <button onClick={() => signOut()} className="text-red-600 font-medium text-left">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" onClick={() => setOpen(false)} className="text-gray-700 font-medium">Sign In</Link>
              <Link href="/auth/signup" onClick={() => setOpen(false)} className="bg-gradient-to-r from-violet-600 to-blue-500 text-white px-4 py-2 rounded-lg text-center font-medium">Get Started Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
