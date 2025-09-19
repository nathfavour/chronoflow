import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Activity, ArrowUpRight, ArrowDownLeft, DollarSign, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
  id: string;
  type: "stream_payment" | "nft_trade" | "withdrawal" | "deposit";
  amount: number;
  token: string;
  from: string;
  to: string;
  gasUsed: number;
  gasCost: number;
  timestamp: Date;
  streamId?: string;
  nftId?: string;
}

const generateMockTransaction = (): Transaction => {
  const types: Transaction["type"][] = ["stream_payment", "nft_trade", "withdrawal", "deposit"];
  const tokens = ["USDC", "DAI", "ETH", "USDT"];
  const addresses = [
    "0x742d35cc6bf4532c96582bcd6181ea71654f6f46",
    "0x8ba1f109551bd432803012645hac136c",
    "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    "0x6b175474e89094c44da98b954eedeac495271d0f"
  ];

  return {
    id: Math.random().toString(36).substr(2, 9),
    type: types[Math.floor(Math.random() * types.length)],
    amount: Math.random() * 10000 + 100,
    token: tokens[Math.floor(Math.random() * tokens.length)],
    from: addresses[Math.floor(Math.random() * addresses.length)],
    to: addresses[Math.floor(Math.random() * addresses.length)],
    gasUsed: Math.floor(Math.random() * 50000) + 21000,
    gasCost: Math.random() * 0.01 + 0.001,
    timestamp: new Date(),
    streamId: Math.random() > 0.5 ? `stream_${Math.random().toString(36).substr(2, 6)}` : undefined,
    nftId: Math.random() > 0.7 ? `nft_${Math.random().toString(36).substr(2, 6)}` : undefined
  };
};

const getTransactionIcon = (type: Transaction["type"]) => {
  switch (type) {
    case "stream_payment":
      return <Activity className="w-4 h-4 text-blue-500" />;
    case "nft_trade":
      return <ArrowUpRight className="w-4 h-4 text-purple-500" />;
    case "withdrawal":
      return <ArrowUpRight className="w-4 h-4 text-red-500" />;
    case "deposit":
      return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
  }
};

const getTransactionColor = (type: Transaction["type"]) => {
  switch (type) {
    case "stream_payment":
      return "bg-blue-500/20 text-blue-600 border-blue-500/20";
    case "nft_trade":
      return "bg-purple-500/20 text-purple-600 border-purple-500/20";
    case "withdrawal":
      return "bg-red-500/20 text-red-600 border-red-500/20";
    case "deposit":
      return "bg-green-500/20 text-green-600 border-green-500/20";
  }
};

const formatTransactionType = (type: Transaction["type"]) => {
  switch (type) {
    case "stream_payment":
      return "Stream Payment";
    case "nft_trade":
      return "NFT Trade";
    case "withdrawal":
      return "Withdrawal";
    case "deposit":
      return "Deposit";
  }
};

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function RealTimeTransactionFeed() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Initialize with some transactions
    const initialTransactions = Array.from({ length: 5 }, generateMockTransaction);
    setTransactions(initialTransactions);

    // Add new transactions periodically
    const interval = setInterval(() => {
      if (isLive) {
        setTransactions(prev => {
          const newTransaction = generateMockTransaction();
          return [newTransaction, ...prev.slice(0, 19)]; // Keep only 20 transactions
        });
      }
    }, 3000 + Math.random() * 4000); // Random interval between 3-7 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const totalGasSaved = transactions.reduce((acc, tx) => acc + (0.05 - tx.gasCost), 0);
  const avgBlockTime = 0.4; // Somnia's average block time

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>Live Transaction Feed</span>
          </div>
          <Badge className="bg-green-500/20 text-green-600 border-green-500/20">
            Somnia Network
          </Badge>
        </CardTitle>
        
        {/* Network Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <DollarSign className="w-3 h-3 text-green-500" />
              <span className="text-xs text-muted-foreground">Gas Saved</span>
            </div>
            <div className="text-sm font-bold text-green-600">
              ${totalGasSaved.toFixed(4)}
            </div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-muted-foreground">Block Time</span>
            </div>
            <div className="text-sm font-bold text-blue-600">
              {avgBlockTime}s
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-80">
          <AnimatePresence>
            {transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`p-3 rounded-lg border mb-2 hover:shadow-sm transition-shadow ${
                  index === 0 ? "bg-primary/5 border-primary/20" : "bg-background border-border/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getTransactionIcon(tx.type)}
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getTransactionColor(tx.type)}`}
                    >
                      {formatTransactionType(tx.type)}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tx.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {tx.amount.toFixed(2)} {tx.token}
                    </span>
                    <span className="text-xs text-green-600">
                      ${tx.gasCost.toFixed(4)} gas
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {formatAddress(tx.from)} → {formatAddress(tx.to)}
                  </div>
                  
                  {tx.streamId && (
                    <div className="text-xs text-blue-600">
                      Stream: {tx.streamId}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>

        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Real-time Somnia transactions</span>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                isLive 
                  ? "bg-green-500/20 text-green-600" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {isLive ? "Live" : "Paused"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}