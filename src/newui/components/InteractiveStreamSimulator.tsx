import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { motion } from "framer-motion";
import { DollarSign, Clock, Zap, TrendingUp, Calculator } from "lucide-react";

const TOKENS = [
  { symbol: "USDC", name: "USD Coin", rate: 1.00 },
  { symbol: "ETH", name: "Ethereum", rate: 2400.00 },
  { symbol: "DAI", name: "Dai Stablecoin", rate: 1.00 },
  { symbol: "USDT", name: "Tether USD", rate: 1.00 }
];

const PRESETS = [
  { name: "Monthly Salary", amount: 8000, duration: 30, token: "USDC" },
  { name: "Quarterly Bonus", amount: 15000, duration: 90, token: "USDC" },
  { name: "Token Vesting", amount: 50000, duration: 365, token: "ETH" },
  { name: "Freelance Project", amount: 5000, duration: 14, token: "DAI" }
];

export function InteractiveStreamSimulator() {
  const [amount, setAmount] = useState(8000);
  const [duration, setDuration] = useState([30]);
  const [selectedToken, setSelectedToken] = useState("USDC");
  const [currentStreamed, setCurrentStreamed] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const selectedTokenData = TOKENS.find(t => t.symbol === selectedToken) || TOKENS[0];
  const totalSeconds = duration[0] * 24 * 60 * 60;
  const perSecondRate = amount / totalSeconds;
  const perMinuteRate = perSecondRate * 60;
  const perHourRate = perSecondRate * 3600;
  const perDayRate = amount / duration[0];

  // Real-time simulation
  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        setCurrentStreamed(prev => {
          const newValue = prev + (perSecondRate * 1); // 1 second intervals
          if (newValue >= amount) {
            setIsSimulating(false);
            return amount;
          }
          return newValue;
        });
      }, 100); // Update every 100ms for smooth animation

      return () => clearInterval(interval);
    }
  }, [isSimulating, perSecondRate, amount]);

  const handlePreset = (preset: typeof PRESETS[0]) => {
    setAmount(preset.amount);
    setDuration([preset.duration]);
    setSelectedToken(preset.token);
    setCurrentStreamed(0);
    setIsSimulating(false);
  };

  const startSimulation = () => {
    setCurrentStreamed(0);
    setIsSimulating(true);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setCurrentStreamed(0);
    setIsSimulating(false);
  };

  const progressPercentage = (currentStreamed / amount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full max-w-6xl mx-auto"
    >
      <Card className="overflow-hidden bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <Calculator className="w-6 h-6 text-blue-500" />
            <span>Interactive Stream Calculator</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Experience real-time value streaming with live calculations and simulation
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Quick Presets */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quick Presets</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset(preset)}
                  className="text-xs h-auto py-2 px-3"
                >
                  <div className="text-center">
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-muted-foreground">{preset.amount} {preset.token}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Controls */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Stream Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="pl-10"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="token">Token</Label>
                  <Select value={selectedToken} onValueChange={setSelectedToken}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TOKENS.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center space-x-2">
                            <span>{token.symbol}</span>
                            <span className="text-muted-foreground text-sm">- {token.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (Days): {duration[0]}</Label>
                  <div className="mt-2">
                    <Slider
                      value={duration}
                      onValueChange={setDuration}
                      max={365}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 day</span>
                      <span>1 year</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Controls */}
              <div className="flex space-x-2">
                <Button 
                  onClick={startSimulation} 
                  disabled={isSimulating}
                  className="flex-1"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isSimulating ? "Streaming..." : "Start Stream"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={stopSimulation}
                  disabled={!isSimulating}
                >
                  Pause
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetSimulation}
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Live Visualization */}
            <div className="space-y-6">
              {/* Streaming Progress */}
              <motion.div
                className="relative h-32 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 border border-blue-500/30 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Animated flow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30"
                  style={{ width: `${progressPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />

                {/* Floating particles during simulation */}
                {isSimulating && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400 rounded-full"
                        style={{
                          top: `${30 + i * 20}%`,
                          left: "5%",
                        }}
                        animate={{
                          x: [0, 250, 500],
                          opacity: [0, 1, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "linear",
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Progress indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      ${currentStreamed.toFixed(2)} {selectedToken}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {progressPercentage.toFixed(1)}% Streamed
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Rate Calculations */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="p-4 rounded-lg bg-background/50 border border-border/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Per Second</span>
                  </div>
                  <div className="font-bold">${perSecondRate.toFixed(6)}</div>
                </motion.div>

                <motion.div
                  className="p-4 rounded-lg bg-background/50 border border-border/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Per Hour</span>
                  </div>
                  <div className="font-bold">${perHourRate.toFixed(2)}</div>
                </motion.div>

                <motion.div
                  className="p-4 rounded-lg bg-background/50 border border-border/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">Per Day</span>
                  </div>
                  <div className="font-bold">${perDayRate.toFixed(2)}</div>
                </motion.div>

                <motion.div
                  className="p-4 rounded-lg bg-background/50 border border-border/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Remaining</span>
                  </div>
                  <div className="font-bold">${(amount - currentStreamed).toFixed(2)}</div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <motion.div
            className="p-4 rounded-lg bg-muted/50 border border-border/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="font-semibold mb-2">Stream Summary</h4>
            <div className="text-sm text-muted-foreground">
              Streaming <span className="font-medium text-foreground">${amount} {selectedToken}</span> over{" "}
              <span className="font-medium text-foreground">{duration[0]} days</span> at{" "}
              <span className="font-medium text-foreground">${perSecondRate.toFixed(6)}/second</span>.
              {isSimulating && (
                <span className="text-green-600 font-medium"> Currently streaming live!</span>
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}