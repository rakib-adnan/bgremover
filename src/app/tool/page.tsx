"use client";
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import Link from "next/link";
import { Upload, Download, Loader2, AlertCircle, RotateCcw, Zap, Lock, ImagePlus, Paintbrush } from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
import BrushEditor from "@/components/BrushEditor";

type Stage = "idle" | "processing" | "done" | "error" | "brush";

export default function ToolPage() {
  const { data: session } = useSession();
  const [original, setOriginal] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState(session?.user?.credits ?? 0);
  const [hdLoading, setHdLoading] = useState(false);
  const [bgColor, setBgColor] = useState<string | null>(null);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) { setError("File too large. Max 12MB."); return; }
    reset();
    const objUrl = URL.createObjectURL(file);
    setOriginal(objUrl);
    setOriginalFile(file);
    processImage(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] }, maxFiles: 1,
  });

  async function processImage(file: File, bg: string | null = null) {
    setStage("processing"); setProgress(5);
    try {
      const blob = await removeBackground(file, {
        progress: (_: string, cur: number, total: number) =>
          setProgress(Math.min(93, Math.round((cur / total) * 88) + 5)),
      });
      const optimised = await compressImage(blob, bg);
      setResultBlob(optimised);
      setResult(URL.createObjectURL(optimised));
      setStage("done"); setProgress(100);
    } catch {
      setError("Processing failed. Please try another image.");
      setStage("error");
    }
  }

  async function compressImage(blob: Blob, bg: string | null = bgColor): Promise<Blob> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1800;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width >= height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height); }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(b => resolve(b ?? blob), "image/png", 0.92);
      };
      img.src = URL.createObjectURL(blob);
    });
  }

  function downloadFree() {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a"); a.href = url; a.download = "bg-removed.png"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadHD() {
    if (!session || !originalFile) return;
    setHdLoading(true); setError("");
    try {
      const form = new FormData();
      form.append("image", originalFile);
      const res = await fetch("/api/remove-bg", { method: "POST", body: form });
      if (res.status === 402) { setError("No credits. Buy credits to continue."); setHdLoading(false); return; }
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "HD failed"); setHdLoading(false); return; }
      const remaining = res.headers.get("X-Credits-Remaining");
      if (remaining) setCredits(parseInt(remaining));
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "bg-removed-hd.png"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setError("HD download failed."); }
    setHdLoading(false);
  }

  function handleBrushDone(edited: Blob) {
    setResultBlob(edited);
    setResult(URL.createObjectURL(edited));
    setStage("done");
  }

  function reset() {
    setOriginal(null); setOriginalFile(null); setResult(null); setResultBlob(null);
    setStage("idle"); setProgress(0); setError(""); setBgColor(null);
  }

  return (
    <div className="min-h-screen bg-[#0a0a14]">

      {/* Top bar */}
      <div className="bg-[#0d0d1f] border-b border-white/10 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-black text-white">Background Remover</h1>
            <p className="text-xs text-gray-500">Free · Instant · No watermarks</p>
          </div>
          {session ? (
            <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full text-sm font-bold text-violet-300">
              <Zap size={13} fill="currentColor" /> {credits} credits
            </div>
          ) : (
            <Link href="/auth/signup" className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-black px-4 py-2 rounded-xl transition">
              Sign Up — 3 HD Free
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* IDLE */}
        {stage === "idle" && (
          <div {...getRootProps()}
            className={`border-2 border-dashed rounded-3xl p-20 text-center cursor-pointer transition-all duration-200 ${
              isDragActive ? "border-violet-500 bg-violet-500/10 scale-[1.01]" : "border-white/10 bg-[#0d0d1f] hover:border-violet-500/50 hover:bg-violet-500/5"
            }`}>
            <input {...getInputProps()} />
            <div className="w-20 h-20 bg-violet-500/15 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <ImagePlus size={34} className="text-violet-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              {isDragActive ? "Drop it here!" : "Drop your image here"}
            </h2>
            <p className="text-gray-500 mb-6">or click to browse · JPG, PNG, WEBP · Max 12MB</p>
            <div className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-black px-8 py-3.5 rounded-xl transition">
              <Upload size={17} /> Choose Image
            </div>
            <p className="text-xs text-gray-600 mt-4">✓ Free · ✓ No watermarks · ✓ No sign-up needed</p>
          </div>
        )}

        {/* PROCESSING */}
        {stage === "processing" && (
          <div className="bg-[#0d0d1f] rounded-3xl p-16 text-center border border-white/10">
            <div className="w-20 h-20 bg-violet-500/15 rounded-3xl flex items-center justify-center mx-auto mb-5 relative">
              <Loader2 size={32} className="text-violet-400 animate-spin" />
              <div className="absolute inset-0 rounded-3xl border-2 border-violet-500/30 animate-ping" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Removing Background…</h2>
            <p className="text-gray-500 mb-6">AI is processing your image</p>
            <div className="max-w-xs mx-auto bg-white/5 rounded-full h-2.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-gray-600 mt-2">{progress}%</p>
          </div>
        )}

        {/* ERROR */}
        {stage === "error" && (
          <div className="bg-[#0d0d1f] rounded-3xl p-10 text-center border border-red-500/20">
            <AlertCircle size={44} className="text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-semibold mb-5">{error}</p>
            <button onClick={reset} className="glass text-white px-6 py-2.5 rounded-xl font-bold hover:bg-white/10 transition">Try Again</button>
          </div>
        )}

        {/* BRUSH EDITOR */}
        {stage === "brush" && resultBlob && original && (
          <BrushEditor
            resultBlob={resultBlob}
            originalSrc={original}
            onDone={handleBrushDone}
            onCancel={() => setStage("done")}
          />
        )}

        {/* RESULT */}
        {stage === "done" && original && result && (
          <div className="space-y-5">

            {/* Comparison */}
            <div className="bg-[#0d0d1f] rounded-3xl overflow-hidden border border-white/10">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="font-black text-white">Done!</span>
                  <span className="text-gray-500 text-sm ml-1">Drag slider to compare</span>
                </div>
                <button onClick={reset} className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm font-semibold transition">
                  <RotateCcw size={14} /> New image
                </button>
              </div>
              <ReactCompareSlider
                itemOne={<ReactCompareSliderImage src={original} alt="Original" />}
                itemTwo={
                  <div className="w-full h-full" style={{ background: bgColor ?? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23333'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23333'/%3E%3Crect x='10' y='0' width='10' height='10' fill='%23222'/%3E%3Crect x='0' y='10' width='10' height='10' fill='%23222'/%3E%3C/svg%3E\")" }}>
                    <ReactCompareSliderImage src={result} alt="Result" />
                  </div>
                }
                style={{ height: "420px" }}
              />
            </div>

            {/* Background colour + Brush row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* BG colour */}
              <div className="bg-[#0d0d1f] rounded-2xl p-5 border border-white/10">
                <p className="text-sm font-bold text-white mb-3">Background Colour</p>
                <div className="flex gap-2 flex-wrap">
                  {[null, "#ffffff", "#000000", "#1e1e2e", "#dbeafe", "#fce7f3", "#dcfce7", "#fef9c3"].map(c => (
                    <button key={c ?? "transparent"}
                      onClick={() => {
                        setBgColor(c);
                        if (originalFile) {
                          const f = originalFile;
                          setTimeout(() => processImage(f, c), 0);
                        }
                      }}
                      title={c ?? "transparent"}
                      className={`w-8 h-8 rounded-lg border-2 transition hover:scale-110 ${bgColor === c ? "border-violet-500 scale-110" : "border-white/20"}`}
                      style={{ background: c ?? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' fill='%23555'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23555'/%3E%3Crect x='4' y='0' width='4' height='4' fill='%23333'/%3E%3Crect x='0' y='4' width='4' height='4' fill='%23333'/%3E%3C/svg%3E\")" }}
                    />
                  ))}
                </div>
              </div>

              {/* Brush tool */}
              <div className="bg-[#0d0d1f] rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
                <p className="text-sm font-bold text-white mb-2">Manual Refinement</p>
                <p className="text-xs text-gray-500 mb-4">Use the brush to erase or restore parts of your image</p>
                <button onClick={() => setStage("brush")}
                  className="flex items-center justify-center gap-2 glass border border-violet-500/40 text-violet-300 hover:bg-violet-500/15 py-2.5 rounded-xl font-bold text-sm transition">
                  <Paintbrush size={15} /> Open Brush Editor
                </button>
              </div>
            </div>

            {/* Download */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-[#0d0d1f] rounded-2xl p-6 border border-white/10">
                <p className="font-black text-white mb-0.5">Free Download</p>
                <p className="text-xs text-gray-500 mb-4">Optimised PNG · Always free · No watermark</p>
                <button onClick={downloadFree}
                  className="w-full glass border border-white/20 hover:bg-white/10 text-white py-3 rounded-xl font-black transition flex items-center justify-center gap-2">
                  <Download size={16} /> Download Free
                </button>
              </div>

              <div className="rounded-2xl p-6 bg-gradient-to-br from-violet-600 to-blue-600">
                <p className="font-black text-white mb-0.5">HD Download</p>
                <p className="text-xs text-violet-200 mb-4">
                  {session ? `Full resolution · 1 credit · ${credits} remaining` : "Sign in for 3 free HD/day"}
                </p>
                {!session ? (
                  <Link href="/auth/signup"
                    className="w-full bg-white text-violet-700 py-3 rounded-xl font-black transition flex items-center justify-center gap-2 hover:bg-violet-50 block text-center">
                    <Lock size={15} /> Sign Up — Free HD
                  </Link>
                ) : credits > 0 ? (
                  <button onClick={downloadHD} disabled={hdLoading}
                    className="w-full bg-white text-violet-700 py-3 rounded-xl font-black transition flex items-center justify-center gap-2 hover:bg-violet-50 disabled:opacity-60">
                    {hdLoading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                    {hdLoading ? "Processing…" : "Download HD"}
                  </button>
                ) : (
                  <Link href="/pricing"
                    className="w-full bg-white text-violet-700 py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-violet-50 block text-center">
                    <Zap size={15} /> Buy Credits
                  </Link>
                )}
                {error && <p className="text-red-300 text-xs mt-2">{error}</p>}
              </div>
            </div>

            <button onClick={reset} className="w-full text-gray-600 hover:text-gray-400 text-sm font-semibold flex items-center justify-center gap-2 py-2 transition">
              <Upload size={14} /> Remove another image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
