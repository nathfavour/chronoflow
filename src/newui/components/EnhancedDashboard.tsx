import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { EnhancedStreamCard } from "./EnhancedStreamCard";
import { RealTimeTransactionFeed } from "./RealTimeTransactionFeed";
import { QuickActionToolbar } from "./QuickActionToolbar";
import { PortfolioSecurityScore } from "./PortfolioSecurityScore";
import { Progress } from "./ui/progress";
import { 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Eye,
  Settings,
  MoreHorizontal,
  Play,
  Pause,
  Square
} from "lucide-react";
import { motion, useInView, useAnimation } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock data for demonstration
const mockStreams = [
  {
    id: "stream_001",
    title: "Software Developer Salary",
    description: "Monthly salary stream for Q4 2024",
    totalAmount: 120000,
    streamedAmount: 45000,
    recipientAddress: "0x742d35cc6bf4532c96582bcd6181ea71654f6f46",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    status: "active" as const,
    tokenSymbol: "USDC",
    nftImage: "placeholder",
    streamRate: 12.5 // per hour
  },
  {
    id: "stream_002", 
    title: "Marketing Consultant",
    description: "Bi-weekly payment for campaign management",
    totalAmount: 25000,
    streamedAmount: 18750,
    recipientAddress: "0x8ba1f109551bd432803012645hac136c",
    startDate: "2024-09-15",
    endDate: "2024-11-15",
    status: "active" as const,
    tokenSymbol: "DAI",
    nftImage: "placeholder",
    streamRate: 8.3
  },
  {
    id: "stream_003",
    title: "Token Vesting Schedule",
    description: "Founder token unlock over 2 years",
    totalAmount: 1000000,
    streamedAmount: 1000000,
    recipientAddress: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    startDate: "2023-01-01",
    endDate: "2024-12-31",
    status: "completed" as const,
    tokenSymbol: "TOKEN",
    nftImage: "placeholder",
    streamRate: 0
  },
  {
    id: "stream_004",
    title: "Subscription Service",
    description: "Monthly subscription payments",
    totalAmount: 600,
    streamedAmount: 200,
    recipientAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    startDate: "2024-11-01",
    endDate: "2025-01-01",
    status: "paused" as const,
    tokenSymbol: "USDT",
    nftImage: "placeholder",
    streamRate: 0
  }
];

// Mock chart data
const streamingData = [
  { time: "00:00", value: 2400, streams: 12 },
  { time: "04:00", value: 1398, streams: 11 },
  { time: "08:00", value: 9800, streams: 15 },
  { time: "12:00", value: 3908, streams: 14 },
  { time: "16:00", value: 4800, streams: 16 },
  { time: "20:00", value: 3800, streams: 13 },
  { time: "24:00", value: 4300, streams: 12 }
];

const tokenDistribution = [
  { name: "USDC", value: 45, color: "#3b82f6" },
  { name: "DAI", value: 30, color: "#8b5cf6" },
  { name: "ETH", value: 15, color: "#06b6d4" },
  { name: "USDT", value: 10, color: "#10b981" }
];

// Animated counter component
const AnimatedCounter = ({ end, duration = 2, prefix = "", suffix = "" }: { 
  end: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string; 
}) => {
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

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Real-time streaming indicator
const StreamingIndicator = ({ isActive, rate }: { isActive: boolean; rate: number }) => (
  <div className="flex items-center space-x-2">
    <motion.div
      className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}
      animate={isActive ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <span className="text-xs text-muted-foreground">
      {isActive ? `${rate}/hr` : 'Paused'}
    </span>
  </div>
);

interface EnhancedDashboardProps {
  onViewAnalytics?: () => void;
}

export function EnhancedDashboard({ onViewAnalytics }: EnhancedDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [realtimeData, setRealtimeData] = useState(streamingData);
  const [selectedStreamId, setSelectedStreamId] = useState<string | undefined>();
  const controls = useAnimation();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => prev.map(item => ({
        ...item,
        value: item.value + Math.random() * 100 - 50
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalStreaming = mockStreams
    .filter(s => s.status === "active")
    .reduce((acc, stream) => acc + (stream.totalAmount - stream.streamedAmount), 0);

  const totalStreamed = mockStreams
    .reduce((acc, stream) => acc + stream.streamedAmount, 0);

  const activeStreams = mockStreams.filter(s => s.status === "active").length;
  const totalStreamRate = mockStreams
    .filter(s => s.status === "active")
    .reduce((acc, stream) => acc + stream.streamRate, 0);

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 lg:pb-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <motion.div
          className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full"
          animate={{
            x: [0, 200, 400, 600],
            y: [0, -50, -100, -150],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl mb-2 bg-gradient-to-r from-foreground to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Manage your ChronoFlow streams and NFTs</span>
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4" />
              <span>Create Stream</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Real-time streaming stats */}
        <motion.div
          className="mb-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-3 h-3 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h3 className="text-lg font-semibold">Live Streaming Activity</h3>
            </div>
            <div className="text-sm text-muted-foreground">
              ${totalStreamRate.toFixed(2)}/hour across {activeStreams} streams
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                <AnimatedCounter end={Math.floor(totalStreamRate * 24)} prefix="$" suffix="/day" />
              </div>
              <div className="text-sm text-muted-foreground">Daily Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                <AnimatedCounter end={activeStreams} />
              </div>
              <div className="text-sm text-muted-foreground">Active Streams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                <AnimatedCounter end={Math.floor((totalStreamed / 1000000) * 100)} suffix="%" />
              </div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            {
              title: "Total Streaming",
              value: totalStreaming,
              icon: TrendingUp,
              change: "+12.5%",
              color: "blue",
              prefix: "$"
            },
            {
              title: "Total Streamed",
              value: totalStreamed,
              icon: DollarSign,
              change: "Lifetime",
              color: "green",
              prefix: "$"
            },
            {
              title: "Active Streams",
              value: activeStreams,
              icon: Clock,
              change: "Running",
              color: "purple",
              prefix: ""
            },
            {
              title: "Stream NFTs",
              value: mockStreams.length,
              icon: Users,
              change: "Tradeable",
              color: "cyan",
              prefix: ""
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="group"
              >
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <motion.div
                      className={`h-8 w-8 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center group-hover:bg-${stat.color}-500/20 transition-colors`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className={`h-4 w-4 text-${stat.color}-500`} />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">
                      <AnimatedCounter 
                        end={stat.value} 
                        prefix={stat.prefix}
                        duration={1.5 + index * 0.2}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      {index === 0 && <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />}
                      {stat.change}
                    </p>
                  </CardContent>
                  
                  {/* Animated gradient border */}
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{
                      background: `conic-gradient(from 0deg, transparent, ${
                        stat.color === 'blue' ? '#3b82f6' : 
                        stat.color === 'green' ? '#10b981' :
                        stat.color === 'purple' ? '#8b5cf6' : '#06b6d4'
                      }20, transparent)`,
                      padding: '1px',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-full h-full bg-background rounded-lg" />
                  </motion.div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts and Side Panels Section */}
        <motion.div 
          className="grid lg:grid-cols-12 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Main Charts */}
          <div className="lg:col-span-8 space-y-6">
            {/* Streaming Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>24h Streaming Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={realtimeData}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fill="url(#colorGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Token Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  <span>Token Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={tokenDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {tokenDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {tokenDistribution.map((token, index) => (
                      <div key={token.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: token.color }}
                          />
                          <span>{token.name}</span>
                        </div>
                        <span className="font-medium">{token.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panels */}
          <div className="lg:col-span-4 space-y-6">
            {/* Portfolio Security Score */}
            <PortfolioSecurityScore />
            
            {/* Real-Time Transaction Feed */}
            <RealTimeTransactionFeed />
          </div>
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                Active ({activeStreams})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                Completed
              </TabsTrigger>
              <TabsTrigger value="nfts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                My NFTs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockStreams.map((stream, index) => (
                  <motion.div
                    key={stream.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={() => setSelectedStreamId(stream.id)}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedStreamId === stream.id 
                        ? "ring-2 ring-primary/50 scale-105" 
                        : "hover:scale-102"
                    }`}
                  >
                    <EnhancedStreamCard {...stream} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockStreams
                  .filter((stream) => stream.status === "active")
                  .map((stream, index) => (
                    <motion.div
                      key={stream.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      onClick={() => setSelectedStreamId(stream.id)}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedStreamId === stream.id 
                          ? "ring-2 ring-primary/50 scale-105" 
                          : "hover:scale-102"
                      }`}
                    >
                      <EnhancedStreamCard {...stream} />
                    </motion.div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockStreams
                  .filter((stream) => stream.status === "completed")
                  .map((stream, index) => (
                    <motion.div
                      key={stream.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      onClick={() => setSelectedStreamId(stream.id)}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedStreamId === stream.id 
                          ? "ring-2 ring-primary/50 scale-105" 
                          : "hover:scale-102"
                      }`}
                    >
                      <EnhancedStreamCard {...stream} />
                    </motion.div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="nfts" className="mt-6">
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="w-8 h-8 text-blue-500" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">NFT Marketplace</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Trade your stream NFTs, discover new investment opportunities, 
                  and unlock liquidity from your cash flows.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Eye className="w-4 h-4 mr-2" />
                    Explore Marketplace
                  </Button>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Action Toolbar */}
        <QuickActionToolbar
          selectedStreamId={selectedStreamId}
          onCreateStream={() => console.log("Navigate to create stream")}
          onPauseStream={(id) => console.log("Pause stream:", id)}
          onResumeStream={(id) => console.log("Resume stream:", id)}
          onStopStream={(id) => console.log("Stop stream:", id)}
          onListNFT={(id) => console.log("List NFT for stream:", id)}
          onWithdraw={() => console.log("Withdraw available balance")}
        />
      </div>
    </div>
  );
}