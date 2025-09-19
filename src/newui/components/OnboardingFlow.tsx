import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  ArrowRight,
  ArrowLeft,
  Check,
  Wallet,
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Play,
  BookOpen,
  Target,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to ChronoFlow",
      description: "Your gateway to revolutionary DeFi stream payments",
      icon: Sparkles,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Ready to revolutionize payments?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              ChronoFlow transforms traditional payments into continuous, real-time streams 
              backed by tradeable NFTs on the lightning-fast Somnia network.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$2.4M+</div>
                <div className="text-sm text-muted-foreground">Total Streamed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1,247</div>
                <div className="text-sm text-muted-foreground">Active Streams</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "concepts",
      title: "Understanding Stream Payments",
      description: "Learn how continuous value flows work",
      icon: DollarSign,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold">Traditional Payments</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Fixed payment schedules</li>
                <li>• Large lump sums</li>
                <li>• Cash flow gaps</li>
                <li>• Manual processing</li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Stream Payments</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Continuous value flow</li>
                <li>• Real-time payments</li>
                <li>• Improved cash flow</li>
                <li>• Automated & secure</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 p-6 rounded-xl border border-border/50">
            <h4 className="font-semibold mb-2">Example: $60,000 Salary</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Traditional: $5,000 per month (12 payments)</div>
              <div>ChronoFlow: $0.69 per minute (continuous stream)</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "nfts",
      title: "Stream NFTs: Tradeable Cash Flows",
      description: "How streams become liquid assets",
      icon: TrendingUp,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-purple-500" />
              </div>
              <h4 className="font-semibold mb-2">Create</h4>
              <p className="text-sm text-muted-foreground">
                Set up streams and mint NFTs representing future cash flows
              </p>
            </Card>
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h4 className="font-semibold mb-2">Trade</h4>
              <p className="text-sm text-muted-foreground">
                Buy and sell stream NFTs on our marketplace for instant liquidity
              </p>
            </Card>
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <h4 className="font-semibold mb-2">Secure</h4>
              <p className="text-sm text-muted-foreground">
                All streams backed by smart contracts and Somnia network security
              </p>
            </Card>
          </div>
          <div className="bg-muted/50 p-6 rounded-xl">
            <h4 className="font-semibold mb-3">Real-World Example</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Original Stream Value:</span>
                <span>$60,000 USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Streamed So Far:</span>
                <span>$22,500 USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">NFT Market Value:</span>
                <span className="font-semibold text-green-600">45.5 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Yield:</span>
                <span className="font-semibold text-blue-600">8.2% APY</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "somnia",
      title: "Powered by Somnia Network",
      description: "Lightning-fast, cost-effective blockchain",
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Why Somnia Network?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Built for high-frequency, real-time transactions with enterprise-grade security
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <div className="font-semibold">Sub-second finality</div>
                  <div className="text-sm text-muted-foreground">Instant transaction confirmation</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold">Ultra-low fees</div>
                  <div className="text-sm text-muted-foreground">Average gas cost: $0.002</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <div className="font-semibold">Enterprise security</div>
                  <div className="text-sm text-muted-foreground">99.97% network uptime</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <div className="font-semibold">High throughput</div>
                  <div className="text-sm text-muted-foreground">400,000+ TPS capacity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "getting-started",
      title: "Ready to Get Started?",
      description: "Connect your wallet and create your first stream",
      icon: Wallet,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">You're All Set!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Ready to experience the future of payments with ChronoFlow
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Wallet className="w-5 h-5 text-primary" />
                <span className="font-semibold">Connect Wallet</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Connect your Web3 wallet to start using ChronoFlow
              </p>
              <Button size="sm" className="w-full" disabled>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="font-semibold">Create Stream</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Set up your first payment stream in minutes
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <DollarSign className="w-4 h-4 mr-2" />
                Try Demo
              </Button>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20">
            <div className="flex items-center space-x-3 mb-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-semibold">Learn More</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Explore our documentation and tutorials to master ChronoFlow
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                Documentation
              </Button>
              <Button size="sm" variant="outline">
                Video Tutorials
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStepData.id]);
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipToEnd = () => {
    onSkip();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                Step {currentStep + 1} of {steps.length}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Getting Started with ChronoFlow
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={skipToEnd}>
              Skip Tour
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepData.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="mb-8">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <currentStepData.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                <p className="text-muted-foreground">{currentStepData.description}</p>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                {currentStepData.content}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-primary'
                    : completedSteps.includes(step.id)
                    ? 'bg-primary/60'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button onClick={nextStep}>
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}