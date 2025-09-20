
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Zap, Layers, TrendingUp, Cpu, LockOpen, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type Slide = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  icon: React.ElementType;
};

const slides: Slide[] = [
  {
    title: "ChronoFlow: The Future of Value is Fluid",
    paragraphs: [
      "Welcome to the next evolution of finance. ChronoFlow converts any income stream—salaries, vesting schedules, or subscriptions—into a dynamic, liquid NFT on the high-speed Somnia network.",
      "Watch your earnings grow in real-time, second by second, and unlock the true time-value of your money.",
    ],
    icon: Zap,
  },
  {
    title: "The Problem: Locked-in Value",
    paragraphs: [
      "Traditional finance is rigid. Your future earnings are trapped on a calendar, inaccessible until a specific payday.",
      "This creates cash-flow gaps, limits financial flexibility, and prevents you from capitalizing on opportunities today.",
    ],
    icon: Layers,
  },
  {
    title: "The Solution: Dynamic StreamNFTs",
    paragraphs: [
      "ChronoFlow tokenizes your future income into a 'StreamNFT'. This NFT isn't static; it's a living asset that accrues value every second.",
      "As time passes, the NFT's value grows, reflecting the portion of the stream you've earned. It's a transparent, on-chain representation of your financial progress.",
    ],
    icon: TrendingUp,
  },
  {
    title: "How It Works: Simple & Secure",
    bullets: [
      "Create: A sender locks funds in our audited smart contract, defining the amount, duration, and recipient.",
      "Stream: The recipient instantly gets a StreamNFT. Value flows continuously from the sender to the NFT.",
      "Trade: The recipient can hold, trade, or use the StreamNFT as collateral in other DeFi protocols.",
    ],
    icon: Cpu,
  },
  {
    title: "Unlock Instant Liquidity",
    paragraphs: [
      "Your future income is no longer illiquid. A StreamNFT gives you options:",
    ],
    bullets: [
        "Sell your stream on the open market for upfront cash.",
        "Use it as collateral for a loan without interrupting the stream.",
        "Fractionalize it to share or diversify your future earnings.",
    ],
    icon: LockOpen,
  },
  {
    title: "Powered by Somnia: Speed & Security",
    paragraphs: [
        "ChronoFlow is built on the Somnia network to provide an unparalleled user experience.",
        "Enjoy sub-second transaction finality, ultra-low gas fees (95%+ cheaper than Ethereum), and enterprise-grade security, making real-time streaming not just possible, but practical."
    ],
    icon: Shield,
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export default function PitchPage() {
  const [[page, direction], setPage] = useState([0, 0]);
  const slideCount = slides.length;
  const pauseRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const paginate = (newDirection: number) => {
    setPage(([prevPage, _]) => [(prevPage + newDirection + slideCount) % slideCount, newDirection]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!pauseRef.current) {
        paginate(1);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) paginate(-1);
    if (dx < -50) paginate(1);
    touchStartX.current = null;
  }

  const currentSlide = slides[page];
  const Icon = currentSlide.icon;

  return (
    <main className="min-h-screen p-4 md:p-6 flex items-center justify-center bg-background text-foreground">
      <div
        className="w-full max-w-5xl aspect-[16/9] relative flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border"
        onMouseEnter={() => (pauseRef.current = true)}
        onMouseLeave={() => (pauseRef.current = false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-950/10 to-purple-950/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {currentSlide.title}
                  </h2>
                </motion.div>
                {currentSlide.paragraphs?.map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-muted-foreground leading-relaxed"
                  >
                    {p}
                  </motion.p>
                ))}
                {currentSlide.bullets && (
                  <motion.ul
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
                    }}
                    className="mt-4 space-y-3 text-muted-foreground"
                  >
                    {currentSlide.bullets.map((b, i) => (
                      <motion.li
                        key={i}
                        variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                        className="flex items-start"
                      >
                        <Shield className="w-4 h-4 mr-3 mt-1 shrink-0 text-primary" />
                        <span>{b}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </div>

              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
              >
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-border flex flex-col justify-center items-center text-foreground p-4 shadow-lg">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Icon className="w-10 h-10" />
                  </motion.div>
                  <div className="text-xs text-center text-muted-foreground">Dynamic StreamNFT</div>
                  <div className="mt-3 w-48 bg-black/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-blue-400 to-purple-400"
                      style={{
                        width: `${30 + (page * 8) % 60}%`,
                        transition: "width 1s linear",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between bg-background/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage([i, i > page ? 1 : -1])}
                aria-label={`Go to slide ${i + 1}`}
                className={cn("w-2 h-2 rounded-full transition-colors", i === page ? "bg-primary" : "bg-muted hover:bg-muted-foreground")}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous"
              onClick={() => paginate(-1)}
              className="p-2 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              aria-label="Next"
              onClick={() => paginate(1)}
              className="p-2 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

    