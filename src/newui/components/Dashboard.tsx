"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { StreamCard } from "./StreamCard";
import { Plus, TrendingUp, DollarSign, Users, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

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
    nftImage: "placeholder"
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
    nftImage: "placeholder"
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
    nftImage: "placeholder"
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
    nftImage: "placeholder"
  }
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const totalStreaming = mockStreams
    .filter(s => s.status === "active")
    .reduce((acc, stream) => acc + (stream.totalAmount - stream.streamedAmount), 0);

  const totalStreamed = mockStreams
    .reduce((acc, stream) => acc + stream.streamedAmount, 0);

  const activeStreams = mockStreams.filter(s => s.status === "active").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-8 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your ChronoFlow streams and NFTs
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button className="flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/80">
              <Plus className="w-4 h-4" />
              <span>Create Stream</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            {
              title: "Total Streaming",
              value: `$${totalStreaming.toLocaleString()}`,
              change: "+12.5% from last month",
              icon: TrendingUp,
              color: "text-green-500"
            },
            {
              title: "Total Streamed",
              value: `$${totalStreamed.toLocaleString()}`,
              change: "Lifetime earnings",
              icon: DollarSign,
              color: "text-blue-500"
            },
            {
              title: "Active Streams",
              value: activeStreams.toString(),
              change: "Currently running",
              icon: Clock,
              color: "text-purple-500"
            },
            {
              title: "Stream NFTs",
              value: mockStreams.length.toString(),
              change: "Tradeable assets",
              icon: Users,
              color: "text-orange-500"
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="relative overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      {stat.change}
                      {stat.change.includes("+") && (
                        <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
                      )}
                    </p>
                  </CardContent>
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                Overview
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                Active
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                Completed
              </TabsTrigger>
              <TabsTrigger value="nfts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                My NFTs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {mockStreams.map((stream, index) => (
                  <motion.div
                    key={stream.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <StreamCard {...stream} />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {mockStreams
                  .filter((stream) => stream.status === "active")
                  .map((stream, index) => (
                    <motion.div
                      key={stream.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <StreamCard {...stream} />
                    </motion.div>
                  ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {mockStreams
                  .filter((stream) => stream.status === "completed")
                  .map((stream, index) => (
                    <motion.div
                      key={stream.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <StreamCard {...stream} />
                    </motion.div>
                  ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="nfts" className="mt-6">
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Users className="w-8 h-8 text-primary" />
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
                  <Button className="shadow-lg hover:shadow-xl transition-all duration-300">
                    Explore Marketplace
                  </Button>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}