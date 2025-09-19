"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const slides: Slide[] = [
  {
    title: "ChronoFlow — Real-Time Yield Streams as Tradable NFTs",
    paragraphs: [
      "ChronoFlow tokenizes continuous streams of value — vesting, subscriptions, or salaries — into dynamic, tradable NFTs on Somnia.",
      "These StreamNFTs visually update and accrue value every second, turning abstract future cash flows into liquid, visible assets.",
    ],
  },
  {
    title: "Core Concept",
    paragraphs: [
      "Most blockchains make continuous payments inefficient: they rely on off-chain keepers or periodic manual claims.",
      "Somnia's architecture (high TPS and sub-second finality) enables fully on-chain, real-time handling of streams at scale.",
    ],
  },
  {
    title: "Create a Flow",
    paragraphs: [
      "A sender locks a total amount of tokens in ChronoFlow, specifies the recipient, duration, and token type.",
      "The duration and flow parameters determine how value is released over time to the recipient.",
    ],
  },
  {
    title: "Mint a StreamNFT",
    paragraphs: [
      "The recipient immediately receives a StreamNFT representing their claim on the future stream.",
      "The NFT is dynamic: metadata and visuals update in real-time to reflect total value, streamed amount, remaining value, and flow rate.",
    ],
  },
  {
    title: "Real-Time Accrual",
    paragraphs: [
      "Claimable balance grows every second; recipients can withdraw accrued tokens at any time with a single, fast transaction.",
      "This is the DeFi value: ownership and access to yield are immediate and on-chain.",
    ],
  },
  {
    title: "Full Liquidity & Utility",
    bullets: [
      "Sell a StreamNFT on a marketplace to monetize future cash flows up front.",
      "Use a StreamNFT as algorithmic collateral for loans — remaining stream value is clear and composable.",
      "Fractionalize a stream to split claims and broaden access to investors.",
    ],
  },
  {
    title: "Why this matters for products & business",
    paragraphs: [
      "ChronoFlow unlocks new business models: monetizable vesting, subscription liquidity, and secondary markets for predictable future revenue.",
      "For DAOs, employers, and creators, StreamNFTs make long-term agreements tradable, composable, and visible in real-time.",
    ],
  },
];

export default function PitchPage() {
  const [index, setIndex] = useState(0);
  const slideCount = slides.length;
  const pauseRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!pauseRef.current) setIndex((i) => (i + 1) % slideCount);
    }, 6000);
    return () => clearInterval(interval);
  }, [slideCount]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, slideCount - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slideCount]);

  function next() {
    setIndex((i) => (i + 1) % slideCount);
  }
  function prev() {
    setIndex((i) => (i - 1 + slideCount) % slideCount);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) prev();
    if (dx < -50) next();
    touchStartX.current = null;
  }

  return (
    <main className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-black">
      <div className="w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pitch — ChronoFlow</h1>
          <div className="flex gap-2">
            <button
              aria-label="Previous"
              onClick={prev}
              className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-sm"
            >
              ‹ Prev
            </button>
            <button
              aria-label="Next"
              onClick={next}
              className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm"
            >
              Next ›
            </button>
          </div>
        </div>

        <div
          onMouseEnter={() => (pauseRef.current = true)}
          onMouseLeave={() => (pauseRef.current = false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative overflow-hidden rounded-xl shadow-lg"
          style={{ background: "var(--card-bg, transparent)" }}
        >
          <div
            className="flex w-full"
            style={{
              width: `${slideCount * 100}%`,
              transform: `translateX(-${index * (100 / slideCount)}%)`,
              transition: "transform 700ms cubic-bezier(.2,.9,.2,1)",
            }}
          >
            {slides.map((s, idx) => (
              <section key={idx} className="w-full flex-shrink-0 p-8 bg-white dark:bg-slate-800">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{s.title}</h2>
                    {s.paragraphs?.map((p, i) => (
                      <p key={i} className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                        {p}
                      </p>
                    ))}

                    {s.bullets && (
                      <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        {s.bullets.map((b, bi) => (
                          <li key={bi}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <div className="w-64 h-40 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 flex flex-col justify-center items-center text-white">
                      <div className="text-xs opacity-90">StreamNFT preview</div>
                      <div className="mt-3 w-48 bg-black/20 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 bg-white/90"
                          style={{
                            width: `${30 + (idx * 8) % 60}%`,
                            transition: "width 1s linear",
                          }}
                        />
                      </div>
                      <div className="mt-2 text-[11px] uppercase tracking-wider opacity-90">dynamic • tradable • accrues</div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-3 h-3 rounded-full ${i === index ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          <div>
            Slides auto-advance every 6s. Use arrow keys, touch swipes, or the buttons to navigate. The content is based on the provided ChronoFlow pitch (business features and applications).
          </div>
        </div>
      </div>

      <style>{`
        :root { --card-bg: transparent }
        @media (prefers-color-scheme: dark) {
          :root { --card-bg: rgba(255,255,255,0.02) }
        }
      `}</style>
    </main>
  );
}
