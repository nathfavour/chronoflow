import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { 
  Calendar, 
  DollarSign, 
  User, 
  Clock, 
  ExternalLink, 
  Play, 
  Pause, 
  Eye,
  TrendingUp,
  Zap,
  MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface EnhancedStreamCardProps {
  id: string;
  title: string;
  description: string;
  totalAmount: number;
  streamedAmount: number;
  recipientAddress: string;
  startDate: string;
  endDate: string;
  status: "active" | "paused" | "completed";
  tokenSymbol: string;
  nftImage?: string;
  streamRate?: number;
}

export function EnhancedStreamCard({
  id,
  title,
  description,
  totalAmount,
  streamedAmount,
  recipientAddress,
  startDate,
  endDate,
  status,
  tokenSymbol,
  nftImage,
  streamRate = 0
}: EnhancedStreamCardProps) {
  const [currentStreamed, setCurrentStreamed] = useState(streamedAmount);
  const [isHovered, setIsHovered] = useState(false);
  
  const progress = (currentStreamed / totalAmount) * 100;
  const remainingAmount = totalAmount - currentStreamed;

  // Simulate real-time streaming for active streams
  useEffect(() => {
    if (status === "active" && streamRate > 0) {
      const interval = setInterval(() => {
        setCurrentStreamed(prev => {
          const increment = streamRate / 3600; // per second
          return Math.min(prev + increment, totalAmount);
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status, streamRate, totalAmount]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "bg-green-500/20 text-green-500 border-green-500/20",
          icon: Play,
          gradient: "from-green-500/10 to-green-600/5"
        };
      case "paused":
        return {
          color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
          icon: Pause,
          gradient: "from-yellow-500/10 to-yellow-600/5"
        };
      case "completed":
        return {
          color: "bg-blue-500/20 text-blue-500 border-blue-500/20",
          icon: TrendingUp,
          gradient: "from-blue-500/10 to-blue-600/5"
        };
      default:
        return {
          color: "bg-gray-500/20 text-gray-500 border-gray-500/20",
          icon: Clock,
          gradient: "from-gray-500/10 to-gray-600/5"
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      className="group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${statusConfig.gradient} hover:shadow-xl transition-all duration-500 backdrop-blur-sm`}>
        {/* Animated border on hover */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${
              status === 'active' ? '#10b981' : 
              status === 'paused' ? '#f59e0b' : '#3b82f6'
            }20, transparent)`,
            padding: '1px',
          }}
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 2, ease: "linear" }}
        >
          <div className="w-full h-full bg-background rounded-lg" />
        </motion.div>

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className="text-lg">{title}</CardTitle>
                {status === "active" && (
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${statusConfig.color} flex items-center space-x-1`}>
                <StatusIcon className="w-3 h-3" />
                <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              </Badge>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* Enhanced NFT Preview */}
          <motion.div 
            className="relative w-full h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-lg flex items-center justify-center overflow-hidden group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-cyan-500/20 transition-all duration-500"
            whileHover={{ scale: 1.02 }}
          >
            {/* Floating particles effect */}
            {status === "active" && (
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, -40],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.5,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}
            
            <div className="text-center relative z-10">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-white font-bold">#{id.slice(-3)}</span>
              </motion.div>
              <p className="text-xs text-muted-foreground">Stream NFT</p>
              {status === "active" && streamRate > 0 && (
                <motion.div 
                  className="flex items-center justify-center space-x-1 mt-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600">${streamRate.toFixed(2)}/hr</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Enhanced Stream Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Stream Progress</span>
              <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3" />
              {status === "active" && (
                <motion.div
                  className="absolute top-0 left-0 h-3 w-2 bg-blue-500 rounded-full opacity-80"
                  style={{ left: `${progress}%` }}
                  animate={{ x: [-4, 4, -4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {remainingAmount > 0 
                ? `${remainingAmount.toLocaleString()} ${tokenSymbol} remaining`
                : "Stream completed"
              }
            </div>
          </div>

          {/* Enhanced Amount Information */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="space-y-1 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3 text-green-500" />
                <span className="text-xs text-muted-foreground">Streamed</span>
              </div>
              <p className="font-medium text-sm">
                {Math.floor(currentStreamed).toLocaleString()} {tokenSymbol}
              </p>
            </motion.div>
            <motion.div 
              className="space-y-1 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-muted-foreground">Remaining</span>
              </div>
              <p className="font-medium text-sm">
                {Math.floor(remainingAmount).toLocaleString()} {tokenSymbol}
              </p>
            </motion.div>
          </div>

          {/* Compact Info Grid */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Recipient</span>
              </div>
              <span className="font-mono bg-muted/50 px-2 py-1 rounded">
                {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Duration</span>
              </div>
              <span>
                {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Enhanced Actions */}
          <div className="flex space-x-2 pt-2">
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" size="sm" className="w-full bg-background/50 hover:bg-background/80">
                <Eye className="w-3 h-3 mr-1" />
                Details
              </Button>
            </motion.div>
            {status === "active" && (
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trade NFT
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>

        {/* Background gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ borderRadius: 'inherit' }}
        />
      </Card>
    </motion.div>
  );
}