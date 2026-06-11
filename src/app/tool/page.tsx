"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import {
  Upload, Download, Loader2, AlertCircle, Zap, Lock, Plus,
  ChevronDown, Undo2, Redo2, FlipHorizontal, FlipVertical,
  Scissors, ImageIcon, Sparkles, Sliders, LayoutTemplate,
  X, RotateCcw, Paintbrush, Check, ExternalLink, ArrowLeft
} from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
import BrushEditor from "@/components/BrushEditor";

type EditorTab = "cutout" | "background" | "effects" | "adjust" | "design";

interface ImageItem {
  id: string;
  file: File;
  originalUrl: string;
  resultUrl: string | null;
  resultBlob: Blob | null;
  stage: "queued" | "processing" | "done" | "error";
  progress: number;
  error?: string;
  bgColor: string | null;
  flipH: boolean;
  flipV: boolean;
  brightness: number;
  contrast: number;
  undoStack: { url: string; blob: Blob }[];
  redoStack: { url: string; blob: Blob }[];
}

function makeItem(file: File): ImageItem {
  return {
    id: Math.random().toString(36).slice(2),
    file,
    originalUrl: URL.createObjectURL(file),
    resultUrl: null,
    resultBlob: null,
    stage: "queued",
    progress: 0,
    bgColor: null,
    flipH: false,
    flipV: false,
    brightness: 100,
    contrast: 100,
    undoStack: [],
    redoStack: [],
  };
}

const BG_COLORS = [
  { label: "Transparent", value: null },
  { label: "White",  value: "#ffffff" },
  { label: "Black",  value: "#000000" },
  { label: "Navy",   value: "#1e3a5f" },
  { label: "Blue",   value: "#dbeafe" },
  { label: "Pink",   value: "#fce7f3" },
  { label: "Green",  value: "#dcfce7" },
  { label: "Yellow", value: "#fef9c3" },
];

export default function ToolPage() {
  const { data: session } = useSession();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tab, setTab] = useState<EditorTab>("cutout");
  const [credits, setCredits] = useState(session?.user?.credits ?? 0);
  const [hdLoading, setHdLoading] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [brushActive, setBrushActive] = useState(false);
  const [canvaToast, setCanvaToast] = useState(false);
  const processingRef = useRef<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const active = images.find(i => i.id === activeId) ?? null;

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDownloadOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function updateItem(id: string, patch: Partial<ImageItem>) {
    setImages(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  }

  async function compressBlob(blob: Blob, bg: string | null, flipH: boolean, flipV: boolean): Promise<Blob> {
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
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
        canvas.toBlob(b => resolve(b ?? blob), "image/png", 0.92);
      };
      img.src = URL.createObjectURL(blob);
    });
  }

  async function processItem(item: ImageItem) {
    if (processingRef.current.has(item.id)) return;
    processingRef.current.add(item.id);
    updateItem(item.id, { stage: "processing", progress: 5 });
    try {
      const rawBlob = await removeBackground(item.file, {
        progress: (_: string, cur: number, total: number) => {
          updateItem(item.id, { progress: Math.min(90, Math.round((cur / total) * 85) + 5) });
        },
      });
      const compressed = await compressBlob(rawBlob, item.bgColor, item.flipH, item.flipV);
      const url = URL.createObjectURL(compressed);
      updateItem(item.id, { stage: "done", progress: 100, resultBlob: compressed, resultUrl: url, undoStack: [], redoStack: [] });
    } catch {
      updateItem(item.id, { stage: "error", error: "Processing failed. Try another image." });
    }
    processingRef.current.delete(item.id);
  }

  const onDrop = useCallback((files: File[]) => {
    const valid = files.filter(f => f.size <= 12 * 1024 * 1024);
    const newItems = valid.map(makeItem);
    setImages(prev => [...prev, ...newItems]);
    if (!activeId && newItems.length > 0) setActiveId(newItems[0].id);
    newItems.forEach(item => processItem(item));
  }, [activeId]);

  const { getRootProps, getInputProps, isDragActive, open: openPicker } = useDropzone({
    onDrop, accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] }, noClick: true, noKeyboard: true,
  });

  async function applyBackground(id: string, color: string | null) {
    const item = images.find(i => i.id === id);
    if (!item?.resultBlob) return;
    const prev = { url: item.resultUrl!, blob: item.resultBlob };
    updateItem(id, { bgColor: color });
    const raw = await removeBackground(item.file, { progress: () => {} });
    const compressed = await compressBlob(raw, color, item.flipH, item.flipV);
    const url = URL.createObjectURL(compressed);
    updateItem(id, { resultBlob: compressed, resultUrl: url, bgColor: color, undoStack: [...item.undoStack, prev].slice(-10), redoStack: [] });
  }

  async function applyFlip(id: string, axis: "h" | "v") {
    const item = images.find(i => i.id === id);
    if (!item?.resultBlob) return;
    const prev = { url: item.resultUrl!, blob: item.resultBlob };
    const newH = axis === "h" ? !item.flipH : item.flipH;
    const newV = axis === "v" ? !item.flipV : item.flipV;
    const raw = await removeBackground(item.file, { progress: () => {} });
    const compressed = await compressBlob(raw, item.bgColor, newH, newV);
    const url = URL.createObjectURL(compressed);
    updateItem(id, { flipH: newH, flipV: newV, resultBlob: compressed, resultUrl: url, undoStack: [...item.undoStack, prev].slice(-10), redoStack: [] });
  }

  function undo(id: string) {
    const item = images.find(i => i.id === id);
    if (!item || item.undoStack.length === 0) return;
    const prev = item.undoStack[item.undoStack.length - 1];
    updateItem(id, { resultUrl: prev.url, resultBlob: prev.blob, undoStack: item.undoStack.slice(0, -1), redoStack: [...item.redoStack, { url: item.resultUrl!, blob: item.resultBlob! }] });
  }

  function redo(id: string) {
    const item = images.find(i => i.id === id);
    if (!item || item.redoStack.length === 0) return;
    const next = item.redoStack[item.redoStack.length - 1];
    updateItem(id, { resultUrl: next.url, resultBlob: next.blob, redoStack: item.redoStack.slice(0, -1), undoStack: [...item.undoStack, { url: item.resultUrl!, blob: item.resultBlob! }] });
  }

  function downloadFree(item?: ImageItem | null) {
    const target = item ?? active;
    if (!target?.resultBlob) return;
    const url = URL.createObjectURL(target.resultBlob);
    const a = document.createElement("a");
    a.href = url; a.download = `${target.file.name.replace(/\.[^.]+$/, "")}-no-bg.png`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadAllZip() {
    const done = images.filter(i => i.stage === "done" && i.resultBlob);
    if (done.length === 0) return;
    if (done.length === 1) { downloadFree(done[0]); return; }
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    done.forEach(item => zip.file(`${item.file.name.replace(/\.[^.]+$/, "")}-no-bg.png`, item.resultBlob!));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "backgrounds-removed.zip"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async function downloadHD() {
    if (!session || !active?.file) return;
    setHdLoading(true);
    try {
      const form = new FormData();
      form.append("image", active.file);
      const res = await fetch("/api/remove-bg", { method: "POST", body: form });
      if (!res.ok) { setHdLoading(false); return; }
      const remaining = res.headers.get("X-Credits-Remaining");
      if (remaining) setCredits(parseInt(remaining));
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${active.file.name.replace(/\.[^.]+$/, "")}-hd.png`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {}
    setHdLoading(false);
  }

  function editInCanva() {
    if (!active?.resultBlob) return;
    downloadFree(active);
    setTimeout(() => {
      window.open("https://www.canva.com/photo-editor/", "_blank");
      setCanvaToast(true);
      setTimeout(() => setCanvaToast(false), 5000);
    }, 400);
  }

  function removeImage(id: string) {
    setImages(prev => {
      const next = prev.filter(i => i.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  }

  const doneCount = images.filter(i => i.stage === "done").length;

  // ── EMPTY STATE ───────────────────────────────────────────────────────────
  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-gray-900">Background Remover</h1>
            <p className="text-xs text-gray-500">Free · Instant · No watermarks</p>
          </div>
          {session ? (
            <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-full text-sm font-bold text-violet-700">
              <Zap size={13} fill="currentColor" /> {credits} credits
            </div>
          ) : (
            <Link href="/auth/signup" className="btn-primary text-white text-sm font-black px-4 py-2 rounded-xl">
              Sign Up — 3 HD Free
            </Link>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div {...getRootProps()}
            onClick={openPicker}
            className={`w-full max-w-2xl border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all ${
              isDragActive ? "border-violet-500 bg-violet-50" : "border-gray-300 bg-white hover:border-violet-400 hover:bg-violet-50/40"
            }`}>
            <input {...getInputProps()} />
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: "#7c3aed18" }}>
              <Upload size={34} style={{ color: "#7c3aed" }} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">{isDragActive ? "Drop images here!" : "Drop your image here"}</h2>
            <p className="text-gray-500 mb-6">or click to browse · JPG, PNG, WEBP · Max 12MB · Multiple images supported</p>
            <div className="inline-flex items-center gap-2 btn-primary text-white font-black px-8 py-3.5 rounded-xl">
              <Upload size={17} /> Choose Image
            </div>
            <p className="text-xs text-gray-400 mt-4">✓ Free forever · ✓ No watermarks · ✓ No sign-up needed</p>
          </div>
        </div>
      </div>
    );
  }

  // ── EDITOR STATE ──────────────────────────────────────────────────────────
  const TABS: { id: EditorTab; label: string; icon: React.ElementType }[] = [
    { id: "cutout",     label: "Cutout",     icon: Scissors },
    { id: "background", label: "Background", icon: ImageIcon },
    { id: "effects",    label: "Effects",    icon: Sparkles },
    { id: "adjust",     label: "Adjust",     icon: Sliders },
    { id: "design",     label: "Design",     icon: LayoutTemplate },
  ];

  return (
    <div className="flex flex-col bg-[#f0f0f2]" style={{ height: "100vh" }}>

      {/* ── TOP EDITOR BAR ─────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 flex items-center px-3 py-2 gap-2">

        {/* Back link */}
        <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm font-bold transition mr-1 flex-shrink-0">
          <ArrowLeft size={15} />
        </Link>

        <div className="w-px h-5 bg-gray-200 flex-shrink-0" />

        {/* Editor tabs */}
        <div className="flex items-center gap-0.5 flex-1 min-w-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                tab === id ? "bg-violet-100 text-violet-700" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Right side — never overflow */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-px h-5 bg-gray-200" />

          <button onClick={() => active && undo(active.id)} disabled={!active || active.undoStack.length === 0}
            title="Undo"
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition">
            <Undo2 size={16} />
          </button>
          <button onClick={() => active && redo(active.id)} disabled={!active || active.redoStack.length === 0}
            title="Redo"
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition">
            <Redo2 size={16} />
          </button>

          <div className="w-px h-5 bg-gray-200" />

          {session && (
            <div className="flex items-center gap-1 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full text-xs font-bold text-violet-700">
              <Zap size={11} fill="currentColor" /> {credits}
            </div>
          )}

          {/* Download — outside overflow container so dropdown never clips */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDownloadOpen(o => !o)}
              className="flex items-center gap-1.5 text-sm font-black text-white px-4 py-1.5 rounded-xl transition"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
              <Download size={14} />
              Download
              <ChevronDown size={13} className={`transition-transform duration-200 ${downloadOpen ? "rotate-180" : ""}`} />
            </button>

            {downloadOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] w-60 bg-white rounded-2xl border border-gray-200 overflow-hidden z-[999]"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>

                <button
                  onClick={() => { downloadFree(); setDownloadOpen(false); }}
                  disabled={!active || active.stage !== "done"}
                  className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  <Download size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-gray-800">Free PNG Download</div>
                    <div className="text-xs text-gray-400 mt-0.5">Optimised · No watermark</div>
                  </div>
                </button>

                {!session ? (
                  <Link href="/auth/signup" onClick={() => setDownloadOpen(false)}
                    className="flex items-start gap-3 px-4 py-3.5 hover:bg-violet-50 border-t border-gray-100 transition">
                    <Lock size={16} className="text-violet-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-violet-700">Sign Up for HD</div>
                      <div className="text-xs text-violet-400 mt-0.5">3 free HD downloads/day</div>
                    </div>
                  </Link>
                ) : credits > 0 ? (
                  <button
                    onClick={() => { downloadHD(); setDownloadOpen(false); }}
                    disabled={hdLoading || !active || active.stage !== "done"}
                    className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-violet-50 border-t border-gray-100 disabled:opacity-40 transition">
                    {hdLoading ? <Loader2 size={16} className="animate-spin text-violet-500 mt-0.5 flex-shrink-0" /> : <Zap size={16} className="text-violet-500 mt-0.5 flex-shrink-0" />}
                    <div>
                      <div className="text-sm font-bold text-violet-700">HD Download</div>
                      <div className="text-xs text-violet-400 mt-0.5">Full resolution · 1 credit</div>
                    </div>
                  </button>
                ) : (
                  <Link href="/pricing" onClick={() => setDownloadOpen(false)}
                    className="flex items-start gap-3 px-4 py-3.5 hover:bg-violet-50 border-t border-gray-100 transition">
                    <Zap size={16} className="text-violet-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-violet-700">Buy Credits</div>
                      <div className="text-xs text-violet-400 mt-0.5">Unlock HD downloads</div>
                    </div>
                  </Link>
                )}

                {doneCount > 1 && (
                  <button
                    onClick={() => { downloadAllZip(); setDownloadOpen(false); }}
                    className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-emerald-50 border-t border-gray-100 transition">
                    <Download size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-emerald-700">Download All as ZIP</div>
                      <div className="text-xs text-emerald-500 mt-0.5">{doneCount} images bundled</div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN BODY ──────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Left panel */}
        <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">

          {tab === "cutout" && (
            <div className="p-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Cutout</p>
              {active?.stage === "done" ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Check size={13} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-900">Background removed</div>
                      <div className="text-[10px] text-gray-400">Transparent PNG ready</div>
                    </div>
                  </div>
                  <button onClick={() => setBrushActive(true)}
                    className="w-full flex items-center justify-center gap-2 border border-violet-200 text-violet-700 hover:bg-violet-50 py-2.5 rounded-xl text-sm font-bold transition">
                    <Paintbrush size={13} /> Refine with Brush
                  </button>
                  <button onClick={() => active && processItem({ ...active })}
                    className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-bold transition">
                    <RotateCcw size={13} /> Re-process
                  </button>
                </div>
              ) : active?.stage === "processing" ? (
                <div className="text-center py-8">
                  <Loader2 size={28} className="animate-spin text-violet-600 mx-auto mb-3" />
                  <div className="text-sm font-bold text-gray-700 mb-3">Processing…</div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${active.progress}%`, background: "linear-gradient(90deg,#7c3aed,#3b82f6)" }} />
                  </div>
                  <div className="text-xs text-gray-400 mt-1.5">{active.progress}%</div>
                </div>
              ) : active?.stage === "error" ? (
                <div className="text-center py-6">
                  <AlertCircle size={28} className="text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-red-500 font-bold mb-3">{active.error}</p>
                  <button onClick={() => active && processItem(active)} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition">Retry</button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">Select an image below</div>
              )}
            </div>
          )}

          {tab === "background" && (
            <div className="p-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Background</p>
              {active?.stage === "done" ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Solid Color</p>
                    <div className="grid grid-cols-4 gap-2">
                      {BG_COLORS.map(({ label, value }) => (
                        <button key={label} title={label}
                          onClick={() => active && applyBackground(active.id, value)}
                          className={`w-full aspect-square rounded-xl border-2 transition-all hover:scale-105 ${active.bgColor === value ? "border-violet-500 ring-2 ring-violet-200" : "border-gray-200 hover:border-gray-400"}`}
                          style={{ background: value ?? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' fill='%23d1d5db'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23d1d5db'/%3E%3Crect x='4' y='0' width='4' height='4' fill='%23fff'/%3E%3Crect x='0' y='4' width='4' height='4' fill='%23fff'/%3E%3C/svg%3E\")" }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Custom Color</p>
                    <div className="flex items-center gap-2">
                      <input type="color" defaultValue="#ffffff"
                        onChange={e => active && applyBackground(active.id, e.target.value)}
                        className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-1" />
                      <span className="text-xs text-gray-500">Pick any color</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Image / Gradient</p>
                    <button className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3.5 text-xs text-gray-400 font-bold hover:border-violet-300 hover:text-violet-500 transition flex items-center justify-center gap-2">
                      <Lock size={11} /> Upload Background — Pro
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">Process an image first</div>
              )}
            </div>
          )}

          {tab === "effects" && (
            <div className="p-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Effects</p>
              {active?.stage === "done" ? (
                <div className="space-y-5">
                  {[
                    { label: "Brightness", key: "brightness" as const, min: 50, max: 200 },
                    { label: "Contrast",   key: "contrast"   as const, min: 50, max: 200 },
                  ].map(({ label, key, min, max }) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-700">{label}</span>
                        <span className="text-xs text-gray-400 tabular-nums">{active[key]}%</span>
                      </div>
                      <input type="range" min={min} max={max} value={active[key]}
                        onChange={e => updateItem(active.id, { [key]: parseInt(e.target.value) } as Partial<ImageItem>)}
                        className="w-full cursor-pointer accent-violet-600 h-1.5" />
                    </div>
                  ))}
                  <div className="space-y-2 pt-1">
                    {["Add Shadow", "Blur Background", "Vintage Filter"].map(f => (
                      <button key={f} className="w-full border-2 border-dashed border-gray-200 rounded-xl py-2.5 text-xs text-gray-400 font-bold hover:border-violet-300 hover:text-violet-500 transition flex items-center justify-center gap-2">
                        <Lock size={11} /> {f} — Pro
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">Process an image first</div>
              )}
            </div>
          )}

          {tab === "adjust" && (
            <div className="p-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Adjust</p>
              {active?.stage === "done" ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Flip</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => active && applyFlip(active.id, "h")}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border-2 transition ${active.flipH ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                        <FlipHorizontal size={13} /> Horizontal
                      </button>
                      <button onClick={() => active && applyFlip(active.id, "v")}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border-2 transition ${active.flipV ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                        <FlipVertical size={13} /> Vertical
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {["Rotate 90°", "Crop & Resize", "Perspective"].map(f => (
                      <button key={f} className="w-full border-2 border-dashed border-gray-200 rounded-xl py-2.5 text-xs text-gray-400 font-bold hover:border-violet-300 hover:text-violet-500 transition flex items-center justify-center gap-2">
                        <Lock size={11} /> {f} — Pro
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">Process an image first</div>
              )}
            </div>
          )}

          {tab === "design" && (
            <div className="p-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Design</p>
              <div className="space-y-2 mb-4">
                {["Add Text Overlay", "Add Logo / Watermark", "Social Media Presets", "Custom Templates"].map(f => (
                  <button key={f} className="w-full border-2 border-dashed border-gray-200 rounded-xl py-2.5 text-xs text-gray-400 font-bold hover:border-violet-300 hover:text-violet-500 transition flex items-center justify-center gap-2">
                    <Lock size={11} /> {f} — Pro
                  </button>
                ))}
              </div>
              <Link href="/pricing" className="w-full btn-primary text-white text-sm font-black py-3 rounded-xl flex items-center justify-center gap-2">
                <Zap size={14} fill="currentColor" /> Unlock Pro
              </Link>
            </div>
          )}
        </div>

        {/* Canvas area */}
        <div className="flex-1 flex flex-col items-center justify-center relative p-6 overflow-hidden">

          {/* Canva toast */}
          {canvaToast && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2">
              <Check size={14} className="text-green-400" />
              Image saved! Drag it onto Canva to edit
              <X size={13} className="text-gray-400 cursor-pointer ml-1" onClick={() => setCanvaToast(false)} />
            </div>
          )}

          {active ? (
            <>
              {brushActive && active.resultBlob ? (
                <BrushEditor
                  resultBlob={active.resultBlob}
                  originalSrc={active.originalUrl}
                  onDone={(edited) => {
                    const url = URL.createObjectURL(edited);
                    const prev = { url: active.resultUrl!, blob: active.resultBlob! };
                    updateItem(active.id, { resultBlob: edited, resultUrl: url, undoStack: [...active.undoStack, prev].slice(-10), redoStack: [] });
                    setBrushActive(false);
                  }}
                  onCancel={() => setBrushActive(false)}
                />
              ) : active.stage === "done" && active.resultUrl ? (
                <div className="relative group max-w-full max-h-full">
                  <div
                    className={`rounded-2xl overflow-hidden ${active.bgColor ? "" : "checker"}`}
                    style={{
                      maxWidth: "min(720px, calc(100vw - 290px))",
                      maxHeight: "calc(100vh - 160px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <img
                      src={active.resultUrl}
                      alt="Result"
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        maxHeight: "calc(100vh - 160px)",
                        width: "auto",
                        height: "auto",
                        filter: `brightness(${active.brightness}%) contrast(${active.contrast}%)`,
                      }}
                    />
                  </div>

                  {/* Edit in Canva */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button onClick={editInCanva}
                      className="flex items-center gap-2 bg-white/95 border border-gray-200 shadow-lg px-3 py-2 rounded-xl text-sm font-bold text-gray-800 hover:bg-white transition-all hover:shadow-xl">
                      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: "#7C3AED" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      Edit in Canva
                      <ExternalLink size={10} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              ) : active.stage === "processing" ? (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-3xl bg-white border border-gray-200 shadow flex items-center justify-center mx-auto mb-4">
                    <Loader2 size={32} className="animate-spin text-violet-600" />
                  </div>
                  <p className="text-gray-800 font-black text-lg mb-3">Removing background…</p>
                  <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${active.progress}%`, background: "linear-gradient(90deg,#7c3aed,#3b82f6)" }} />
                  </div>
                  <p className="text-gray-400 text-sm mt-1.5">{active.progress}%</p>
                </div>
              ) : active.stage === "error" ? (
                <div className="text-center">
                  <AlertCircle size={44} className="text-red-400 mx-auto mb-3" />
                  <p className="text-red-500 font-semibold mb-4">{active.error}</p>
                  <button onClick={() => processItem(active)} className="border border-gray-200 px-6 py-2.5 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition">Retry</button>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Loader2 size={28} className="animate-spin mx-auto mb-2" />
                  <p className="text-sm">Queued for processing…</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400">
              <ImageIcon size={44} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select an image below</p>
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM IMAGE STRIP ─────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200">
        <div {...getRootProps()} className="px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
          <input {...getInputProps()} />
          {images.map(item => (
            <div key={item.id}
              onClick={() => setActiveId(item.id)}
              className={`relative flex-shrink-0 w-[52px] h-[52px] rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                activeId === item.id ? "border-violet-500 shadow-md" : "border-gray-200 hover:border-violet-300"
              }`}>
              {item.stage === "done" && item.resultUrl ? (
                <div className="w-full h-full checker">
                  <img src={item.resultUrl} alt="" className="w-full h-full object-contain" />
                </div>
              ) : item.stage === "processing" ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin text-violet-500" />
                </div>
              ) : item.stage === "error" ? (
                <div className="w-full h-full bg-red-50 flex items-center justify-center">
                  <AlertCircle size={16} className="text-red-400" />
                </div>
              ) : (
                <img src={item.originalUrl} alt="" className="w-full h-full object-cover" />
              )}
              <button
                onClick={e => { e.stopPropagation(); removeImage(item.id); }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <X size={7} className="text-white" />
              </button>
            </div>
          ))}

          <button onClick={openPicker}
            className="flex-shrink-0 w-[52px] h-[52px] rounded-xl border-2 border-dashed border-gray-300 hover:border-violet-400 hover:bg-violet-50/50 flex items-center justify-center transition-all group">
            <Plus size={20} className="text-gray-400 group-hover:text-violet-600 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
