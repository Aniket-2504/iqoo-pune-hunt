"use client";
import React, { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { iqooData, IqooDataItem } from "@/lib/data";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas-pro";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, PackageOpen, ShieldX, Trophy } from "lucide-react";

const PRELOADER_MESSAGES = [
  "Scanning the drop zone...",
  "You are so close...",
  "Let's hope it's a special QR...",
  "Revealing the treasure...",
  "Almost there, Quester...",
];

const PHONE_IMAGES = ["/phone-front.png", "/phone-back.png", "/phone-b-front.png", "/phone-b-back.png"];

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  side: (i % 2 === 0 ? "left" : "right") as "left" | "right",
  color: ["#EAB308", "#FFFFFF", "#FDE047", "#A3A3A3", "#FCD34D", "#F59E0B"][i % 6],
  size: Math.random() * 8 + 5,
  delay: Math.random() * 0.45,
  duration: Math.random() * 1.0 + 1.0,
  xTravel: Math.random() * 160 + 80,
  yTravel: Math.random() * 320 + 180,
  rotate: Math.random() * 720 - 360,
  shape: (["circle", "rect", "triangle"] as const)[i % 3],
}));

type PageState = "preloader" | "invalid" | "already-claimed" | "content";

export default function HuntPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const tokenParam = searchParams.get("t");

  const item = iqooData[id] as IqooDataItem | undefined;

  const [pageState, setPageState] = useState<PageState>("preloader");
  const [isCapturing, setIsCapturing] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Preloader → then validate token + check golden claim
  useEffect(() => {
    let start: number | null = null;
    const duration = 5200;
    const msgInterval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % PRELOADER_MESSAGES.length);
    }, 700);

    const animate = (ts: number) => {
      if (!start) start = ts;
      const pct = Math.min(((ts - start) / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(animate);
      } else {
        clearInterval(msgInterval);
        setTimeout(async () => {
          // 1. Validate token
          if (!item || !tokenParam || tokenParam !== item.token) {
            setPageState("invalid");
            return;
          }

          // 2. If golden QR — call claim API
          if (item.type === "special") {
            try {
              const res = await fetch("/api/claim", { method: "POST" });
              const data = await res.json();
              if (data.claimed) {
                setPageState("already-claimed");
                return;
              }
            } catch {
              // KV down — allow through
            }
          }

          // 3. All good — show content
          setPageState("content");
          setShowParticles(true);
          setTimeout(() => setShowParticles(false), 2400);
        }, 300);
      }
    };
    requestAnimationFrame(animate);
    return () => clearInterval(msgInterval);
  }, []);

  // Auto-slide phone images
  useEffect(() => {
    if (pageState !== "content") return;
    const t = setInterval(() => setCurrentSlide((s) => (s + 1) % PHONE_IMAGES.length), 2800);
    return () => clearInterval(t);
  }, [pageState]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    setRotateY((e.clientX - left - width / 2) / 12);
    setRotateX(-(e.clientY - top - height / 2) / 12);
  };

  const handleCapture = async () => {
    if (!cardRef.current) return;
    try {
      setIsCapturing(true);
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#000000",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `iQOO-Loot-${id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } finally {
      setIsCapturing(false);
    }
  };

  const isSpecial = item?.type === "special";
  const isEmpty = item?.type === "empty";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&family=Barlow:ital,wght@0,700;0,900;1,700;1,900&family=Share+Tech+Mono&display=swap');
        .font-bc  { font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif; }
        .font-b   { font-family: 'Barlow', 'Arial Black', sans-serif; }
        .font-stm { font-family: 'Share Tech Mono', 'Courier New', monospace; }
      `}</style>

      <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 overflow-y-auto relative">

        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none">
          <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-[120px] opacity-20 ${
            isSpecial ? "bg-yellow-400" : isEmpty ? "bg-zinc-600" : "bg-yellow-500"
          }`} />
        </div>

        {/* ─── PARTICLES ─── */}
        <AnimatePresence>
          {showParticles && (
            <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
              {PARTICLES.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{
                    opacity: 1,
                    x: p.side === "left" ? -20 : (window.innerWidth + 20),
                    y: window.innerHeight * 0.45,
                    rotate: 0,
                    scale: 1,
                  }}
                  animate={{
                    opacity: [1, 1, 0],
                    x: p.side === "left" ? p.xTravel : (window.innerWidth - p.xTravel),
                    y: window.innerHeight * 0.45 - p.yTravel,
                    rotate: p.rotate,
                    scale: [1, 1.3, 0.5],
                  }}
                  transition={{ duration: p.duration, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    borderRadius: p.shape === "circle" ? "50%" : p.shape === "rect" ? "2px" : 0,
                    clipPath: p.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* ─── PRELOADER ─── */}
        <AnimatePresence>
          {pageState === "preloader" && (
            <motion.div
              key="preloader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.45 }}
              className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center px-10 gap-8"
            >
              <motion.div
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <img src="/flogo.png" alt="iQOO Connect" className="h-8 object-contain" />
                <span className="text-yellow-400 text-[11px] tracking-widest font-semibold font-stm">PUNE CLAN</span>
              </motion.div>

              <div className="relative w-20 h-20 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-yellow-500/40"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                />
                <img src="/iqoo-logo.png" alt="iQOO" className="w-6 h-6 object-contain" />
              </div>

              <div className="w-full max-w-[260px] flex flex-col gap-3">
                <div className="h-[3px] w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-yellow-500"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={msgIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28 }}
                    className="font-stm text-zinc-400 text-xs tracking-wide text-center"
                  >
                    {PRELOADER_MESSAGES[msgIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── INVALID TOKEN ─── */}
        <AnimatePresence>
          {pageState === "invalid" && (
            <motion.div
              key="invalid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6 text-center px-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 150, damping: 14 }}
              >
                <ShieldX size={64} strokeWidth={1.2} className="text-zinc-600" />
              </motion.div>
              <div className="space-y-2">
                <h2 className="font-bc text-2xl font-black italic uppercase text-zinc-400">
                  Nothing Here
                </h2>
                <p className="font-stm text-zinc-600 text-xs tracking-wide">
                  This QR doesn't check out.<br />Scan the physical QR at the event.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── ALREADY CLAIMED ─── */}
        <AnimatePresence>
          {pageState === "already-claimed" && (
            <motion.div
              key="claimed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6 text-center px-8 max-w-[340px]"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 140, damping: 12 }}
              >
                <Trophy size={64} strokeWidth={1.2} className="text-yellow-600" />
              </motion.div>
              <div className="space-y-3">
                <h2 className="font-bc text-3xl font-black italic uppercase text-yellow-600">
                  Already Claimed!
                </h2>
                <p className="font-b text-zinc-400 text-sm leading-relaxed">
                  A fellow Quester got here first and claimed the Golden QR prize. 🏆
                </p>
                <p className="font-stm text-zinc-600 text-xs tracking-wide pt-2">
                  Keep exploring — there are still feature cards to discover!
                </p>
              </div>
              <div className="mt-2 border-t border-zinc-800 w-full pt-4">
                <p className="font-b text-[8px] text-zinc-700 tracking-[0.18em] uppercase">
                  @iqooind · @iqoocommunityind · #iQOOPuneClan
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── MAIN CONTENT ─── */}
        <AnimatePresence>
          {pageState === "content" && item && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[390px] flex flex-col items-center"
            >
              {/* CAPTURE REGION */}
              <div ref={cardRef} className="w-full flex flex-col items-center bg-black pb-5 px-0">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mb-5 pt-2"
                >
                  <img src="/flogo.png" alt="iQOO Connect" className="h-10 object-contain opacity-90" />
                </motion.div>

                <div className="w-full" style={{ perspective: "1000px" }}>
                  <motion.div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
                    animate={{ rotateX, rotateY }}
                    transition={{ type: "spring", stiffness: 120, damping: 22 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className={`relative w-full rounded-[2rem] overflow-hidden border ${
                      isSpecial
                        ? "border-yellow-400/60 bg-gradient-to-b from-yellow-950/60 to-zinc-900/80"
                        : isEmpty
                        ? "border-zinc-700/40 bg-zinc-900/60"
                        : "border-yellow-500/20 bg-zinc-900/60"
                    } backdrop-blur-xl shadow-2xl`}
                  >
                    {isSpecial && (
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
                    )}

                    <div className="p-7">
                      <div className="flex justify-between items-center mb-8">
                        <span className={`font-mono text-[9px] uppercase tracking-[0.2em] ${isSpecial ? "text-yellow-400" : "text-yellow-500/60"}`}>
                          iQOO 15R // DROP
                        </span>
                        <span className="font-stm text-yellow-400/70 text-[9px] tracking-widest">
                          #PUNE_CLAN_2026
                        </span>
                      </div>

                      {/* Phone slider / empty */}
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="relative h-56 w-full flex items-center justify-center mb-8 overflow-hidden"
                      >
                        <div className={`absolute w-40 h-40 rounded-full blur-[70px] ${isSpecial ? "bg-orange-800/30" : "bg-yellow-300/15"}`} />
                        {isEmpty ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.25, type: "spring", stiffness: 140, damping: 14 }}
                            className="flex flex-col items-center gap-4 z-10"
                          >
                            <div className="relative flex items-center justify-center">
                              <div className="absolute w-28 h-28 rounded-full bg-zinc-700/20 blur-[24px]" />
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
                                className="absolute w-24 h-24 rounded-full border border-dashed border-zinc-600/50"
                              />
                              <PackageOpen size={56} strokeWidth={1.1} className="text-zinc-500 relative z-10" />
                            </div>
                            <p className="font-stm text-zinc-600 text-[10px] tracking-[0.22em] uppercase mt-1">loot.not.found</p>
                          </motion.div>
                        ) : (
                          PHONE_IMAGES.map((src, i) => (
                            <motion.img
                              key={src}
                              src={src}
                              alt={`iQOO 15R view ${i + 1}`}
                              className={`absolute h-full object-contain drop-shadow-2xl ${isSpecial ? "drop-shadow-[0_0_40px_rgba(234,179,8,0.4)]" : ""}`}
                              style={{ transform: "translateZ(50px)" }}
                              animate={{
                                opacity: currentSlide === i ? 1 : 0,
                                scale: currentSlide === i ? 1 : 0.9,
                                x: currentSlide === i ? 0 : i > currentSlide ? 40 : -40,
                              }}
                              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                            />
                          ))
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                        className="text-center space-y-3"
                        style={{ transform: "translateZ(30px)" }}
                      >
                        <h2
                          className={`font-bc text-3xl font-black uppercase leading-tight ${
                            isSpecial ? "text-yellow-400" : isEmpty ? "text-zinc-500" : "text-white"
                          }`}
                          style={{ letterSpacing: "-0.02em", fontStyle: "italic" }}
                        >
                          {isEmpty ? "Loot Empty" : item.feature}
                        </h2>
                        <p className={`text-sm leading-relaxed px-2 ${isEmpty ? "text-zinc-600" : "text-zinc-400"}`}>
                          {(item as any).detail || (item as any).message}
                        </p>
                      </motion.div>

                      <div className="mt-6 border-t border-white/5" />
                      <p className="font-b text-center text-[8px] text-zinc-600 font-bold tracking-[0.18em] pt-4 uppercase">
                        @iqooind · @iqoocommunityind · #iQOOPuneClan
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* I Quest On and On */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="font-b flex items-center gap-[2px] justify-center mt-5"
                >
                  <span className="text-yellow-400 text-xl font-black italic">I</span>
                  <span className="text-white text-xl font-black italic mx-[5px]">Quest</span>
                  <span className="text-yellow-400 text-xl font-black italic leading-none z-10">O</span>
                  <span className="text-white text-xl font-black italic">n and</span>
                  <span className="text-yellow-400 text-xl font-black italic leading-none z-10 ml-[4px]">O</span>
                  <span className="text-white text-xl font-black italic">n</span>
                </motion.div>
              </div>

              {/* BUTTONS */}
              {!isEmpty && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="w-full mt-5 space-y-3 px-1"
                >
                  <Button
                    onClick={handleCapture}
                    disabled={isCapturing}
                    className="font-b w-full h-14 bg-white text-black font-black rounded-2xl border-b-4 border-zinc-300 active:border-b-0 uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 hover:bg-zinc-100"
                  >
                    <Download size={17} strokeWidth={2.5} />
                    {isCapturing ? "Saving..." : "Save to Gallery"}
                  </Button>
                  <Button
                    onClick={() => {
                      window.location.href = "instagram://camera";
                      setTimeout(() => { window.location.href = "https://www.instagram.com/"; }, 800);
                    }}
                    className="font-b w-full h-14 bg-yellow-500 text-black font-black rounded-2xl border-b-4 border-yellow-700 active:border-b-0 uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 hover:bg-yellow-400"
                  >
                    <Share2 size={17} strokeWidth={2.5} />
                    Share to Story
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating community button */}
        <motion.a
          href="https://community.iqoo.com/in/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: pageState === "preloader" ? 0 : 1, scale: pageState === "preloader" ? 0.5 : 1 }}
          transition={{ delay: 0.85, type: "spring", stiffness: 200, damping: 18 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-6 right-5 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 z-50 border-2 border-yellow-400"
          title="iQOO Community"
        >
          <img src="/iqoo-logo.png" alt="iQOO Community" className="w-5 h-5 object-contain" />
        </motion.a>

      </div>
    </>
  );
}