"use client";
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import Link from "next/link";
import {
  Upload, Download, Loader2, AlertCircle, CheckCircle,
  ImageIcon, Trash2, Zap, Lock
} from "lucide-react";
import { removeBackground } from "@imgly/background-removal";

type Stage = "idle" | "processing" | "done" | "error";

export default function ToolPage() {
  const { data: session } = useSession();
  const [original, setOriginal] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [hdResult, setHdResult] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState(session?.user?.credits ?? 0);
  const [hdLoading, setHdLoading] = useState(false);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setOriginal(URL.createObjectURL(file));
    setOriginalFile(file);
    setPreview(null);
    setHdResult(null);
    setError("");
    processPreview(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] }, maxFiles: 1,
  });

  async function processPreview(file: File) {
    setStage("processing");
    setProgress(10);
    try {
      const blob = await removeBackground(file, {
        progress: (key, cur, total) => setProgress(Math.round((cur / total) * 90) + 5),
      });
      setPreview(URL.createObjectURL(blob));
      setStage("done");
      setProgress(100);
    } catch {
      setError("Processing failed. Please try another image.");
      setStage("error");
    }
  }

  async function downloadHD() {
    if (!session) return;
    if (!originalFile) return;
    setHdLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("image", originalFile);
      const res = await fetch("/api/remove-bg", { method: "POST", body: form });
      if (res.status === 402) {
        setError("No credits remaining. Please purchase credits.");
        setHdLoading(false);
        return;
      }
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "HD processing failed");
        setHdLoading(false);
        return;
      }
      const remaining = res.headers.get("X-Credits-Remaining");
      if (remaining) setCredits(parseInt(remaining));
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setHdResult(url);
      const a = document.createElement("a");
      a.href = url;
      a.download = "removed-bg-hd.png";
      a.click();
    } catch {
      setError("HD download failed. Please try again.");
    }
    setHdLoading(false);
  }

  function downloadPreview() {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = "removed-bg-preview.png";
    a.click();
  }

  function reset() {
    setOriginal(null);
    setOriginalFile(null);
    setPreview(null);
    setHdResult(null);
    setStage("idle");
    setProgress(0);
    setError("");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Remove Image Background</h1>
          <p className="text-gray-500">Free preview · 3 HD downloads/day free · Credits never expire</p>
          {session && (
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 px-4 py-1.5 rounded-full text-sm font-medium mt-3">
              <Zap size={14} /> {credits} HD credits available
            </div>
          )}
        </div>

        {/* Upload Zone */}
        {stage === "idle" && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
              isDragActive ? "border-violet-500 bg-violet-50" : "border-gray-300 bg-white hover:border-violet-400 hover:bg-violet-50/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={30} className="text-violet-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {isDragActive ? "Drop your image here" : "Drag & drop your image here"}
            </h3>
            <p className="text-gray-500 mb-4">or click to browse files</p>
            <p className="text-sm text-gray-400">Supports JPG, PNG, WEBP · Max 10MB</p>
          </div>
        )}

        {/* Processing */}
        {stage === "processing" && (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
            <Loader2 size={48} className="text-violet-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Removing Background...</h3>
            <div className="w-full max-w-sm mx-auto bg-gray-100 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-violet-600 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">{progress}% complete</p>
          </div>
        )}

        {/* Error */}
        {stage === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
            <p className="text-red-700 font-medium mb-4">{error}</p>
            <button onClick={reset} className="bg-white border border-red-200 text-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition">Try Again</button>
          </div>
        )}

        {/* Result */}
        {stage === "done" && original && preview && (
          <div className="space-y-6">
            {/* Before/After Slider */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" /> Background Removed
                </h3>
                <button onClick={reset} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm transition">
                  <Trash2 size={14} /> New Image
                </button>
              </div>
              <div className="rounded-xl overflow-hidden">
                <ReactCompareSlider
                  itemOne={<ReactCompareSliderImage src={original} alt="Original" style={{ objectFit: "contain" }} />}
                  itemTwo={
                    <div className="w-full h-full" style={{ background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' y='0' width='10' height='10' fill='%23fff'/%3E%3Crect x='0' y='10' width='10' height='10' fill='%23fff'/%3E%3C/svg%3E\")" }}>
                      <ReactCompareSliderImage src={preview} alt="Result" style={{ objectFit: "contain" }} />
                    </div>
                  }
                  style={{ height: "400px" }}
                />
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">← Drag slider to compare before & after →</p>
            </div>

            {/* Download Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Free Download */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Download size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Preview Download</p>
                    <p className="text-xs text-gray-400">Low resolution · Always free</p>
                  </div>
                </div>
                <button
                  onClick={downloadPreview}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium transition flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Download Free
                </button>
              </div>

              {/* HD Download */}
              <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl p-6 border border-violet-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Zap size={16} className="text-violet-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">HD Download</p>
                    <p className="text-xs text-gray-400">Full resolution · 1 credit</p>
                  </div>
                </div>
                {!session ? (
                  <Link href="/auth/signup" className="w-full bg-gradient-to-r from-violet-600 to-blue-500 text-white py-2.5 rounded-xl font-medium transition flex items-center justify-center gap-2 hover:opacity-90">
                    <Lock size={16} /> Sign Up for Free HD
                  </Link>
                ) : credits > 0 ? (
                  <button
                    onClick={downloadHD}
                    disabled={hdLoading}
                    className="w-full bg-gradient-to-r from-violet-600 to-blue-500 text-white py-2.5 rounded-xl font-medium transition flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
                  >
                    {hdLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {hdLoading ? "Processing..." : "Download HD (1 credit)"}
                  </button>
                ) : (
                  <Link href="/pricing" className="w-full bg-gradient-to-r from-violet-600 to-blue-500 text-white py-2.5 rounded-xl font-medium transition flex items-center justify-center gap-2 hover:opacity-90">
                    <Zap size={16} /> Buy Credits for HD
                  </Link>
                )}
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              </div>
            </div>

            {/* Upload Another */}
            <div className="text-center">
              <button onClick={reset} className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-2 mx-auto">
                <Upload size={16} /> Upload Another Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
