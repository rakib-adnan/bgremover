"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import {
  Upload, Download, Loader2, AlertCircle, Zap, Lock, Plus,
  ChevronDown, Undo2, Redo2, FlipHorizontal, FlipVertical,
  Scissors, ImageIcon, Sparkles, Sliders, LayoutTemplate,
  X, RotateCcw, Paintbrush, Check, ExternalLink,
} from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
import BrushEditor from "@/components/BrushEditor";

// ── IndexedDB ─────────────────────────────────────────────────────────────
const IDB_NAME = "bgremover", IDB_STORE = "images";
interface IDBEntry {
  id: string; order: number; fileName: string; fileType: string;
  fileData: ArrayBuffer; resultData: ArrayBuffer | null;
  bgColor: string | null; flipH: boolean; flipV: boolean;
  brightness: number; contrast: number;
}
function openIDB(): Promise<IDBDatabase> {
  return new Promise((ok, err) => {
    const r = indexedDB.open(IDB_NAME, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(IDB_STORE, { keyPath: "id" });
    r.onsuccess = () => ok(r.result); r.onerror = () => err(r.error);
  });
}
async function idbSave(e: IDBEntry) {
  const db = await openIDB();
  return new Promise<void>((ok, err) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(e);
    tx.oncomplete = () => ok(); tx.onerror = () => err(tx.error);
  });
}
async function idbLoadAll(): Promise<IDBEntry[]> {
  const db = await openIDB();
  return new Promise((ok, err) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const r = tx.objectStore(IDB_STORE).getAll();
    r.onsuccess = () => ok((r.result as IDBEntry[]).sort((a, b) => a.order - b.order));
    r.onerror = () => err(r.error);
  });
}
async function idbDelete(id: string) {
  const db = await openIDB();
  return new Promise<void>((ok, err) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(id);
    tx.oncomplete = () => ok(); tx.onerror = () => err(tx.error);
  });
}

// ── Types ──────────────────────────────────────────────────────────────────
type Tab = "cutout" | "background" | "effects" | "adjust" | "design";
interface Img {
  id: string; order: number; file: File;
  origUrl: string; resultUrl: string | null; resultBlob: Blob | null;
  stage: "queued" | "processing" | "done" | "error";
  progress: number; error?: string;
  bgColor: string | null; flipH: boolean; flipV: boolean;
  brightness: number; contrast: number;
  undoStack: { url: string; blob: Blob }[];
  redoStack: { url: string; blob: Blob }[];
}
function mkImg(file: File, order: number): Img {
  return { id: crypto.randomUUID(), order, file, origUrl: URL.createObjectURL(file),
    resultUrl: null, resultBlob: null, stage: "queued", progress: 0,
    bgColor: null, flipH: false, flipV: false, brightness: 100, contrast: 100,
    undoStack: [], redoStack: [] };
}

const BG_COLORS = [
  { v: null,      s: `repeating-conic-gradient(#e0e0e0 0% 25%,#fff 0% 50%) 0 0/16px 16px` },
  { v: "#ffffff", s: "#ffffff" }, { v: "#111111", s: "#111111" }, { v: "#1e3a5f", s: "#1e3a5f" },
  { v: "#dbeafe", s: "#dbeafe" }, { v: "#fce7f3", s: "#fce7f3" }, { v: "#dcfce7", s: "#dcfce7" },
  { v: "#fef9c3", s: "#fef9c3" }, { v: "#ede9fe", s: "#ede9fe" }, { v: "#ffedd5", s: "#ffedd5" },
  { v: "#f0f4c3", s: "#f0f4c3" }, { v: "#e0f2fe", s: "#e0f2fe" },
];

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "cutout",     label: "Erase / Restore", Icon: Scissors },
  { id: "background", label: "Background",       Icon: ImageIcon },
  { id: "effects",    label: "Effects",          Icon: Sparkles },
  { id: "adjust",     label: "Adjust",           Icon: Sliders },
  { id: "design",     label: "Design",           Icon: LayoutTemplate },
];

// ── Main component ─────────────────────────────────────────────────────────
export default function ToolPage() {
  const { data: session } = useSession();
  const [imgs, setImgs]       = useState<Img[]>([]);
  const [aid, setAid]         = useState<string | null>(null);
  const [tab, setTab]         = useState<Tab>("cutout");
  const [credits, setCredits] = useState(session?.user?.credits ?? 0);
  const [hdLoad, setHdLoad]   = useState(false);
  const [dlOpen, setDlOpen]   = useState(false);
  const [brush, setBrush]     = useState(false);
  const [toast, setToast]     = useState(false);
  const [ready, setReady]     = useState(false);
  const processing = useRef<Set<string>>(new Set());
  const dlRef      = useRef<HTMLDivElement>(null);
  const orderRef   = useRef(Date.now());
  const active     = imgs.find(i => i.id === aid) ?? null;

  // restore from IDB
  useEffect(() => {
    (async () => {
      try {
        const entries = await idbLoadAll();
        if (!entries.length) { setReady(true); return; }
        const items: Img[] = entries.map(e => {
          const file = new File([e.fileData], e.fileName, { type: e.fileType });
          const origUrl = URL.createObjectURL(file);
          let resultUrl: string | null = null, resultBlob: Blob | null = null;
          if (e.resultData) {
            resultBlob = new Blob([e.resultData], { type: "image/png" });
            resultUrl  = URL.createObjectURL(resultBlob);
          }
          return { id: e.id, order: e.order, file, origUrl, resultUrl, resultBlob,
            stage: resultUrl ? "done" : "queued", progress: resultUrl ? 100 : 0,
            bgColor: e.bgColor, flipH: e.flipH, flipV: e.flipV,
            brightness: e.brightness, contrast: e.contrast, undoStack: [], redoStack: [] } as Img;
        });
        setImgs(items); setAid(items[0]?.id ?? null);
        orderRef.current = Math.max(...items.map(i => i.order)) + 1;
        items.filter(i => i.stage === "queued").forEach(process);
      } catch {}
      setReady(true);
    })();
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => { if (dlRef.current && !dlRef.current.contains(e.target as Node)) setDlOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function upd(id: string, p: Partial<Img>) { setImgs(prev => prev.map(i => i.id === id ? { ...i, ...p } : i)); }

  async function compress(blob: Blob, bg: string | null, fh: boolean, fv: boolean): Promise<Blob> {
    return new Promise(res => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1800; let { width: w, height: h } = img;
        if (w > MAX || h > MAX) { if (w >= h) { h = Math.round(h * MAX / w); w = MAX; } else { w = Math.round(w * MAX / h); h = MAX; } }
        const c = document.createElement("canvas"); c.width = w; c.height = h;
        const ctx = c.getContext("2d")!;
        if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); }
        ctx.save(); ctx.translate(w / 2, h / 2); ctx.scale(fh ? -1 : 1, fv ? -1 : 1); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
        c.toBlob(b => res(b ?? blob), "image/png", 0.92);
      };
      img.src = URL.createObjectURL(blob);
    });
  }

  async function process(item: Img, attempt = 0) {
    if (processing.current.has(item.id)) return;
    processing.current.add(item.id);
    upd(item.id, { stage: "processing", progress: 5 });
    try {
      // timeout after 90s — model can stall on first WASM load
      const raw = await Promise.race([
        removeBackground(item.file, {
          progress: (_: string, c: number, t: number) => upd(item.id, { progress: Math.min(90, Math.round(c / t * 85) + 5) }),
        }),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 90_000)),
      ]);
      const comp = await compress(raw, item.bgColor, item.flipH, item.flipV);
      const url  = URL.createObjectURL(comp);
      upd(item.id, { stage: "done", progress: 100, resultBlob: comp, resultUrl: url, undoStack: [], redoStack: [] });
      const [rd, fd] = await Promise.all([comp.arrayBuffer(), item.file.arrayBuffer()]);
      await idbSave({ id: item.id, order: item.order, fileName: item.file.name, fileType: item.file.type,
        fileData: fd, resultData: rd, bgColor: item.bgColor, flipH: item.flipH, flipV: item.flipV,
        brightness: item.brightness, contrast: item.contrast });
    } catch (e: any) {
      processing.current.delete(item.id);
      // auto-retry once on timeout (WASM model cold-start can stall)
      if (e?.message === "timeout" && attempt === 0) {
        upd(item.id, { progress: 5 });
        process(item, 1);
        return;
      }
      upd(item.id, { stage: "error", error: "Processing failed. Tap Retry." });
    }
    processing.current.delete(item.id);
  }

  async function persist(item: Img, blob: Blob, extra?: Partial<IDBEntry>) {
    try {
      const [rd, fd] = await Promise.all([blob.arrayBuffer(), item.file.arrayBuffer()]);
      await idbSave({ id: item.id, order: item.order, fileName: item.file.name, fileType: item.file.type,
        fileData: fd, resultData: rd, bgColor: item.bgColor, flipH: item.flipH, flipV: item.flipV,
        brightness: item.brightness, contrast: item.contrast, ...extra });
    } catch {}
  }

  const onDrop = useCallback((files: File[]) => {
    const valid = files.filter(f => f.size <= 10e6).map(f => mkImg(f, orderRef.current++));
    setImgs(p => [...p, ...valid]);
    if (!aid && valid.length) setAid(valid[0].id);
    valid.forEach(process);
  }, [aid]);

  const { getRootProps, getInputProps, isDragActive, open: pick } = useDropzone({
    onDrop, accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] }, noClick: true, noKeyboard: true,
  });

  async function applyBg(id: string, color: string | null) {
    const item = imgs.find(i => i.id === id); if (!item?.resultBlob) return;
    const prev = { url: item.resultUrl!, blob: item.resultBlob };
    const raw  = await removeBackground(item.file, { progress: () => {} });
    const comp = await compress(raw, color, item.flipH, item.flipV);
    const url  = URL.createObjectURL(comp);
    upd(id, { resultBlob: comp, resultUrl: url, bgColor: color, undoStack: [...item.undoStack, prev].slice(-10), redoStack: [] });
    await persist({ ...item, bgColor: color }, comp, { bgColor: color });
  }

  async function applyFlip(id: string, axis: "h" | "v") {
    const item = imgs.find(i => i.id === id); if (!item?.resultBlob) return;
    const prev = { url: item.resultUrl!, blob: item.resultBlob };
    const nH = axis === "h" ? !item.flipH : item.flipH, nV = axis === "v" ? !item.flipV : item.flipV;
    const raw  = await removeBackground(item.file, { progress: () => {} });
    const comp = await compress(raw, item.bgColor, nH, nV);
    const url  = URL.createObjectURL(comp);
    upd(id, { flipH: nH, flipV: nV, resultBlob: comp, resultUrl: url, undoStack: [...item.undoStack, prev].slice(-10), redoStack: [] });
    await persist({ ...item, flipH: nH, flipV: nV }, comp, { flipH: nH, flipV: nV });
  }

  function undo(id: string) {
    const item = imgs.find(i => i.id === id); if (!item?.undoStack.length) return;
    const p = item.undoStack.at(-1)!;
    upd(id, { resultUrl: p.url, resultBlob: p.blob, undoStack: item.undoStack.slice(0, -1),
      redoStack: [...item.redoStack, { url: item.resultUrl!, blob: item.resultBlob! }] });
  }
  function redo(id: string) {
    const item = imgs.find(i => i.id === id); if (!item?.redoStack.length) return;
    const n = item.redoStack.at(-1)!;
    upd(id, { resultUrl: n.url, resultBlob: n.blob, redoStack: item.redoStack.slice(0, -1),
      undoStack: [...item.undoStack, { url: item.resultUrl!, blob: item.resultBlob! }] });
  }

  function dlFree(target?: Img | null) {
    const item = target ?? active; if (!item?.resultBlob) return;
    const url = URL.createObjectURL(item.resultBlob);
    Object.assign(document.createElement("a"), { href: url, download: `${item.file.name.replace(/\.[^.]+$/, "")}-no-bg.png` }).click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function dlZip() {
    const done = imgs.filter(i => i.stage === "done" && i.resultBlob);
    if (!done.length) return;
    if (done.length === 1) { dlFree(done[0]); return; }
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    done.forEach(i => zip.file(`${i.file.name.replace(/\.[^.]+$/, "")}-no-bg.png`, i.resultBlob!));
    const blob = await zip.generateAsync({ type: "blob" });
    Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "bg-removed.zip" }).click();
  }
  async function dlHD() {
    if (!session || !active?.file) return;
    setHdLoad(true);
    try {
      const form = new FormData(); form.append("image", active.file);
      const res = await fetch("/api/remove-bg", { method: "POST", body: form });
      if (res.ok) {
        const rem = res.headers.get("X-Credits-Remaining"); if (rem) setCredits(+rem);
        const blob = await res.blob(); const url = URL.createObjectURL(blob);
        Object.assign(document.createElement("a"), { href: url, download: `${active.file.name.replace(/\.[^.]+$/, "")}-hd.png` }).click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch {} setHdLoad(false);
  }
  function openCanva() {
    if (!active?.resultBlob) return;
    dlFree(active);
    setTimeout(() => { window.open("https://www.canva.com/photo-editor/", "_blank"); setToast(true); setTimeout(() => setToast(false), 5000); }, 400);
  }
  function removeImg(id: string) {
    setImgs(p => { const n = p.filter(i => i.id !== id); if (aid === id) setAid(n[0]?.id ?? null); return n; });
    idbDelete(id);
  }

  const doneCount = imgs.filter(i => i.stage === "done").length;

  // ── shared tool header ─────────────────────────────────────────────────────
  const ToolHeader = () => (
    <div style={{ height: 54, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 20px", background: "#fff", borderBottom: "1px solid #e5e7eb", gap: 12 }}>
      {/* New image */}
      <button onClick={pick} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "transparent", color: "#6b7280", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
        <Plus size={13} /> New Image
      </button>

      <div style={{ flex: 1 }} />

      {/* Undo / Redo */}
      {[{ fn: () => active && undo(active.id), Icon: Undo2, off: !active?.undoStack.length, title: "Undo" },
        { fn: () => active && redo(active.id), Icon: Redo2, off: !active?.redoStack.length, title: "Redo" }].map(({ fn, Icon, off, title }) => (
        <button key={title} onClick={fn} disabled={off} title={title}
          style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "transparent", cursor: off ? "not-allowed" : "pointer", opacity: off ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
          <Icon size={15} />
        </button>
      ))}

      {active?.stage === "done" && (<>
        <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />
        {[{ fn: () => active && applyFlip(active.id, "h"), Icon: FlipHorizontal, on: active.flipH, title: "Flip H" },
          { fn: () => active && applyFlip(active.id, "v"), Icon: FlipVertical, on: active.flipV, title: "Flip V" }].map(({ fn, Icon, on, title }) => (
          <button key={title} onClick={fn} title={title}
            style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: on ? "#f5f3ff" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: on ? "#7c3aed" : "#6b7280" }}>
            <Icon size={15} />
          </button>
        ))}
      </>)}

      <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />

      {/* Session */}
      {session ? (
        <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#6d28d9", flexShrink: 0 }}>
          <Zap size={11} fill="currentColor" /> {credits} credits
        </div>
      ) : (
        <Link href="/auth/signin" style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", textDecoration: "none" }}>Sign in</Link>
      )}

      {/* Download dropdown */}
      <div style={{ position: "relative", flexShrink: 0 }} ref={dlRef}>
        <button onClick={() => setDlOpen(o => !o)}
          style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", fontWeight: 700, fontSize: 13, padding: "0 16px", height: 36, borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "0 2px 12px rgba(124,58,237,.4)" }}>
          <Download size={14} /> Download
          <ChevronDown size={12} style={{ transition: "transform .15s", transform: dlOpen ? "rotate(180deg)" : "none" }} />
        </button>

        {dlOpen && (
          <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 240, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, boxShadow: "0 16px 48px rgba(0,0,0,.13)", zIndex: 9999, overflow: "hidden" }}>
            <button onClick={() => { dlFree(); setDlOpen(false); }} disabled={active?.stage !== "done"}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 16px", border: "none", borderBottom: "1px solid #f3f4f6", background: "transparent", cursor: active?.stage === "done" ? "pointer" : "not-allowed", opacity: active?.stage === "done" ? 1 : 0.4 }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Download size={15} color="#6b7280" /></div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Free PNG</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>Optimised · No watermark</div>
              </div>
            </button>
            {!session ? (
              <Link href="/auth/signup" onClick={() => setDlOpen(false)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", textDecoration: "none" }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = "#faf5ff")}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = "transparent")}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Lock size={15} color="#7c3aed" /></div>
                <div><div style={{ fontSize: 13, fontWeight: 700, color: "#6d28d9" }}>Sign Up for HD</div><div style={{ fontSize: 11, color: "#a78bfa" }}>3 free HD/day · No card</div></div>
              </Link>
            ) : credits > 0 ? (
              <button onClick={() => { dlHD(); setDlOpen(false); }} disabled={hdLoad || active?.stage !== "done"}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 16px", border: "none", background: "transparent", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#faf5ff")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {hdLoad ? <Loader2 size={15} color="#7c3aed" className="animate-spin" /> : <Zap size={15} color="#7c3aed" />}
                </div>
                <div style={{ textAlign: "left" }}><div style={{ fontSize: 13, fontWeight: 700, color: "#6d28d9" }}>HD Download</div><div style={{ fontSize: 11, color: "#a78bfa" }}>Full resolution · 1 credit</div></div>
              </button>
            ) : (
              <Link href="/pricing" onClick={() => setDlOpen(false)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", textDecoration: "none" }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = "#faf5ff")}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = "transparent")}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Zap size={15} color="#7c3aed" /></div>
                <div><div style={{ fontSize: 13, fontWeight: 700, color: "#6d28d9" }}>Buy Credits</div><div style={{ fontSize: 11, color: "#a78bfa" }}>Unlock HD downloads</div></div>
              </Link>
            )}
            {doneCount > 1 && (
              <button onClick={() => { dlZip(); setDlOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 16px", border: "none", borderTop: "1px solid #f3f4f6", background: "transparent", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f0fdf4")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Download size={15} color="#16a34a" /></div>
                <div style={{ textAlign: "left" }}><div style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>Download All ZIP</div><div style={{ fontSize: 11, color: "#4ade80" }}>{doneCount} images ready</div></div>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (!ready) return (
    <div style={{ height: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f6f8" }}>
      <Loader2 size={26} className="animate-spin text-violet-500" />
    </div>
  );

  // ── UPLOAD STATE ───────────────────────────────────────────────────────────
  if (!imgs.length) return (
    <div style={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", background: "#f5f6f8" }}>
      <ToolHeader />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div {...getRootProps()} onClick={pick}
          style={{
            width: "100%", maxWidth: 520, textAlign: "center", cursor: "pointer",
            background: "#fff", borderRadius: 24, border: `2px dashed ${isDragActive ? "#7c3aed" : "#d1d5db"}`,
            padding: "56px 40px", boxShadow: "0 4px 32px rgba(0,0,0,0.06)", transition: "border-color .2s",
          }}>
          <input {...getInputProps()} />
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#f5f3ff", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Upload size={28} color="#7c3aed" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#111827", marginBottom: 8 }}>
            {isDragActive ? "Drop your image here!" : "Upload Image"}
          </h2>
          <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 28 }}>
            Drop file here or click to browse · JPG, PNG, WEBP · max 10 MB
          </p>
          <div className="btn-primary inline-flex items-center gap-2 text-white font-bold px-8 py-3 rounded-xl text-sm">
            <Upload size={15} /> Select Image
          </div>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 24, color: "#9ca3af", fontSize: 12 }}>
            {["Free forever", "No watermarks", "Saved across reloads"].map(t => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Check size={11} color="#22c55e" /> {t}
              </span>
            ))}
          </div>
        </div>
        {!session && (
          <p style={{ marginTop: 20, fontSize: 13, color: "#9ca3af" }}>
            <Link href="/auth/signup" style={{ color: "#7c3aed", fontWeight: 700 }}>Create free account</Link> → 3 HD downloads / day
          </p>
        )}
      </div>
    </div>
  );

  // ── EDITOR ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", overflow: "hidden", background: "#f0f1f5" }}>
      <ToolHeader />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      <div style={{ width: 220, flexShrink: 0, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", overflowY: "auto" }}>

        {/* Tabs */}
        <div style={{ padding: "12px 10px 8px" }}>
          {TABS.map(({ id, label, Icon }) => {
            const on = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "9px 12px", borderRadius: 10, marginBottom: 2, border: "none", cursor: "pointer",
                background: on ? "#f5f3ff" : "transparent",
                color: on ? "#6d28d9" : "#6b7280", fontWeight: on ? 700 : 500, fontSize: 13,
                transition: "background .15s, color .15s",
              }}>
                <Icon size={16} color={on ? "#7c3aed" : "#9ca3af"} style={{ flexShrink: 0 }} />
                {label}
              </button>
            );
          })}
        </div>

        <div style={{ height: 1, background: "#f3f4f6", margin: "0 10px" }} />

        {/* Panel */}
        <div style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>

          {/* CUTOUT */}
          {tab === "cutout" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {active?.stage === "done" ? (<>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Check size={12} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#15803d" }}>Background removed</div>
                    <div style={{ fontSize: 11, color: "#86efac", marginTop: 1 }}>Transparent PNG ready</div>
                  </div>
                </div>
                <button onClick={() => setBrush(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, border: "1.5px solid #ddd6fe", background: "#faf5ff", color: "#7c3aed", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  <Paintbrush size={14} /> Refine Edges
                </button>
                <button onClick={() => active && process({ ...active })} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "transparent", color: "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  <RotateCcw size={14} /> Re-process
                </button>
              </>) : active?.stage === "processing" ? (
                <div style={{ padding: "8px 0", color: "#9ca3af", fontSize: 12, textAlign: "center" }}>
                  Processing image…
                </div>
              ) : active?.stage === "error" ? (<>
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#dc2626", fontWeight: 600 }}>
                  {active.error}
                </div>
                <button onClick={() => active && process(active)} style={{ padding: "9px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "transparent", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  Retry
                </button>
              </>) : (
                <p style={{ color: "#c4c9d4", fontSize: 12, textAlign: "center", padding: "16px 0" }}>Upload an image to begin</p>
              )}
            </div>
          )}

          {/* BACKGROUND */}
          {tab === "background" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {active?.stage === "done" ? (<>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Color</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 7 }}>
                    {BG_COLORS.map(({ v, s }) => (
                      <button key={String(v)} onClick={() => active && applyBg(active.id, v)}
                        style={{
                          aspectRatio: "1", borderRadius: 8, background: s, cursor: "pointer",
                          border: active.bgColor === v ? "2.5px solid #7c3aed" : "1.5px solid #e5e7eb",
                          boxShadow: active.bgColor === v ? "0 0 0 3px #ddd6fe" : undefined,
                          transition: "transform .15s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Custom</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 12px" }}>
                    <input type="color" defaultValue="#ffffff" onChange={e => active && applyBg(active.id, e.target.value)}
                      style={{ width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer", padding: 0 }} />
                    <span style={{ fontSize: 12, color: "#6b7280" }}>Pick any color</span>
                  </div>
                </div>
                <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, border: "1.5px dashed #e5e7eb", background: "transparent", color: "#c4c9d4", fontWeight: 600, fontSize: 12, cursor: "not-allowed" }}>
                  <Lock size={11} /> Photo background — Pro
                </button>
              </>) : (
                <p style={{ color: "#c4c9d4", fontSize: 12, textAlign: "center", padding: "16px 0" }}>Process an image first</p>
              )}
            </div>
          )}

          {/* EFFECTS */}
          {tab === "effects" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {active?.stage === "done" ? (<>
                {[{ label: "Brightness", key: "brightness" as const, min: 50, max: 200 },
                  { label: "Contrast",   key: "contrast"   as const, min: 50, max: 200 }].map(({ label, key, min, max }) => (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{label}</span>
                      <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, background: "#f3f4f6", padding: "1px 6px", borderRadius: 6 }}>{active[key]}%</span>
                    </div>
                    <input type="range" min={min} max={max} value={active[key]}
                      onChange={e => upd(active.id, { [key]: +e.target.value } as Partial<Img>)}
                      style={{ width: "100%", cursor: "pointer", accentColor: "#7c3aed" }} />
                  </div>
                ))}
                <div style={{ height: 1, background: "#f3f4f6" }} />
                {["Shadow", "Blur background", "Vintage"].map(f => (
                  <button key={f} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, border: "1.5px dashed #e5e7eb", background: "transparent", color: "#c4c9d4", fontWeight: 600, fontSize: 12, cursor: "not-allowed" }}>
                    <Lock size={11} /> {f} — Pro
                  </button>
                ))}
              </>) : (
                <p style={{ color: "#c4c9d4", fontSize: 12, textAlign: "center", padding: "16px 0" }}>Process an image first</p>
              )}
            </div>
          )}

          {/* ADJUST */}
          {tab === "adjust" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {active?.stage === "done" ? (<>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Flip</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[{ axis: "h" as const, label: "Horizontal", Icon: FlipHorizontal, on: active.flipH },
                      { axis: "v" as const, label: "Vertical",   Icon: FlipVertical,   on: active.flipV }].map(({ axis, label, Icon, on }) => (
                      <button key={axis} onClick={() => active && applyFlip(active.id, axis)}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 0", borderRadius: 10, cursor: "pointer",
                          border: `1.5px solid ${on ? "#7c3aed" : "#e5e7eb"}`,
                          background: on ? "#f5f3ff" : "transparent", color: on ? "#6d28d9" : "#6b7280", fontWeight: 600, fontSize: 11, transition: "all .15s" }}>
                        <Icon size={16} color={on ? "#7c3aed" : "#9ca3af"} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
                {["Rotate", "Crop", "Perspective"].map(f => (
                  <button key={f} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, border: "1.5px dashed #e5e7eb", background: "transparent", color: "#c4c9d4", fontWeight: 600, fontSize: 12, cursor: "not-allowed" }}>
                    <Lock size={11} /> {f} — Pro
                  </button>
                ))}
              </>) : (
                <p style={{ color: "#c4c9d4", fontSize: 12, textAlign: "center", padding: "16px 0" }}>Process an image first</p>
              )}
            </div>
          )}

          {/* DESIGN */}
          {tab === "design" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Pro features</p>
              {["Add Text", "Add Logo", "Templates", "Social Presets", "Stickers"].map(f => (
                <button key={f} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, border: "1.5px dashed #e5e7eb", background: "transparent", color: "#c4c9d4", fontWeight: 600, fontSize: 12, cursor: "not-allowed" }}>
                  <Lock size={11} /> {f}
                </button>
              ))}
              <Link href="/pricing" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 13, marginTop: 4 }}>
                <Zap size={13} fill="currentColor" /> Unlock Pro
              </Link>
            </div>
          )}
        </div>

        {/* Edit in Canva */}
        {active?.stage === "done" && (
          <div style={{ padding: "10px 12px", borderTop: "1px solid #f3f4f6", flexShrink: 0 }}>
            <button onClick={openCanva} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", padding: "9px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "transparent", color: "#6b7280", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
              <ExternalLink size={13} /> Edit in Canva
            </button>
          </div>
        )}
      </div>

      {/* ── CANVAS AREA ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Canvas */}
        <div {...getRootProps()} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: "#f0f1f5" }}>
          <input {...getInputProps()} />

          {isDragActive && (
            <div style={{ position: "absolute", inset: 16, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(245,243,255,.95)", border: "2px dashed #7c3aed", borderRadius: 20 }}>
              <div style={{ textAlign: "center" }}>
                <Upload size={36} color="#7c3aed" style={{ margin: "0 auto 8px" }} />
                <p style={{ color: "#6d28d9", fontWeight: 800, fontSize: 16 }}>Drop to add images</p>
              </div>
            </div>
          )}

          {toast && (
            <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 50, display: "flex", alignItems: "center", gap: 10, background: "#111827", color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 18px", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,.3)" }}>
              <Check size={14} color="#4ade80" /> Image saved! Upload it in Canva
              <button onClick={() => setToast(false)} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", marginLeft: 4 }}><X size={13} /></button>
            </div>
          )}

          {active ? (
            brush && active.resultBlob ? (
              <BrushEditor resultBlob={active.resultBlob} originalSrc={active.origUrl}
                onDone={async edited => {
                  const url = URL.createObjectURL(edited);
                  const prev = { url: active.resultUrl!, blob: active.resultBlob! };
                  upd(active.id, { resultBlob: edited, resultUrl: url, undoStack: [...active.undoStack, prev].slice(-10), redoStack: [] });
                  await persist({ ...active }, edited); setBrush(false);
                }}
                onCancel={() => setBrush(false)} />
            ) : active.stage === "done" && active.resultUrl ? (
              <div style={{ padding: 32, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                <div style={{
                  position: "relative", borderRadius: 16, overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,.12), 0 4px 16px rgba(0,0,0,.06)",
                  background: active.bgColor ?? undefined,
                  maxWidth: "min(820px, 100%)",
                }}>
                  {!active.bgColor && <div className="checker" style={{ position: "absolute", inset: 0 }} />}
                  <img src={active.resultUrl} alt="Result"
                    style={{ display: "block", position: "relative", maxWidth: "100%", maxHeight: "calc(100vh - 54px - 72px)", width: "auto", height: "auto",
                      filter: `brightness(${active.brightness}%) contrast(${active.contrast}%)` }} />
                </div>
              </div>
            ) : active.stage === "processing" ? (
              <div style={{ padding: 32, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", position: "relative" }}>
                <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.12), 0 4px 16px rgba(0,0,0,.06)", maxWidth: "min(820px, 100%)" }}>
                  <img src={active.origUrl} alt="Processing"
                    style={{ display: "block", maxWidth: "100%", maxHeight: "calc(100vh - 54px - 72px)", width: "auto", height: "auto" }} />
                  {/* processing overlay */}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.75)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <Loader2 size={32} color="#7c3aed" className="animate-spin" />
                    <div style={{ width: 160, height: 5, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${active.progress}%`, background: "linear-gradient(90deg,#7c3aed,#3b82f6)", borderRadius: 99, transition: "width .3s" }} />
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#6d28d9" }}>{active.progress}%</p>
                  </div>
                </div>
              </div>
            ) : active.stage === "error" ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: "#fef2f2", border: "1px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <AlertCircle size={26} color="#ef4444" />
                </div>
                <p style={{ color: "#dc2626", fontWeight: 700, marginBottom: 14 }}>{active.error}</p>
                <button onClick={() => process(active)} style={{ padding: "8px 20px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "transparent", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Retry</button>
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#c4c9d4" }}>
                <Loader2 size={26} color="#c4c9d4" className="animate-spin" style={{ margin: "0 auto 8px" }} />
                <p style={{ fontSize: 13 }}>Queued…</p>
              </div>
            )
          ) : (
            <div style={{ textAlign: "center", color: "#c4c9d4" }}>
              <ImageIcon size={40} style={{ margin: "0 auto 8px", opacity: 0.3 }} />
              <p style={{ fontSize: 13 }}>Select an image from the strip below</p>
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        <div style={{ height: 72, flexShrink: 0, background: "#fff", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", padding: "0 16px", gap: 10, overflowX: "auto" }}>
          {imgs.map(item => (
            <div key={item.id} onClick={() => setAid(item.id)}
              className="group"
              style={{
                position: "relative", width: 48, height: 48, borderRadius: 12, overflow: "visible", flexShrink: 0, cursor: "pointer",
                border: aid === item.id ? "2.5px solid #7c3aed" : "1.5px solid #e5e7eb",
                boxShadow: aid === item.id ? "0 0 0 3px #ddd6fe" : undefined,
                transition: "all .15s",
              }}>
              <div style={{ width: "100%", height: "100%", borderRadius: 10, overflow: "hidden" }}>
                {item.stage === "done" && item.resultUrl ? (
                  <div className="checker" style={{ width: "100%", height: "100%", position: "relative" }}>
                    <img src={item.resultUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", position: "relative" }} />
                  </div>
                ) : item.stage === "processing" ? (
                  <div style={{ width: "100%", height: "100%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader2 size={14} color="#7c3aed" className="animate-spin" />
                  </div>
                ) : (
                  <img src={item.origUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>
              <button
                onClick={e => { e.stopPropagation(); removeImg(item.id); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ position: "absolute", top: -5, right: -5, width: 17, height: 17, borderRadius: "50%", background: "#1f2937", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}>
                <X size={7} color="#fff" />
              </button>
            </div>
          ))}

          <button onClick={pick}
            style={{ width: 48, height: 48, borderRadius: 12, border: "1.5px dashed #d1d5db", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#7c3aed"; (e.currentTarget as HTMLElement).style.background = "#faf5ff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#d1d5db"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <Plus size={18} color="#9ca3af" />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
