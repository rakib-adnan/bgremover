import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              BG Remover
            </div>
            <p className="text-sm leading-relaxed">Free AI background removal tool. Your images never leave your device for previews.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Tool</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tool" className="hover:text-white transition">Remove Background</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/signup" className="hover:text-white transition">Sign Up Free</Link></li>
              <li><Link href="/auth/signin" className="hover:text-white transition">Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><a href="mailto:support@bgremover.com" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} BG Remover. All rights reserved.</p>
          <p className="text-green-400 font-medium">🔒 Your images are processed privately — never stored on our servers</p>
        </div>
      </div>
    </footer>
  );
}
