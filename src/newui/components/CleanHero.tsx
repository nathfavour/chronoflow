import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Play, Shield, TrendingUp, Waves } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { SomniaNetworkBadge } from "./SomniaNetworkBadge";
import { InteractiveStreamSimulator } from "./InteractiveStreamSimulator";
import { SecurityAuditsSection } from "./SecurityAuditsSection";
import { SocialProofSection } from "./SocialProofSection";

interface CleanHeroProps {
  onLaunchApp: () => void;
}

// Simple animated counter
const CountUpNumber = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
};

export function CleanHero({ onLaunchApp }: CleanHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <motion.section 
        className="min-h-screen relative flex items-center justify-center pt-24"
        style={{ opacity }}
      >
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-purple-50/10 to-background" />
        
        {/* Main content */}
        <motion.div 
          className="relative z-10 max-w-6xl mx-auto px-4 text-center"
          style={{ y }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="block mb-2">Stream Value in</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Real-Time
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            ChronoFlow creates tradeable NFTs that represent real-time cash flow streams. 
            Transform salaries, vesting, and subscriptions into liquid, on-chain assets.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={onLaunchApp}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4"
            >
              <Play className="mr-2 w-5 h-5" />
              Connect Somnia Wallet
            </Button>
          </motion.div>

          {/* Somnia Network Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <SomniaNetworkBadge />
          </motion.div>
        </motion.div>

        {/* Simple scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </motion.section>

      {/* Interactive Stream Simulator Section */}
      <section className="min-h-screen relative flex items-center">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-6">
              Experience Real-Time Streaming
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Try our interactive calculator to see how ChronoFlow transforms payments into continuous value streams
            </p>
          </motion.div>

          <InteractiveStreamSimulator />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-6">
              Key Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powered by cutting-edge DeFi technology and NFT innovation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Waves,
                title: "Real-Time Streaming",
                description: "Continuous value transfer with second-by-second precision"
              },
              {
                icon: Shield,
                title: "NFT Liquidity",
                description: "Trade, collateralize, or fractionalize your income streams"
              },
              {
                icon: TrendingUp,
                title: "DeFi Integration",
                description: "Seamlessly integrate with lending, yield farming, and more"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <SocialProofSection />

      {/* Security & Audits Section */}
      <SecurityAuditsSection />
    </div>
  );
}