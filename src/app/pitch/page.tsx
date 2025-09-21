"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Rocket,
  Target,
  Layers,
  TrendingUp,
  LockOpen,
  Coins,
  Shield,
  GitBranch,
  Zap,
  Users,
  BarChart3
} from "lucide-react";
import { Button } from "@/newui/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

/*
  Completely reimagined ChronoFlow pitch deck (in-app).
  Features:
  - Rich storyline (Problem -> Solution -> Product -> Liquidity -> Metrics -> Model -> Tech -> Roadmap -> CTA)
  - Keyboard (← →), swipe, buttons, dots navigation
  - Animated transitions & metric counters
  - Accessible structure with semantic headings & aria labels
*/

interface Metric { label: string; value: number; suffix?: string; }
interface Milestone { q: string; title: string; detail: string; }
interface SlideBase { id: string; title: string; icon: React.ElementType; subtitle?: string; };

interface NarrativeSlide extends SlideBase { kind: 'narrative'; paragraphs: string[]; }
interface BulletsSlide extends SlideBase { kind: 'bullets'; bullets: string[]; paragraphs?: string[]; }
interface MetricsSlide extends SlideBase { kind: 'metrics'; metrics: Metric[]; note?: string; }
interface RoadmapSlide extends SlideBase { kind: 'roadmap'; milestones: Milestone[]; }
interface CtaSlide extends SlideBase { kind: 'cta'; paragraphs: string[]; actions?: { label: string; href?: string; intent?: 'primary' | 'secondary' }[]; }

type Slide = NarrativeSlide | BulletsSlide | MetricsSlide | RoadmapSlide | CtaSlide;

const slides: Slide[] = [
  {
    id: 'hero',
    kind: 'narrative',
    title: 'ChronoFlow',
    subtitle: 'Making Time Itself Programmable Value',
    icon: Rocket,
    paragraphs: [
      'ChronoFlow transforms future cash flows into live, composable on-chain assets called StreamNFTs.',
      'Income is no longer a static promise on a calendar— it becomes a continuously accruing, liquid primitive you can trade, collateralize, or accelerate.'
    ]
  },
  {
    id: 'problem',
    kind: 'narrative',
    title: 'The Problem',
    subtitle: 'Future Value Is Stranded',
    icon: Target,
    paragraphs: [
      'Salaries, vesting schedules, grants, subscriptions, service retainers— they all lock capital in time silos.',
      'Recipients must wait. Senders lose flexibility. DeFi cannot integrate temporal value because it is inert until released.'
    ]
  },
  {
    id: 'solution',
    kind: 'narrative',
    title: 'The Solution',
    subtitle: 'StreamNFT: A Living Asset',
    icon: Layers,
    paragraphs: [
      'We tokenize a time-based payment stream into an evolving NFT whose intrinsic claim value grows every second.',
      'This object is composable: trade it, fractionalize it, pledge it, price it, or build structured derivatives on top.'
    ]
  },
  {
    id: 'mechanics',
    kind: 'bullets',
    title: 'How It Works',
    subtitle: 'Simple Three-Phase Flow',
    icon: TrendingUp,
    paragraphs: [ 'ChronoFlow abstracts the grind of streaming logic into a minimal, auditable core.' ],
    bullets: [
      'Create: Payer deposits funds, defining recipient, token, amount, and duration.',
      'Mint: Recipient receives a StreamNFT reflecting realtime claimable balance.',
      'Accrue: Value unlocks per second; NFT resale transfers the remaining future flow.'
    ]
  },
  {
    id: 'liquidity',
    kind: 'bullets',
    title: 'Unlocking Liquidity',
    subtitle: 'Turn Waiting Into Optionality',
    icon: LockOpen,
    bullets: [
      'Sell forward earnings immediately for upfront capital.',
      'Use as pristine collateral in lending markets.',
      'Fractionalize to diversify or share revenue lines.',
      'Build automated roll-forward strategies (stream → credit line).' 
    ],
    paragraphs: [ 'Temporal value stops being idle and starts compounding opportunity.' ]
  },
  {
    id: 'metrics',
    kind: 'metrics',
    title: 'Market Momentum',
    subtitle: 'Why Streaming Primitives Now',
    icon: BarChart3,
    metrics: [
      { label: 'Token Streaming TAM', value: 180, suffix: 'B+' },
      { label: 'Global Payroll (Crypto Penetrable)', value: 55, suffix: 'B+' },
      { label: 'Recurring SaaS & Subscriptions', value: 600, suffix: 'B+' },
      { label: 'On-Chain Collateral Demand', value: 90, suffix: 'B+' }
    ],
    note: 'Early composable streaming rails could become a canonical base layer for programmable time-value.'
  },
  {
    id: 'model',
    kind: 'bullets',
    title: 'Business Model',
    subtitle: 'Aligned, Lean, Scalable',
    icon: Coins,
    bullets: [
      'Protocol Fee: Small basis points on stream creation.',
      'Secondary: Marketplace fee on StreamNFT trades.',
      'Credit Integrations: Revenue share with lending partners.',
      'Premium APIs: Enterprise dashboards & treasury automation.'
    ],
    paragraphs: [ 'Value capture scales with TVL and composability depth, not raw speculation.' ]
  },
  {
    id: 'tech',
    kind: 'bullets',
    title: 'Architecture & Moat',
    subtitle: 'Performance + Composability',
    icon: Shield,
    bullets: [
      'Audited minimal core smart contracts (reduced attack surface).',
      'Deterministic accrual math – no oracles required.',
      'StreamNFT standard: metadata + realtime claim formula.',
      'Extensible hooks for settlement, derivatives & automation.',
      'Somnia execution layer: sub-second finality + ultra-low fees.'
    ],
    paragraphs: [ 'Moat: Liquidity & standards capture – we define the canonical streaming asset representation early.' ]
  },
  {
    id: 'roadmap',
    kind: 'roadmap',
    title: 'Roadmap',
    subtitle: 'Compounding Surface Area',
    icon: GitBranch,
    milestones: [
      { q: 'Q1', title: 'MVP Streams + NFT', detail: 'Core contract, create/withdraw, marketplace beta.' },
      { q: 'Q2', title: 'Collateralization', detail: 'Integrations with lending / credit protocols.' },
      { q: 'Q3', title: 'Derivatives Layer', detail: 'Forward sale auctions & structured products.' },
      { q: 'Q4', title: 'Treasury Suite', detail: 'Enterprise payroll & cash runway analytics.' }
    ]
  },
  {
    id: 'cta',
    kind: 'cta',
    title: 'Build The Future of Flow',
    subtitle: 'Join Early – Shape the Standard',
    icon: Users,
    paragraphs: [
      'We are onboarding design partners for early treasury, payroll, and protocol integration use-cases.',
      'If you are building in DeFi, payroll infra, or capital markets automation – let’s collaborate.'
    ],
    actions: [
      { label: 'Create a Stream', intent: 'primary' },
      { label: 'View Marketplace', intent: 'secondary' }
    ]
  }
];

// Animation variants
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 80 : -80, opacity: 0, scale: 0.98 })
};

export default function PitchPage() {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const saved = localStorage.getItem('pitch:autoAdvance');
      return saved === null ? true : saved === '1';
    } catch { return true; }
  });
  const metricsAnimRef = useRef<number | null>(null);
  const metricsValuesRef = useRef<number[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isFirst = index === 0;
  const isLast = index === slides.length - 1;
  const current = slides[index];

  const go = useCallback((delta: number) => {
    setIndex(([i, _]) => {
      const target = i + delta;
      if (target < 0 || target >= slides.length) return [i, delta];
      return [target, delta];
    });
  }, []);

  const jump = (i: number) => {
    if (i === index) return;
    const dir = i > index ? 1 : -1;
    setIndex([i, dir]);
  };

  useEffect(() => {
    try { localStorage.setItem('pitch:autoAdvance', autoAdvance ? '1' : '0'); } catch {}
  }, [autoAdvance]);

  // Auto-advance (pause on manual interaction)
  useEffect(() => {
    if (!autoAdvance) return;
    if (isLast) return; // stop at final slide
    const id = setTimeout(() => go(1), 8000);
    return () => clearTimeout(id);
  }, [index, autoAdvance, go, isLast]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Home') jump(0);
      else if (e.key === 'End') jump(slides.length - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // Metric counters animation
  const animatedMetrics = useMetricCounters(current);

  // Touch swipe
  useSwipe(containerRef, go, () => setAutoAdvance(false));

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-[#0a0f24] text-foreground px-4 py-8 md:py-16">
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl rounded-3xl border border-border/50 bg-background/70 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col aspect-[16/9]"
        onMouseEnter={() => setAutoAdvance(false)}
      >
        <TopBar index={index} total={slides.length} auto={autoAdvance} toggleAuto={() => setAutoAdvance(a => !a)} />
        <div className="relative flex-1">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.section
              key={current.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0 grid md:grid-cols-[1fr_0.9fr] gap-10 p-6 md:p-12"
              aria-labelledby={`slide-${current.id}-title`}
            >
              <div className="flex flex-col space-y-6 overflow-y-auto pr-2">
                <HeaderBlock slide={current} index={index} />
                <ContentBlock slide={current} metricsValues={animatedMetrics} />
              </div>
              <VisualBlock slide={current} progress={index / (slides.length - 1)} />
            </motion.section>
          </AnimatePresence>
        </div>
        <FooterNav
          slides={slides}
          currentIndex={index}
          jump={jump}
          prev={() => go(-1)}
          next={() => go(1)}
          isFirst={isFirst}
          isLast={isLast}
          restart={() => jump(0)}
        />
      </div>
    </main>
  );
}

// -------- Subcomponents --------
function TopBar({ index, total, auto, toggleAuto }: { index: number; total: number; auto: boolean; toggleAuto: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-background/60 backdrop-blur-sm text-xs md:text-sm">
      <div className="font-mono tracking-tight text-muted-foreground">Slide {index + 1} / {total}</div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px]" onClick={toggleAuto}>
          {auto ? 'Pause Auto' : 'Play Auto'}
        </Button>
      </div>
    </div>
  );
}

function HeaderBlock({ slide, index }: { slide: Slide; index: number }) {
  const Icon = slide.icon;
  return (
    <div className="space-y-3" id={`slide-${slide.id}-title`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md">
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
          {slide.title}
          {slide.subtitle && (
            <span className="block text-base md:text-lg font-normal text-muted-foreground mt-1">
              {slide.subtitle}
            </span>
          )}
        </h2>
      </div>
      <div className="h-1 w-40 bg-gradient-to-r from-blue-500/70 via-purple-500/60 to-transparent rounded-full" />
    </div>
  );
}

function ContentBlock({ slide, metricsValues }: { slide: Slide; metricsValues: number[] }) {
  switch (slide.kind) {
    case 'narrative':
      return (
        <div className="space-y-4 text-sm md:text-base leading-relaxed text-muted-foreground">
          {slide.paragraphs.map((p, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              {p}
            </motion.p>
          ))}
        </div>
      );
    case 'bullets':
      return (
        <div className="space-y-5">
          {slide.paragraphs && slide.paragraphs.map((p, i) => (
            <motion.p key={i} className="text-sm md:text-base text-muted-foreground" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {p}
            </motion.p>
          ))}
          <ul className="space-y-3 text-sm md:text-base">
            {slide.bullets.map((b, i) => (
              <motion.li key={i} className="flex items-start gap-3" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                <div className="mt-1 w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                <span className="text-muted-foreground">{b}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      );
    case 'metrics':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {slide.metrics.map((m, i) => (
              <motion.div key={m.label} className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-border/40 relative overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {metricsValues[i].toLocaleString()}<span className="text-base align-super ml-0.5">{m.suffix}</span>
                </div>
                <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mt-1">{m.label}</div>
              </motion.div>
            ))}
          </div>
          {slide.note && <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{slide.note}</p>}
        </div>
      );
    case 'roadmap':
      return (
        <div className="space-y-5">
          <ol className="relative border-l border-border/50 ml-2">
            {slide.milestones.map((m, i) => (
              <motion.li key={m.q} className="ml-4 mb-6" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i }}>
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border border-border shadow" />
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">{m.q}</span>
                  <h4 className="text-sm md:text-base font-semibold">{m.title}</h4>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 pl-[2px]">{m.detail}</p>
              </motion.li>
            ))}
          </ol>
          <p className="text-[11px] md:text-xs text-muted-foreground italic">Timeline indicative – execution prioritizes security & composability depth.</p>
        </div>
      );
    case 'cta':
      return (
        <div className="space-y-5">
          {slide.paragraphs.map((p, i) => (
            <motion.p key={i} className="text-sm md:text-base text-muted-foreground" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {p}
            </motion.p>
          ))}
          {slide.actions && (
            <div className="flex flex-wrap gap-3 pt-2">
              {slide.actions.map(a => {
                const href = a.label === 'Create a Stream' ? '/create' : a.label === 'View Marketplace' ? '/marketplace' : a.href;
                return (
                  <Button
                    key={a.label}
                    size="sm"
                    variant={a.intent === 'secondary' ? 'outline' : 'default'}
                    className="text-xs md:text-sm"
                    asChild={!!href}
                  >
                    {href ? <Link href={href}>{a.label}</Link> : <span>{a.label}</span>}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      );
  }
}

function VisualBlock({ slide, progress }: { slide: Slide; progress: number }) {
  // Provide a unifying visual: dynamic orb + contextual overlay
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        key={slide.id}
        className="relative w-72 h-72 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-indigo-700/20 border border-border/40 shadow-2xl flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_70%)]" />
        <motion.div
          className="absolute w-[140%] h-[140%] -rotate-12"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(59,130,246,0.15), rgba(147,51,234,0.12), rgba(59,130,246,0.15))'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <slide.icon className="w-10 h-10" />
          </motion.div>
          <div className="mt-4 text-[10px] tracking-wider uppercase text-blue-200/70 font-medium">
            {slide.kind === 'metrics' ? 'Quantifying Opportunity' :
              slide.kind === 'roadmap' ? 'Execution Trajectory' :
              slide.kind === 'cta' ? 'Join The Flow' : 'Realtime Asset Primitive'}
          </div>
          <div className="mt-3 w-40 h-1 rounded-full bg-black/30 overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-blue-400 to-purple-400" style={{ width: `${Math.max(4, progress * 100)}%` }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FooterNav({
  slides,
  currentIndex,
  jump,
  prev,
  next,
  isFirst,
  isLast,
  restart
}: {
  slides: Slide[];
  currentIndex: number;
  jump: (i: number) => void;
  prev: () => void;
  next: () => void;
  isFirst: boolean;
  isLast: boolean;
  restart: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-background/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 md:gap-3">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => jump(i)}
            aria-label={`Go to slide ${i + 1}: ${s.title}`}
            className={cn(
              'h-2 rounded-full transition-all',
              currentIndex === i ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-6 shadow' : 'bg-muted w-2 hover:w-4'
            )}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        {!isFirst && (
          <Button variant="outline" size="icon" aria-label="Previous slide" onClick={prev}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        {!isLast && (
          <Button variant="outline" size="icon" aria-label="Next slide" onClick={next}>
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
        {isLast && (
          <Button size="sm" aria-label="Restart pitch" onClick={restart} className="text-xs">
            Restart
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------- Hooks ----------
function useMetricCounters(slide: Slide) {
  const [vals, setVals] = useState<number[]>([]);
  useEffect(() => {
    if (slide.kind !== 'metrics') { setVals([]); return; }
    const targets = slide.metrics.map(m => m.value);
    const start = performance.now();
    const duration = 1400;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVals(targets.map(v => Math.round(v * eased)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [slide]);
  return vals;
}

function useSwipe(ref: React.RefObject<HTMLDivElement>, go: (delta: number) => void, onInteract: () => void) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let startX: number | null = null;
    function onTouchStart(e: TouchEvent) { startX = e.touches[0].clientX; }
    function onTouchEnd(e: TouchEvent) {
      if (startX == null) return; onInteract();
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 60) go(-1); else if (dx < -60) go(1);
      startX = null;
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [ref, go, onInteract]);
}
