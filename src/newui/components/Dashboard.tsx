import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { StreamCard } from "./StreamCard";
import { Plus, TrendingUp, DollarSign, Users, Clock } from "lucide-react";

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
    <div className="min-h-screen bg-background pt-8 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your ChronoFlow streams and NFTs
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Stream</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Streaming</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalStreaming.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Streamed</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalStreamed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Streams</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStreams}</div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stream NFTs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStreams.length}</div>
              <p className="text-xs text-muted-foreground">
                Tradeable assets
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="nfts">My NFTs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockStreams.map((stream) => (
                <StreamCard key={stream.id} {...stream} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockStreams
                .filter((stream) => stream.status === "active")
                .map((stream) => (
                  <StreamCard key={stream.id} {...stream} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockStreams
                .filter((stream) => stream.status === "completed")
                .map((stream) => (
                  <StreamCard key={stream.id} {...stream} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="nfts" className="mt-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">NFT Marketplace</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Trade your stream NFTs, discover new investment opportunities, 
                and unlock liquidity from your cash flows.
              </p>
              <Button>
                Explore Marketplace
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}