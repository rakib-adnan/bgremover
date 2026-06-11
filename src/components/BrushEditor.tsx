"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { Eraser, Paintbrush, Minus, Plus, RotateCcw, Check } from "lucide-react";

type Mode = "erase" | "restore";

interface Props {
  resultBlob: Blob;
  originalSrc: string;
  onDone: (blob: Blob) => void;
  onCancel: () => void;
}

export default function BrushEditor({ resultBlob, originalSrc, onDone, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("erase");
  const [size, setSize] = useState(30);
  const [painting, setPainting] = useState(false);
  const originalImgRef = useRef<HTMLImageElement | null>(null);
  const resultImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const origImg = new Image();
    const resImg = new Image();
    const resUrl = URL.createObjectURL(resultBlob);

    origImg.onload = () => { originalImgRef.current = origImg; };
    origImg.src = originalSrc;

    resImg.onload = () => {
      resultImgRef.current = resImg;
      canvas.width = resImg.naturalWidth;
      canvas.height = resImg.naturalHeight;
      const overlay = overlayRef.current!;
      overlay.width = resImg.naturalWidth;
      overlay.height = resImg.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(resImg, 0, 0);
      URL.revokeObjectURL(resUrl);
    };
    resImg.src = resUrl;
  }, [resultBlob, originalSrc]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const paint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!painting) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getPos(e, canvas);

    if (mode === "erase") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fill();
    } else {
      // Restore from original
      if (!originalImgRef.current) return;
      ctx.globalCompositeOperation = "source-over";
      const r = size / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(originalImgRef.current, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    ctx.globalCompositeOperation = "source-over";
  }, [painting, mode, size]);

  function handleDone() {
    const canvas = canvasRef.current!;
    canvas.toBlob(b => { if (b) onDone(b); }, "image/png", 1.0);
  }

  function handleReset() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (resultImgRef.current) ctx.drawImage(resultImgRef.current, 0, 0);
  }

  return (
    <div className="bg-[#0d0d1f] rounded-3xl overflow-hidden border border-white/10">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 flex-wrap">
        <span className="text-white font-black text-sm">Brush Editor</span>
        <div className="flex-1" />

        {/* Mode */}
        <div className="flex gap-1 glass rounded-xl p-1">
          <button onClick={() => setMode("erase")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${mode === "erase" ? "bg-red-500/80 text-white" : "text-gray-400 hover:text-white"}`}>
            <Eraser size={13} /> Erase
          </button>
          <button onClick={() => setMode("restore")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${mode === "restore" ? "bg-green-500/80 text-white" : "text-gray-400 hover:text-white"}`}>
            <Paintbrush size={13} /> Restore
          </button>
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
          <button onClick={() => setSize(s => Math.max(5, s - 5))} className="text-gray-400 hover:text-white"><Minus size={13} /></button>
          <span className="text-white text-xs font-bold w-6 text-center">{size}</span>
          <button onClick={() => setSize(s => Math.min(100, s + 5))} className="text-gray-400 hover:text-white"><Plus size={13} /></button>
        </div>

        <button onClick={handleReset} className="glass px-3 py-2 rounded-xl text-gray-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition">
          <RotateCcw size={13} /> Reset
        </button>
        <button onClick={onCancel} className="glass px-3 py-2 rounded-xl text-gray-400 hover:text-white text-xs font-bold transition">Cancel</button>
        <button onClick={handleDone} className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition">
          <Check size={13} /> Done
        </button>
      </div>

      {/* Canvas */}
      <div className="relative overflow-auto" style={{ maxHeight: "500px", background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23333'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23333'/%3E%3Crect x='10' y='0' width='10' height='10' fill='%23222'/%3E%3Crect x='0' y='10' width='10' height='10' fill='%23222'/%3E%3C/svg%3E\")" }}>
        <canvas
          ref={canvasRef}
          className="max-w-full"
          style={{ cursor: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><circle cx='${size/2}' cy='${size/2}' r='${size/2-1}' fill='none' stroke='${mode==="erase"?"red":"green"}' stroke-width='2'/></svg>") ${size/2} ${size/2}, crosshair` }}
          onMouseDown={e => { setPainting(true); paint(e); }}
          onMouseMove={paint}
          onMouseUp={() => setPainting(false)}
          onMouseLeave={() => setPainting(false)}
          onTouchStart={e => { setPainting(true); paint(e); }}
          onTouchMove={paint}
          onTouchEnd={() => setPainting(false)}
        />
        <canvas ref={overlayRef} className="hidden" />
      </div>

      <div className="px-5 py-3 border-t border-white/10">
        <p className="text-gray-500 text-xs">
          {mode === "erase" ? "🔴 Erase mode — paint over areas to remove" : "🟢 Restore mode — paint to bring back removed areas"}
        </p>
      </div>
    </div>
  );
}
