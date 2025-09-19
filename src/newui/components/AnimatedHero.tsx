import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Play, Zap, Shield, TrendingUp, Clock, DollarSign, Waves, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";

interface AnimatedHeroProps {
  onLaunchApp: () => void;
}

// Floating particle component
const FloatingParticle = ({ delay = 0, duration = 4 }) => (
  <motion.div
    className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
    animate={{
      x: [0, 100, -50, 0],
      y: [0, -100, -200, -300],
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1.5, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Animated number counter
const CountUpNumber = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref);

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

export function AnimatedHero({ onLaunchApp }: AnimatedHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const springScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const y1 = useTransform(springScrollProgress, [0, 1], [0, -200]);
  const y2 = useTransform(springScrollProgress, [0, 1], [0, -400]);
  const opacity = useTransform(springScrollProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const scale = useTransform(springScrollProgress, [0, 1], [1, 0.8]);

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <motion.section 
        className="min-h-screen relative overflow-hidden flex items-center justify-center"
        style={{ opacity, scale }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-cyan-950/20" />
        
        {/* Flowing particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <FloatingParticle delay={i * 0.1} duration={4 + Math.random() * 2} />
            </div>
          ))}
        </div>

        {/* Main content */}
        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
          style={{ y: y1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-primary/5 border border-primary/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-5 h-5 text-blue-400" />
            </motion.div>
            <span className="text-foreground/80">Revolutionary DeFi Streaming Protocol</span>
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-8xl mb-8 relative"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <span className="block bg-gradient-to-r from-foreground via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Stream Value in
            </span>
            <motion.span 
              className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Real-Time
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            ChronoFlow creates tradeable NFTs that represent real-time cash flow streams. 
            Transform salaries, vesting, and subscriptions into liquid, on-chain assets.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl shadow-blue-500/25"
                onClick={onLaunchApp}
              >
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Launch App
                </motion.span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 rounded-xl border-2 border-primary/20 hover:border-primary/40 backdrop-blur-sm"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-primary/50 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Flowing Stream Visualization */}
      <section className="min-h-screen relative overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-blue-950/10" />
        
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-foreground to-blue-400 bg-clip-text text-transparent">
              Watch Value Flow
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of payments with continuous, real-time value transfer
            </p>
          </motion.div>

          {/* Animated Stream Flow */}
          <div className="relative h-96 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-primary/20">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Stream particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `-10px`,
                }}
                animate={{
                  x: [0, window.innerWidth || 1200],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 6,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">💧</div>
                <div className="text-2xl font-semibold text-blue-400">
                  $<CountUpNumber end={1250} duration={3} />/sec
                </div>
                <div className="text-muted-foreground">Streaming to recipient</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="min-h-screen relative flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl mb-6">
              Revolutionary Features
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
                description: "Continuous value transfer with second-by-second precision",
                color: "blue",
                delay: 0
              },
              {
                icon: Shield,
                title: "NFT Liquidity",
                description: "Trade, collateralize, or fractionalize your income streams",
                color: "purple",
                delay: 0.2
              },
              {
                icon: TrendingUp,
                title: "DeFi Integration",
                description: "Seamlessly integrate with lending, yield farming, and more",
                color: "cyan",
                delay: 0.4
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 100, rotateX: 45 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 1, delay: feature.delay }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="relative group"
                >
                  <div className={`p-8 rounded-3xl bg-gradient-to-br from-${feature.color}-500/10 to-${feature.color}-600/5 border border-${feature.color}-500/20 backdrop-blur-sm hover:border-${feature.color}-400/40 transition-all duration-300`}>
                    <motion.div 
                      className={`w-16 h-16 bg-${feature.color}-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-${feature.color}-500/30 transition-all duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className={`w-8 h-8 text-${feature.color}-400`} />
                    </motion.div>
                    <h3 className="text-2xl mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Animated border */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100"
                    style={{
                      background: `conic-gradient(from 0deg, transparent, ${feature.color === 'blue' ? '#3b82f6' : feature.color === 'purple' ? '#8b5cf6' : '#06b6d4'}, transparent)`,
                      padding: '2px',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-full h-full bg-background rounded-3xl" />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5" />
        
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: "Total Value Locked", value: 2500000, prefix: "$", suffix: "M" },
              { label: "Active Streams", value: 15420, prefix: "", suffix: "" },
              { label: "Stream NFTs", value: 8934, prefix: "", suffix: "" },
              { label: "Daily Volume", value: 50, prefix: "$", suffix: "M" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div 
                  className="text-4xl md:text-6xl mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                  whileInView={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {stat.prefix}
                  <CountUpNumber end={stat.value} duration={2 + index * 0.2} />
                  {stat.suffix}
                </motion.div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}