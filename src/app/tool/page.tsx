"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import {
  Download, Loader2, AlertCircle, Zap, Lock, Plus,
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
    try {
      const r = indexedDB.open(IDB_NAME, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(IDB_STORE, { keyPath: "id" });
      r.onsuccess = () => ok(r.result);
      r.onerror = () => err(r.error);
      r.onblocked = () => err(new Error("idb-blocked"));
    } catch (e) { err(e); }
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
  bgColor: string | null; bgPhotoUrl: string | null;
  flipH: boolean; flipV: boolean;
  brightness: number; contrast: number;
  shadow: boolean; blurBg: number;
  undoStack: { url: string; blob: Blob }[];
  redoStack: { url: string; blob: Blob }[];
}
function mkImg(file: File, order: number): Img {
  return { id: crypto.randomUUID(), order, file, origUrl: URL.createObjectURL(file),
    resultUrl: null, resultBlob: null, stage: "queued", progress: 0,
    bgColor: null, bgPhotoUrl: null, flipH: false, flipV: false,
    brightness: 100, contrast: 100, shadow: false, blurBg: 0,
    undoStack: [], redoStack: [] };
}

const BG_COLORS = [
  { v: null,      s: `repeating-conic-gradient(#d4d4d4 0% 25%,#fff 0% 50%) 0 0/14px 14px` },
  { v: "#ffffff", s: "#ffffff" }, { v: "#000000", s: "#000000" },
  { v: "#ef4444", s: "#ef4444" }, { v: "#f97316", s: "#f97316" }, { v: "#eab308", s: "#eab308" },
  { v: "#22c55e", s: "#22c55e" }, { v: "#06b6d4", s: "#06b6d4" }, { v: "#3b82f6", s: "#3b82f6" },
  { v: "#8b5cf6", s: "#8b5cf6" }, { v: "#ec4899", s: "#ec4899" }, { v: "#f43f5e", s: "#f43f5e" },
  { v: "#fb923c", s: "#fb923c" }, { v: "#fbbf24", s: "#fbbf24" }, { v: "#a3e635", s: "#a3e635" },
  { v: "#34d399", s: "#34d399" }, { v: "#22d3ee", s: "#22d3ee" }, { v: "#60a5fa", s: "#60a5fa" },
  { v: "#a78bfa", s: "#a78bfa" }, { v: "#f472b6", s: "#f472b6" }, { v: "#fda4af", s: "#fda4af" },
  { v: "#fed7aa", s: "#fed7aa" }, { v: "#fef08a", s: "#fef08a" }, { v: "#bbf7d0", s: "#bbf7d0" },
  { v: "#a5f3fc", s: "#a5f3fc" }, { v: "#bfdbfe", s: "#bfdbfe" }, { v: "#ddd6fe", s: "#ddd6fe" },
  { v: "#fbcfe8", s: "#fbcfe8" }, { v: "#374151", s: "#374151" }, { v: "#6b7280", s: "#6b7280" },
  { v: "#d1d5db", s: "#d1d5db" }, { v: "#1e3a5f", s: "#1e3a5f" }, { v: "#14532d", s: "#14532d" },
  { v: "#7f1d1d", s: "#7f1d1d" }, { v: "#4c1d95", s: "#4c1d95" }, { v: "#0c4a6e", s: "#0c4a6e" },
];

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "cutout",     label: "Cutout",     Icon: Scissors },
  { id: "background", label: "Background", Icon: ImageIcon },
  { id: "effects",    label: "Effects",    Icon: Sparkles },
  { id: "adjust",     label: "Adjust",     Icon: Sliders },
  { id: "design",     label: "Design",     Icon: LayoutTemplate },
];

const PEXELS_BG = [
  "https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg",
  "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg",
  "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg",
  "https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg",
  "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg",
  "https://images.pexels.com/photos/949587/pexels-photo-949587.jpeg",
  "https://images.pexels.com/photos/1694000/pexels-photo-1694000.jpeg",
  "https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg",
  "https://images.pexels.com/photos/1562961/pexels-photo-1562961.jpeg",
  "https://images.pexels.com/photos/2526105/pexels-photo-2526105.jpeg",
  "https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg",
  "https://images.pexels.com/photos/1448735/pexels-photo-1448735.jpeg",
];

const SAMPLE_IMGS = [
  { url: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200", label: "person.jpg" },
  { url: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=200", label: "car.jpg" },
  { url: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=200", label: "cat.jpg" },
  { url: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=200", label: "flower.jpg" },
];

// ── Main component ─────────────────────────────────────────────────────────
export default function ToolPage() {
  const { data: session } = useSession();
  const [imgs, setImgs]       = useState<Img[]>([]);
  const [aid, setAid]         = useState<string | null>(null);
  const [tab, setTab]         = useState<Tab | null>(null);
  const [credits, setCredits] = useState(session?.user?.credits ?? 0);
  const [hdLoad, setHdLoad]   = useState(false);
  const [dlOpen, setDlOpen]   = useState(false);
  const [brush, setBrush]     = useState(false);
  const [bgSubTab, setBgSubTab] = useState<"magic"|"photo"|"color">("color");
  const [toast, setToast]     = useState(false);
  const [ready, setReady]     = useState(false);
  const [errMsg, setErrMsg]   = useState<string | null>(null);
  const processing = useRef<Set<string>>(new Set());
  const dlRef      = useRef<HTMLDivElement>(null);
  const orderRef   = useRef(Date.now());
  const active     = imgs.find(i => i.id === aid) ?? null;

  // restore from IDB
  useEffect(() => {
    const fallback = setTimeout(() => setReady(true), 4000);
    (async () => {
      try {
        const entries = await idbLoadAll();
        clearTimeout(fallback);
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
            bgColor: e.bgColor, bgPhotoUrl: null, flipH: e.flipH, flipV: e.flipV,
            brightness: e.brightness, contrast: e.contrast, shadow: false, blurBg: 0,
            undoStack: [], redoStack: [] } as Img;
        });
        setImgs(items); setAid(items[0]?.id ?? null);
        orderRef.current = Math.max(...items.map(i => i.order)) + 1;
        items.filter(i => i.stage === "queued").forEach(process);
      } catch {}
      clearTimeout(fallback);
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

  const onDrop = useCallback((accepted: File[], rejected: { file: File }[]) => {
    const tooLarge = accepted.filter(f => f.size > 25e6);
    const valid = accepted.filter(f => f.size <= 25e6).map(f => mkImg(f, orderRef.current++));
    const bad = tooLarge.length + rejected.length;
    if (bad > 0) {
      setErrMsg(`${bad} file${bad > 1 ? "s" : ""} skipped — max 25 MB, images only`);
      setTimeout(() => setErrMsg(null), 4000);
    }
    if (!valid.length) return;
    setImgs(p => [...p, ...valid]);
    if (!aid && valid.length) setAid(valid[0].id);
    valid.forEach(process);
  }, [aid]);

  const { getRootProps, getInputProps, isDragActive, open: pick } = useDropzone({
    onDrop, accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxSize: 25 * 1024 * 1024, noClick: true, noKeyboard: true,
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
  function applyBgPhoto(id: string, photoUrl: string | null) {
    upd(id, { bgPhotoUrl: photoUrl, bgColor: null });
  }

  async function loadSample(url: string, name: string) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("fetch");
      const blob = await res.blob();
      const file = new File([blob], name, { type: blob.type || "image/jpeg" });
      const item = mkImg(file, orderRef.current++);
      setImgs([item]); setAid(item.id);
      process(item);
    } catch {
      setErrMsg("Could not load sample image. Check your connection.");
      setTimeout(() => setErrMsg(null), 4000);
    }
  }

  const doneCount = imgs.filter(i => i.stage === "done").length;
  const panelOpen = tab !== null && active?.stage === "done";

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (!ready) return (
    <div style={{ height: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
      <Loader2 size={26} className="animate-spin text-violet-500" />
    </div>
  );

  // ── UPLOAD STATE ───────────────────────────────────────────────────────────
  if (!imgs.length) return (
    <div {...getRootProps()} style={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#fff", cursor: "default", position: "relative" }}>
      <input {...getInputProps()} />
      {errMsg && (
        <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 50, display: "flex", alignItems: "center", gap: 10, background: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 18px", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,.3)", whiteSpace: "nowrap" }}>
          <AlertCircle size={14} /> {errMsg}
          <button onClick={() => setErrMsg(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", cursor: "pointer" }}><X size={13} /></button>
        </div>
      )}

      {isDragActive && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(245,243,255,.95)", border: "3px dashed #7c3aed" }}>
          <p style={{ color: "#6d28d9", fontWeight: 800, fontSize: 20 }}>Drop your image here</p>
        </div>
      )}

      <div style={{ textAlign: "center", maxWidth: 560 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, color: "#111827", lineHeight: 1.2, marginBottom: 28 }}>
          Upload an image to<br />remove the background
        </h1>
        <button onClick={pick}
          style={{ background: "#2563eb", color: "#fff", padding: "14px 40px", borderRadius: 99, fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(37,99,235,.3)", transition: "transform .15s" }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
          Upload Image
        </button>
        <p style={{ color: "#9ca3af", marginTop: 18, fontSize: 14, lineHeight: 2 }}>
          or drop a file,<br />paste image or URL
        </p>
      </div>

      <div style={{ marginTop: 52, textAlign: "center" }}>
        <p style={{ color: "#6b7280", fontSize: 13, fontWeight: 500, marginBottom: 14 }}>No image? Try one of these:</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {SAMPLE_IMGS.map(({ url, label }) => (
            <img key={url} src={url} alt={label}
              onClick={e => { e.stopPropagation(); loadSample(url, label); }}
              style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", cursor: "pointer", border: "2px solid #e5e7eb", transition: "transform .15s, border-color .15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.borderColor = "#7c3aed"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "#e5e7eb"; }} />
          ))}
        </div>
      </div>

      <p style={{ marginTop: 36, fontSize: 12, color: "#9ca3af" }}>
        By uploading an image you agree to our{" "}
        <Link href="/faq" style={{ color: "#9ca3af", textDecoration: "underline" }}>Terms of Service</Link>.
      </p>
    </div>
  );

  // ── EDITOR ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", overflow: "hidden", background: "#f3f4f6" }}>

      {/* ── FLOATING PILL TOOLBAR (centered, remove.bg style) ───────────── */}
      <div style={{ flexShrink: 0, display: "flex", justifyContent: "center", padding: "10px 16px 8px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 1, padding: "4px 5px", borderRadius: 999, background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,.07)", overflow: "hidden" }}>

          {/* New Image */}
          <button onClick={pick}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 999, border: "none", background: "transparent", color: "#374151", fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", transition: "background .15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <Plus size={13} /> New Image
          </button>

          <div style={{ width: 1, height: 22, background: "#e5e7eb", flexShrink: 0, margin: "0 3px" }} />

          {/* Tab buttons — rounded-full, dark when active */}
          {TABS.map(({ id, label, Icon }) => {
            const on = tab === id;
            return (
              <button key={id} onClick={() => setTab(on ? null : id)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, border: "none", cursor: "pointer", background: on ? "#111827" : "transparent", color: on ? "#fff" : "#6b7280", fontWeight: on ? 600 : 500, fontSize: 13, transition: "all .15s", whiteSpace: "nowrap" }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = "#f3f4f6"; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = "transparent"; }}>
                <Icon size={14} color={on ? "#fff" : "#9ca3af"} /> {label}
              </button>
            );
          })}

          <div style={{ width: 1, height: 22, background: "#e5e7eb", flexShrink: 0, margin: "0 3px" }} />

          {/* Undo / Redo */}
          {[{ fn: () => active && undo(active.id), Icon: Undo2, off: !active?.undoStack.length, title: "Undo" },
            { fn: () => active && redo(active.id), Icon: Redo2, off: !active?.redoStack.length, title: "Redo" }].map(({ fn, Icon, off, title }) => (
            <button key={title} onClick={fn} disabled={off} title={title}
              style={{ width: 34, height: 34, borderRadius: 999, border: "none", background: "transparent", cursor: off ? "not-allowed" : "pointer", opacity: off ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", transition: "background .15s" }}
              onMouseEnter={e => { if (!off) (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <Icon size={15} />
            </button>
          ))}

          <div style={{ width: 1, height: 22, background: "#e5e7eb", flexShrink: 0, margin: "0 3px" }} />

          {/* Credits badge */}
          {session && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#f5f3ff", borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#6d28d9", flexShrink: 0, marginRight: 2 }}>
              <Zap size={11} fill="currentColor" /> {credits}
            </div>
          )}

          {/* Download dropdown */}
          <div style={{ position: "relative", flexShrink: 0 }} ref={dlRef}>
            <button onClick={() => setDlOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#111827", color: "#fff", fontWeight: 600, fontSize: 13, padding: "7px 16px", borderRadius: 999, border: "none", cursor: "pointer" }}>
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
      </div>

      {/* ── CANVAS + SIDE PANEL (flex row, remove.bg style) ─────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* Canvas (dropzone) */}
        <div {...getRootProps()} style={{ flex: 1, position: "relative", overflow: "hidden", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <input {...getInputProps()} />

          {isDragActive && (
            <div style={{ position: "absolute", inset: 16, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(245,243,255,.95)", border: "2px dashed #7c3aed", borderRadius: 20 }}>
              <p style={{ color: "#6d28d9", fontWeight: 800, fontSize: 16 }}>Drop to add images</p>
            </div>
          )}

          {toast && (
            <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 50, display: "flex", alignItems: "center", gap: 10, background: "#111827", color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 18px", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,.3)" }}>
              <Check size={14} color="#4ade80" /> Image saved! Upload it in Canva
              <button onClick={() => setToast(false)} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}><X size={13} /></button>
            </div>
          )}
          {errMsg && (
            <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 50, display: "flex", alignItems: "center", gap: 10, background: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 18px", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,.3)", whiteSpace: "nowrap" }}>
              <AlertCircle size={14} /> {errMsg}
              <button onClick={() => setErrMsg(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", cursor: "pointer" }}><X size={13} /></button>
            </div>
          )}

          {/* Image display */}
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
              <div style={{ padding: 32, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", boxSizing: "border-box" }}>
                <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: active.shadow ? "0 20px 60px rgba(0,0,0,.4), 0 8px 40px rgba(0,0,0,.15)" : "0 4px 24px rgba(0,0,0,.1)", border: "1px solid rgba(0,0,0,.06)" }}>
                  {active.bgPhotoUrl ? (
                    <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${active.bgPhotoUrl})`, backgroundSize: "cover", backgroundPosition: "center", filter: active.blurBg > 0 ? `blur(${active.blurBg * 2}px)` : undefined, transform: active.blurBg > 0 ? "scale(1.08)" : undefined }} />
                  ) : active.bgColor ? (
                    <div style={{ position: "absolute", inset: 0, background: active.bgColor }} />
                  ) : (
                    <div className="checker" style={{ position: "absolute", inset: 0 }} />
                  )}
                  <img src={active.resultUrl} alt="Result"
                    style={{ display: "block", position: "relative",
                      maxWidth: "min(520px, calc(100% - 64px))",
                      maxHeight: "calc(100vh - 260px)",
                      width: "auto", height: "auto",
                      filter: `brightness(${active.brightness}%) contrast(${active.contrast}%)`,
                      transform: `scaleX(${active.flipH ? -1 : 1}) scaleY(${active.flipV ? -1 : 1})` }} />
                </div>
              </div>
            ) : active.stage === "processing" ? (
              <div style={{ padding: 32, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", boxSizing: "border-box" }}>
                <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,.1)", border: "1px solid rgba(0,0,0,.06)" }}>
                  <img src={active.origUrl} alt="Processing" style={{ display: "block", maxWidth: "min(520px, calc(100vw - 64px))", maxHeight: "calc(100vh - 260px)", width: "auto", height: "auto" }} />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <Loader2 size={32} color="#111827" className="animate-spin" />
                    <div style={{ width: 160, height: 4, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${active.progress}%`, background: "#111827", borderRadius: 99, transition: "width .3s" }} />
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{active.progress}%</p>
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
              <p style={{ fontSize: 13 }}>Select an image from the strip below</p>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDE PANEL (flex item, not absolute) ───────────────── */}
        {panelOpen && (
          <div style={{ width: 288, flexShrink: 0, background: "#fff", borderLeft: "1px solid #e5e7eb", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Panel header */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{TABS.find(t => t.id === tab)?.label}</span>
              <button onClick={() => setTab(null)} style={{ width: 26, height: 26, borderRadius: 8, border: "none", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={13} color="#6b7280" />
              </button>
            </div>

            {/* Panel content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>

              {/* CUTOUT */}
              {tab === "cutout" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 12px", display: "flex", gap: 8, alignItems: "center" }}>
                    <Check size={14} color="#16a34a" />
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#15803d" }}>Background removed</div>
                  </div>
                  <button onClick={() => setBrush(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, border: "1.5px solid #ddd6fe", background: "#faf5ff", color: "#7c3aed", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    <Paintbrush size={14} /> Erase / Restore
                  </button>
                  <button onClick={() => active && process({ ...active })} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "transparent", color: "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    <RotateCcw size={14} /> Re-process
                  </button>
                  <button onClick={openCanva} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "transparent", color: "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    <ExternalLink size={13} /> Edit in Canva
                  </button>
                </div>
              )}

              {/* BACKGROUND */}
              {tab === "background" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Subtabs */}
                  <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 10, padding: 3, gap: 2 }}>
                    {(["magic","photo","color"] as const).map(t => (
                      <button key={t} onClick={() => setBgSubTab(t)}
                        style={{ flex: 1, padding: "5px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: bgSubTab === t ? 700 : 500, background: bgSubTab === t ? "#fff" : "transparent", color: bgSubTab === t ? "#111827" : "#6b7280", boxShadow: bgSubTab === t ? "0 1px 4px rgba(0,0,0,.08)" : "none", transition: "all .15s", textTransform: "capitalize" }}>
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Magic tab - Pro */}
                  {bgSubTab === "magic" && (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>✨</div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>AI Generate Background</p>
                      <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 14 }}>Describe any background and AI will create it</p>
                      <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff", fontWeight: 700, fontSize: 12, textDecoration: "none" }}>
                        <Zap size={12} fill="currentColor" /> Unlock Pro
                      </Link>
                    </div>
                  )}

                  {/* Photo tab - free Pexels grid */}
                  {bgSubTab === "photo" && (
                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                        {/* Transparent / no bg */}
                        <button onClick={() => active && applyBgPhoto(active.id, null)}
                          style={{ aspectRatio: "1", borderRadius: 8, overflow: "hidden", cursor: "pointer", border: active?.bgPhotoUrl === null && !active?.bgColor ? "2.5px solid #2563eb" : "1.5px solid #e5e7eb", padding: 0, background: "none" }}>
                          <div className="checker" style={{ width: "100%", height: "100%", borderRadius: 6 }} />
                        </button>
                        {PEXELS_BG.map(url => (
                          <button key={url} onClick={() => active && applyBgPhoto(active.id, url)}
                            style={{ aspectRatio: "1", borderRadius: 8, overflow: "hidden", cursor: "pointer", border: active?.bgPhotoUrl === url ? "2.5px solid #2563eb" : "1.5px solid #e5e7eb", padding: 0, background: "none", boxShadow: active?.bgPhotoUrl === url ? "0 0 0 3px #bfdbfe" : undefined }}>
                            <img src={`${url}?auto=compress&cs=tinysrgb&w=120`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color tab */}
                  {bgSubTab === "color" && (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
                        {BG_COLORS.map(({ v, s }) => (
                          <button key={String(v)} onClick={() => active && applyBg(active.id, v)}
                            style={{ aspectRatio: "1", borderRadius: 7, background: s, cursor: "pointer", border: active?.bgColor === v ? "2.5px solid #2563eb" : "1.5px solid rgba(0,0,0,.08)", boxShadow: active?.bgColor === v ? "0 0 0 3px #bfdbfe" : undefined, transition: "transform .15s" }}
                            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12)")}
                            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 12px" }}>
                        <input type="color" defaultValue="#ffffff" onChange={e => active && applyBg(active.id, e.target.value)}
                          style={{ width: 30, height: 30, borderRadius: 7, border: "none", cursor: "pointer", padding: 0 }} />
                        <span style={{ fontSize: 12, color: "#6b7280" }}>Custom color</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* EFFECTS */}
              {tab === "effects" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Shadow toggle */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Add Shadow</span>
                    <button onClick={() => active && upd(active.id, { shadow: !active.shadow })}
                      style={{ width: 40, height: 22, borderRadius: 99, border: "none", cursor: "pointer", background: active?.shadow ? "#2563eb" : "#d1d5db", position: "relative", transition: "background .2s", flexShrink: 0 }}>
                      <span style={{ position: "absolute", top: 2, left: active?.shadow ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                    </button>
                  </div>

                  {/* Blur background */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Blur Background</span>
                      <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, background: "#f3f4f6", padding: "1px 6px", borderRadius: 6 }}>{active?.blurBg ?? 0}</span>
                    </div>
                    <input type="range" min={0} max={10} value={active?.blurBg ?? 0}
                      onChange={e => active && upd(active.id, { blurBg: +e.target.value })}
                      style={{ width: "100%", cursor: "pointer", accentColor: "#2563eb" }} />
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Set a photo background first to use blur</p>
                  </div>

                  <div style={{ height: 1, background: "#f3f4f6" }} />

                  {/* Brightness */}
                  {[{ label: "Brightness", key: "brightness" as const, min: 50, max: 200 },
                    { label: "Contrast",   key: "contrast"   as const, min: 50, max: 200 }].map(({ label, key, min, max }) => (
                    <div key={key}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</span>
                        <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, background: "#f3f4f6", padding: "1px 6px", borderRadius: 6 }}>{active?.[key]}%</span>
                      </div>
                      <input type="range" min={min} max={max} value={active?.[key]}
                        onChange={e => active && upd(active.id, { [key]: +e.target.value } as Partial<Img>)}
                        style={{ width: "100%", cursor: "pointer", accentColor: "#2563eb" }} />
                    </div>
                  ))}
                </div>
              )}

              {/* ADJUST */}
              {tab === "adjust" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Flip</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[{ axis: "h" as const, label: "Horizontal", Icon: FlipHorizontal, on: active?.flipH },
                        { axis: "v" as const, label: "Vertical",   Icon: FlipVertical,   on: active?.flipV }].map(({ axis, label, Icon, on }) => (
                        <button key={axis} onClick={() => active && applyFlip(active.id, axis)}
                          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 0", borderRadius: 10, cursor: "pointer", border: `1.5px solid ${on ? "#2563eb" : "#e5e7eb"}`, background: on ? "#eff6ff" : "transparent", color: on ? "#1d4ed8" : "#6b7280", fontWeight: 600, fontSize: 11, transition: "all .15s" }}>
                          <Icon size={16} color={on ? "#2563eb" : "#9ca3af"} /> {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {["Rotate", "Crop", "Perspective"].map(f => (
                    <button key={f} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, border: "1.5px dashed #e5e7eb", background: "transparent", color: "#c4c9d4", fontWeight: 600, fontSize: 12, cursor: "not-allowed" }}>
                      <Lock size={11} /> {f} — Pro
                    </button>
                  ))}
                </div>
              )}

              {/* DESIGN */}
              {tab === "design" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Add Text", "Add Logo", "Templates", "Social Presets", "Stickers"].map(f => (
                    <button key={f} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, border: "1.5px dashed #e5e7eb", background: "transparent", color: "#c4c9d4", fontWeight: 600, fontSize: 12, cursor: "not-allowed" }}>
                      <Lock size={11} /> {f}
                    </button>
                  ))}
                  <Link href="/pricing" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 13, marginTop: 4, textDecoration: "none" }}>
                    <Zap size={13} fill="currentColor" /> Unlock Pro
                  </Link>
                </div>
              )}

            </div>
          </div>
        )}
      </div>{/* end canvas+panel row */}

      {/* ── THUMBNAIL STRIP (remove.bg style — centered row) ────────────── */}
      <div style={{ flexShrink: 0, padding: "10px 16px 12px", display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", maxWidth: "calc(100vw - 32px)" }}>
          {/* + upload button */}
          <button onClick={pick}
            style={{ width: 52, height: 52, borderRadius: 14, border: "2px dashed #d1d5db", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#374151"; (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#d1d5db"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <Plus size={20} color="#9ca3af" />
          </button>

          {imgs.map(item => (
            <div key={item.id} onClick={() => setAid(item.id)}
              className="group"
              style={{ position: "relative", width: 52, height: 52, borderRadius: 14, overflow: "visible", flexShrink: 0, cursor: "pointer", outline: aid === item.id ? "2.5px solid #111827" : "2px solid transparent", outlineOffset: 2, transition: "outline .15s" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden", background: "#e5e7eb" }}>
                {item.stage === "done" && item.resultUrl ? (
                  <div className="checker" style={{ width: "100%", height: "100%", position: "relative" }}>
                    <img src={item.resultUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", position: "relative" }} />
                  </div>
                ) : item.stage === "processing" ? (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader2 size={16} color="#374151" className="animate-spin" />
                  </div>
                ) : (
                  <img src={item.origUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>
              <button
                onClick={e => { e.stopPropagation(); removeImg(item.id); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#111827", border: "2px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}>
                <X size={8} color="#fff" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
