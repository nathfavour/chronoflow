import { Button } from "./ui/button";
import { ArrowRight, Play, Zap, Shield, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroProps {
  onLaunchApp: () => void;
}

export function Hero({ onLaunchApp }: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1713455212325-3841dd409519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc3RyZWFtJTIwZmxvd2luZyUyMHdhdGVyJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzU4MjcxMjAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Digital flowing background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm">Revolutionary DeFi Streaming Protocol</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Stream Value in
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {" "}Real-Time
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            ChronoFlow creates tradeable NFTs that represent real-time cash flow streams. 
            Transform salaries, vesting, and subscriptions into liquid, on-chain assets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-8 py-6 rounded-xl" onClick={onLaunchApp}>
              Launch App
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-Time Streaming</h3>
              <p className="text-muted-foreground">
                Continuous value transfer with second-by-second precision
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">NFT Liquidity</h3>
              <p className="text-muted-foreground">
                Trade, collateralize, or fractionalize your income streams
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">DeFi Integration</h3>
              <p className="text-muted-foreground">
                Seamlessly integrate with lending, yield farming, and more
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}