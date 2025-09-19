import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Zap, Clock, DollarSign, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface NetworkStats {
  tps: number;
  gasPrice: number;
  blockTime: number;
  uptime: number;
}

export function SomniaNetworkBadge() {
  const [stats, setStats] = useState<NetworkStats>({
    tps: 12840,
    gasPrice: 0.002,
    blockTime: 0.4,
    uptime: 99.97
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        tps: prev.tps + Math.floor(Math.random() * 200) - 100,
        gasPrice: Math.max(0.001, prev.gasPrice + (Math.random() * 0.002) - 0.001),
        blockTime: Math.max(0.1, prev.blockTime + (Math.random() * 0.2) - 0.1),
        uptime: Math.max(99.5, Math.min(100, prev.uptime + (Math.random() * 0.1) - 0.05))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Powered by Somnia Network</h3>
                <p className="text-sm text-muted-foreground">Ultra-fast, low-cost streaming infrastructure</p>
              </div>
              <motion.div
                className="w-3 h-3 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              className="text-center p-3 rounded-lg bg-background/50"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                <Activity className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-xs text-muted-foreground">TPS</span>
              </div>
              <div className="text-lg font-bold text-blue-500">
                {stats.tps.toLocaleString()}
              </div>
            </motion.div>

            <motion.div
              className="text-center p-3 rounded-lg bg-background/50"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-muted-foreground">Gas</span>
              </div>
              <div className="text-lg font-bold text-green-500">
                ${stats.gasPrice.toFixed(3)}
              </div>
            </motion.div>

            <motion.div
              className="text-center p-3 rounded-lg bg-background/50"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-xs text-muted-foreground">Block Time</span>
              </div>
              <div className="text-lg font-bold text-purple-500">
                {stats.blockTime.toFixed(1)}s
              </div>
            </motion.div>

            <motion.div
              className="text-center p-3 rounded-lg bg-background/50"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-1" />
                <span className="text-xs text-muted-foreground">Uptime</span>
              </div>
              <div className="text-lg font-bold text-green-500">
                {stats.uptime.toFixed(2)}%
              </div>
            </motion.div>
          </div>

          <div className="mt-4 text-center">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-600 border-blue-500/20">
              Sub-second finality • Enterprise-grade reliability
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}