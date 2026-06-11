import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-14">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 text-white font-black text-lg mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                <Zap size={14} className="text-white" fill="currentColor" />
              </div>
              BG Remover
            </div>
            <p className="text-sm leading-relaxed">
              Free AI background removal. Preview images stay private — processed entirely in your browser.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Tool</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/tool" className="hover:text-white transition">Remove Background</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/auth/signup" className="hover:text-white transition">Sign Up Free</Link></li>
              <li><Link href="/auth/signin" className="hover:text-white transition">Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><a href="mailto:support@bgremover.com" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} BG Remover. All rights reserved.</p>
          <p className="text-emerald-500 font-medium">🔒 Privacy-first — free previews never leave your browser</p>
        </div>
      </div>
    </footer>
  );
}
