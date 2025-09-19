import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Users,
  Activity,
  Target,
  Zap,
  Share,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell
} from "recharts";
import { motion } from "framer-motion";

// Mock stream data
const streamData = {
  id: "nft_001",
  title: "Senior Dev Salary Stream",
  description: "6-month salary stream for senior developer position",
  currentPrice: 45.5,
  originalValue: 60000,
  streamedValue: 22500,
  remainingValue: 37500,
  duration: "4 months remaining",
  yield: "8.2",
  status: "active",
  created: "2024-01-15",
  recipient: "0x742d35cc6bf4532c96582bcd6181ea71654f6f46",
  tokenSymbol: "USDC"
};

const streamingData = [
  { date: "Jan 1", streamed: 0, remaining: 60000, rate: 0 },
  { date: "Jan 15", streamed: 7500, remaining: 52500, rate: 500 },
  { date: "Feb 1", streamed: 15000, remaining: 45000, rate: 500 },
  { date: "Feb 15", streamed: 22500, remaining: 37500, rate: 500 },
  { date: "Mar 1", streamed: 30000, remaining: 30000, rate: 500 },
  { date: "Mar 15", streamed: 37500, remaining: 22500, rate: 500 }
];

const priceHistory = [
  { date: "Jan", price: 50.2, volume: 12 },
  { date: "Feb", price: 48.1, volume: 18 },
  { date: "Mar", price: 46.8, volume: 25 },
  { date: "Apr", price: 45.5, volume: 31 }
];

const viewershipData = [
  { date: "Week 1", views: 156, watchers: 23 },
  { date: "Week 2", views: 234, watchers: 45 },
  { date: "Week 3", views: 189, watchers: 67 },
  { date: "Week 4", views: 298, watchers: 89 }
];

const riskMetrics = [
  { name: "Smart Contract", value: 95, color: "#10b981" },
  { name: "Counterparty", value: 87, color: "#3b82f6" },
  { name: "Liquidity", value: 78, color: "#f59e0b" },
  { name: "Market", value: 82, color: "#8b5cf6" }
];

interface StreamAnalyticsProps {
  onBack: () => void;
}

export function StreamAnalytics({ onBack }: StreamAnalyticsProps) {
  const [timeframe, setTimeframe] = useState("30d");

  const completionPercentage = (streamData.streamedValue / streamData.originalValue) * 100;
  const dailyRate = streamData.streamedValue / 75; // Assuming 75 days elapsed
  const projectedCompletion = new Date(Date.now() + (streamData.remainingValue / dailyRate) * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{streamData.title}</h1>
                <p className="text-muted-foreground">
                  Comprehensive analytics and performance metrics
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                  <SelectItem value="1y">1 year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Status Banner */}
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-green-500/20 text-green-600 border-green-500/20">
                    <Activity className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Completion: </span>
                    <span className="font-semibold">{completionPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Daily Rate: </span>
                    <span className="font-semibold">${dailyRate.toFixed(0)} {streamData.tokenSymbol}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Projected Completion</div>
                  <div className="font-semibold">{projectedCompletion.toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Total Streamed</span>
              </div>
              <div className="text-2xl font-bold">${streamData.streamedValue.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5% this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Current Yield</span>
              </div>
              <div className="text-2xl font-bold">{streamData.yield}%</div>
              <p className="text-xs text-blue-600">APY</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-muted-foreground">Watchers</span>
              </div>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-purple-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +23 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">Performance</span>
              </div>
              <div className="text-2xl font-bold">A+</div>
              <p className="text-xs text-orange-600">Risk Score</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analytics Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="streaming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="streaming">Streaming</TabsTrigger>
              <TabsTrigger value="trading">Trading</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>

            {/* Streaming Analytics */}
            <TabsContent value="streaming" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <LineChart className="w-5 h-5" />
                      <span>Streaming Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={streamingData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="streamed" 
                          stackId="1"
                          stroke="#10b981" 
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="remaining" 
                          stackId="1"
                          stroke="#e5e7eb" 
                          fill="#e5e7eb"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <span>Streaming Rate</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={streamingData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="rate" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Stream Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Stream Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Duration Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Duration:</span>
                          <span>6 months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Elapsed:</span>
                          <span>2.5 months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Remaining:</span>
                          <span>3.5 months</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Rate Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Per Second:</span>
                          <span>0.00925 {streamData.tokenSymbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Per Hour:</span>
                          <span>33.33 {streamData.tokenSymbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Per Day:</span>
                          <span>800 {streamData.tokenSymbol}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Performance</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">On Schedule:</span>
                          <Badge className="bg-green-500/20 text-green-600">Yes</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reliability:</span>
                          <span>99.98%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gas Efficiency:</span>
                          <Badge className="bg-blue-500/20 text-blue-600">Optimal</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trading Analytics */}
            <TabsContent value="trading" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Price History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsLineChart data={priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trading Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="volume" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Risk Analysis */}
            <TabsContent value="risk" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="w-5 h-5" />
                      <span>Risk Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Tooltip />
                        <RechartsPieChart data={riskMetrics}>
                          {riskMetrics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </RechartsPieChart>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {riskMetrics.map((metric) => (
                      <div key={metric.name} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{metric.name} Risk</span>
                          <span className="text-sm font-semibold">{metric.value}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${metric.value}%`,
                              backgroundColor: metric.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Engagement Analytics */}
            <TabsContent value="engagement" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Viewer Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={viewershipData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="watchers" stroke="#f59e0b" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}