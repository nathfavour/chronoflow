import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Eye, 
  ShoppingCart, 
  Heart,
  Star,
  ArrowUpDown,
  Users,
  Activity,
  Target,
  Layers
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
import { useWeb3 } from "@/web3/context";
import { ConnectButton } from "./ConnectButton";
import { toast } from "sonner";

// Enhanced mock marketplace data with more details
const mockNFTs = [
  {
    id: "nft_001",
    tokenId: 1,
    title: "Senior Dev Salary Stream",
    description: "6-month salary stream for senior developer position at TechCorp",
    currentPrice: 45.5,
    originalValue: 60000,
    streamedValue: 22500,
    remainingValue: 37500,
    duration: "4 months remaining",
    yield: "8.2",
    seller: "0x742d35cc6bf4532c96582bcd6181ea71654f6f46",
    sellerName: "TechCorp Inc.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
    status: "active",
    category: "salary",
    verified: true,
    totalViews: 1243,
    watchers: 89,
    bids: 12,
    created: "2024-01-15",
    riskLevel: "low",
    liquidity: "high",
    priceHistory: [
      { date: "Jan", price: 50.2 },
      { date: "Feb", price: 48.1 },
      { date: "Mar", price: 46.8 },
      { date: "Apr", price: 45.5 }
    ],
    streamData: [
      { month: "Jan", streamed: 10000, remaining: 50000 },
      { month: "Feb", streamed: 20000, remaining: 40000 },
      { month: "Mar", streamed: 30000, remaining: 30000 }
    ]
  },
  {
    id: "nft_002",
    tokenId: 2,
    title: "Token Vesting Plan",
    description: "Founder token unlock schedule with performance milestones",
    currentPrice: 125.0,
    originalValue: 500000,
    streamedValue: 125000,
    remainingValue: 375000,
    duration: "18 months remaining",
    yield: "12.5",
    seller: "0x8ba1f109551bd432803012645hac136c",
    sellerName: "DeFi Innovations",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
    status: "active",
    category: "vesting",
    verified: true,
    totalViews: 2156,
    watchers: 234,
    bids: 28,
    created: "2024-01-10",
    riskLevel: "medium",
    liquidity: "medium",
    priceHistory: [
      { date: "Jan", price: 120.0 },
      { date: "Feb", price: 122.5 },
      { date: "Mar", price: 124.2 },
      { date: "Apr", price: 125.0 }
    ],
    streamData: [
      { month: "Jan", streamed: 50000, remaining: 400000 },
      { month: "Feb", streamed: 100000, remaining: 350000 },
      { month: "Mar", streamed: 125000, remaining: 375000 }
    ]
  },
  {
    id: "nft_003",
    tokenId: 3,
    title: "Marketing Retainer",
    description: "Monthly marketing consultant payments for Q2 campaign",
    currentPrice: 8.75,
    originalValue: 15000,
    streamedValue: 7500,
    remainingValue: 7500,
    duration: "2 months remaining",
    yield: "6.8",
    seller: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    sellerName: "GrowthLab",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    status: "active",
    category: "consulting",
    verified: false,
    totalViews: 687,
    watchers: 45,
    bids: 7,
    created: "2024-02-01",
    riskLevel: "medium",
    liquidity: "low",
    priceHistory: [
      { date: "Feb", price: 10.0 },
      { date: "Mar", price: 9.2 },
      { date: "Apr", price: 8.75 }
    ],
    streamData: [
      { month: "Feb", streamed: 2500, remaining: 12500 },
      { month: "Mar", streamed: 5000, remaining: 10000 },
      { month: "Apr", streamed: 7500, remaining: 7500 }
    ]
  }
];

const categories = [
  { id: "all", name: "All Categories", count: mockNFTs.length },
  { id: "salary", name: "Salary", count: mockNFTs.filter(n => n.category === "salary").length },
  { id: "vesting", name: "Token Vesting", count: mockNFTs.filter(n => n.category === "vesting").length },
  { id: "consulting", name: "Consulting", count: mockNFTs.filter(n => n.category === "consulting").length },
  { id: "revenue", name: "Revenue Share", count: mockNFTs.filter(n => n.category === "revenue").length },
  { id: "freelance", name: "Freelance", count: mockNFTs.filter(n => n.category === "freelance").length }
];

function ethToWei(amount: string): bigint {
  const sanitized = amount.trim();
  if (!/^\d*(\.\d*)?$/.test(sanitized)) throw new Error("Invalid ETH amount");
  const [wholeRaw, fracRaw = ""] = sanitized.split(".");
  const whole = wholeRaw === "" ? "0" : wholeRaw;
  const fracPadded = (fracRaw + "0".repeat(18)).slice(0, 18); // 18 decimals
  return BigInt(whole) * 10n ** 18n + BigInt(fracPadded || "0");
}

function shorten(hash?: string) {
  if (!hash) return "";
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export function EnhancedMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price-low");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedNFT, setSelectedNFT] = useState<typeof mockNFTs[0] | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [tokenIdInput, setTokenIdInput] = useState("");
  const [priceEthInput, setPriceEthInput] = useState("");

  const { address, listNFT, buyNFT, tx, fetchListing } = useWeb3();
  const [fetchedListing, setFetchedListing] = useState<{ seller: string; price: bigint } | null | undefined>(undefined);
  const [fetchingListing, setFetchingListing] = useState(false);

  const filteredNFTs = mockNFTs
    .filter(nft => 
      nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(nft => selectedCategory === "all" || nft.category === selectedCategory)
    .filter(nft => nft.currentPrice >= priceRange[0] && nft.currentPrice <= priceRange[1])
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.currentPrice - b.currentPrice;
        case "price-high":
          return b.currentPrice - a.currentPrice;
        case "yield-high":
          return parseFloat(b.yield) - parseFloat(a.yield);
        case "duration":
          return a.duration.localeCompare(b.duration);
        case "popular":
          return b.totalViews - a.totalViews;
        default:
          return 0;
      }
    });

  const toggleFavorite = (nftId: string) => {
    setFavorites(prev => 
      prev.includes(nftId) 
        ? prev.filter(id => id !== nftId)
        : [...prev, nftId]
    );
  };

  const marketStats = {
    totalVolume: mockNFTs.reduce((acc, nft) => acc + nft.currentPrice, 0),
    avgYield: mockNFTs.reduce((acc, nft) => acc + parseFloat(nft.yield), 0) / mockNFTs.length,
    totalStreamed: mockNFTs.reduce((acc, nft) => acc + nft.streamedValue, 0),
    activeTrades: 156
  };

  async function handleList() {
    if (!address) { toast.error("Connect wallet first"); return; }
    if (!tokenIdInput) { toast.error("Token ID required"); return; }
    if (!priceEthInput) { toast.error("Price (ETH) required"); return; }
    let tokenId: bigint;
    try { tokenId = BigInt(tokenIdInput); } catch { toast.error("Invalid token ID"); return; }
    let priceWei: bigint;
    try { priceWei = ethToWei(priceEthInput); } catch (e: any) { toast.error(e.message); return; }
    try {
      await toast.promise(
        listNFT(tokenId, priceWei),
        { loading: "Listing NFT...", success: () => `Listed #${tokenId.toString()} at ${priceEthInput} ETH`, error: e => e?.message || "Listing failed" }
      );
    } catch (e) { /* already surfaced */ }
  }

  async function handleBuy() {
    if (!address) { toast.error("Connect wallet first"); return; }
    if (!tokenIdInput) { toast.error("Token ID required"); return; }
    if (!priceEthInput) { toast.error("Value (ETH) required"); return; }
    let tokenId: bigint;
    try { tokenId = BigInt(tokenIdInput); } catch { toast.error("Invalid token ID"); return; }
    let valueWei: bigint;
    try { valueWei = ethToWei(priceEthInput); } catch (e: any) { toast.error(e.message); return; }
    try {
      await toast.promise(
        buyNFT(tokenId, valueWei),
        { loading: "Buying NFT...", success: () => `Purchased token #${tokenId.toString()}`, error: e => e?.message || "Purchase failed" }
      );
    } catch (e) { /* already surfaced */ }
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Stream NFT Marketplace</h1>
              <p className="text-muted-foreground">
                Discover and trade ChronoFlow stream NFTs - liquid representations of cash flows
              </p>
            </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-600 border-blue-500/20">
                  <Activity className="w-3 h-3 mr-1" /> Live on Somnia
                </Badge>
                <ConnectButton size="sm" />
              </div>
          </div>
        </motion.div>

        {/* On-chain Actions Prototype */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>On-chain Actions (Prototype)</span>
                {tx.hash && (
                  <span className="text-xs font-mono text-muted-foreground">{shorten(tx.hash)}</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-6 gap-4 items-end">
              <div className="md:col-span-1 space-y-1">
                <label className="text-xs font-medium">Token ID</label>
                <Input
                  placeholder="e.g. 12"
                  value={tokenIdInput}
                  onChange={e => setTokenIdInput(e.target.value)}
                  disabled={tx.pending}
                />
              </div>
              <div className="md:col-span-1 space-y-1">
                <label className="text-xs font-medium">Price / Value (ETH)</label>
                <Input
                  placeholder="e.g. 1.5"
                  value={priceEthInput}
                  onChange={e => setPriceEthInput(e.target.value)}
                  disabled={tx.pending}
                />
              </div>
              <div className="md:col-span-1 space-y-1">
                <label className="text-xs font-medium">Listing Status</label>
                <div className="flex items-center space-x-2">
                  <Button type="button" variant="outline" size="sm" disabled={!tokenIdInput || fetchingListing} onClick={async () => {
                    if (!tokenIdInput) return;
                    let id: bigint;
                    setFetchingListing(true);
                    setFetchedListing(undefined);
                    try {
                      try { id = BigInt(tokenIdInput); } catch { toast.error("Bad token ID"); return; }
                      const res = await fetchListing(id);
                      setFetchedListing(res);
                      if (res) {
                        toast.success(`Listing: ${res.price.toString()} wei by ${res.seller.slice(0,6)}...`);
                      } else {
                        toast.info("No active listing");
                      }
                    } catch (e: any) {
                      toast.error(e?.message || 'Fetch failed');
                    } finally {
                      setFetchingListing(false);
                    }
                  }}>
                    {fetchingListing ? 'Checking...' : 'Check'}
                  </Button>
                  {fetchedListing === undefined ? (
                    <Badge variant="secondary" className="text-xs">Idle</Badge>
                  ) : fetchedListing === null ? (
                    <Badge variant="destructive" className="text-xs">Not Listed</Badge>
                  ) : (
                    <Badge className="text-xs bg-green-500/20 text-green-600">Listed</Badge>
                  )}
                </div>
                {fetchedListing && (
                  <div className="text-[10px] text-muted-foreground leading-tight mt-1 space-y-0.5">
                    <div>Seller: {fetchedListing.seller.slice(0, 10)}...</div>
                    <div>Price: {(Number(fetchedListing.price) / 1e18).toFixed(4)} ETH</div>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 md:col-span-2">
                <Button className="flex-1" onClick={handleList} disabled={tx.pending}>
                  List NFT
                </Button>
                <Button className="flex-1" variant="secondary" onClick={handleBuy} disabled={tx.pending}>
                  Buy NFT
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Market Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Volume (24h)</span>
              </div>
              <div className="text-2xl font-bold">${marketStats.totalVolume.toFixed(1)}K</div>
              <p className="text-xs text-green-600">+12.5% from yesterday</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Avg Yield</span>
              </div>
              <div className="text-2xl font-bold">{marketStats.avgYield.toFixed(1)}%</div>
              <p className="text-xs text-blue-600">APY across all streams</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Layers className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-muted-foreground">Active Listings</span>
              </div>
              <div className="text-2xl font-bold">{mockNFTs.length}</div>
              <p className="text-xs text-purple-600">Tradeable streams</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">Active Traders</span>
              </div>
              <div className="text-2xl font-bold">{marketStats.activeTrades}</div>
              <p className="text-xs text-orange-600">In last 24h</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search streams..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categories</label>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range (ETH)</label>
                  <div className="px-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>{priceRange[0]} ETH</span>
                      <span>{priceRange[1]} ETH</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Risk Level */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Level</label>
                  <div className="space-y-2">
                    {["low", "medium", "high"].map(risk => (
                      <label key={risk} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span className="capitalize">{risk} Risk</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
            <div className="lg:col-span-3">
            {/* Controls */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="yield-high">Yield: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                  {filteredNFTs.length} results
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Layers className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* NFT Grid/List */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                  : "space-y-4"
                }
              >
                {filteredNFTs.map((nft, index) => (
                  <motion.div
                    key={nft.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {viewMode === "grid" ? (
                      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/20 hover:scale-105">
                        <div className="relative">
                          <ImageWithFallback
                            src={nft.image}
                            alt={nft.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-3 right-3 flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="h-8 w-8 p-0 bg-background/80 backdrop-blur"
                              onClick={() => toggleFavorite(nft.id)}
                            >
                              <Heart 
                                className={`h-4 w-4 ${
                                  favorites.includes(nft.id) 
                                    ? "fill-red-500 text-red-500" 
                                    : ""
                                }`} 
                              />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="secondary" 
                                  className="h-8 w-8 p-0 bg-background/80 backdrop-blur"
                                  onClick={() => setSelectedNFT(nft)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>{nft.title}</DialogTitle>
                                </DialogHeader>
                                {selectedNFT && (
                                  <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                      <ImageWithFallback
                                        src={selectedNFT.image}
                                        alt={selectedNFT.title}
                                        className="w-full h-64 object-cover rounded-lg"
                                      />
                                      <div className="mt-4">
                                        <h4 className="font-medium mb-2">Price History</h4>
                                        <ResponsiveContainer width="100%" height={200}>
                                          <LineChart data={selectedNFT.priceHistory}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
                                          </LineChart>
                                        </ResponsiveContainer>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <p className="text-muted-foreground mb-2">{selectedNFT.description}</p>
                                        <div className="flex items-center space-x-2">
                                          {selectedNFT.verified && (
                                            <Badge className="bg-blue-500/20 text-blue-600">
                                              Verified
                                            </Badge>
                                          )}
                                          <Badge variant="secondary">
                                            {selectedNFT.category}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-muted-foreground">Current Price</p>
                                          <p className="text-xl font-bold">{selectedNFT.currentPrice} ETH</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">APY</p>
                                          <p className="text-xl font-bold text-green-600">{selectedNFT.yield}%</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Views</p>
                                          <p className="font-semibold">{selectedNFT.totalViews.toLocaleString()}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Watchers</p>
                                          <p className="font-semibold">{selectedNFT.watchers}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-medium mb-2">Stream Progress</h4>
                                        <Progress 
                                          value={(selectedNFT.streamedValue / selectedNFT.originalValue) * 100} 
                                          className="mb-2" 
                                        />
                                        <div className="flex justify-between text-sm">
                                          <span>Streamed: ${selectedNFT.streamedValue.toLocaleString()}</span>
                                          <span>Remaining: ${selectedNFT.remainingValue.toLocaleString()}</span>
                                        </div>
                                      </div>
                                      <div className="flex space-x-2">
                                        <Button className="flex-1" onClick={() => { setTokenIdInput(String(selectedNFT.tokenId)); toast.info("Token ID loaded below – use Buy section"); }}>
                                          <ShoppingCart className="w-4 h-4 mr-2" />
                                          Load To Buy
                                        </Button>
                                        <Button variant="outline" className="flex-1">
                                          Make Offer
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                          <div className="absolute top-3 left-3 flex space-x-2">
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/20">
                              {nft.yield}% APY
                            </Badge>
                            {nft.verified && (
                              <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/20">
                                <Star className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{nft.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{nft.description}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Current Price</p>
                              <p className="font-semibold">{nft.currentPrice} ETH</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Remaining Value</p>
                              <p className="font-semibold">${nft.remainingValue.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Progress value={(nft.streamedValue / nft.originalValue) * 100} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Streamed: ${nft.streamedValue.toLocaleString()}</span>
                              <span>{nft.duration}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Eye className="w-3 h-3" />
                              <span>{nft.totalViews}</span>
                              <Heart className="w-3 h-3" />
                              <span>{nft.watchers}</span>
                            </div>
                            <Badge 
                              variant="secondary" 
                              className={
                                nft.riskLevel === "low" 
                                  ? "bg-green-500/20 text-green-600" 
                                  : nft.riskLevel === "medium"
                                  ? "bg-yellow-500/20 text-yellow-600"
                                  : "bg-red-500/20 text-red-600"
                              }
                            >
                              {nft.riskLevel} risk
                            </Badge>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button className="flex-1" size="sm" onClick={() => { setTokenIdInput(String(nft.tokenId)); toast.info("Token ID loaded below – set ETH & Buy"); }}>
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Load To Buy
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Make Offer
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      // List view
                      <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                          <ImageWithFallback
                            src={nft.image}
                            alt={nft.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold truncate">{nft.title}</h3>
                              {nft.verified && (
                                <Badge className="bg-blue-500/20 text-blue-600 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate mb-2">{nft.description}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="font-semibold">{nft.currentPrice} ETH</span>
                              <span className="text-green-600">{nft.yield}% APY</span>
                              <span className="text-muted-foreground">{nft.duration}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" onClick={() => { setTokenIdInput(String(nft.tokenId)); toast.info("Token ID loaded below – set ETH & Buy"); }}>Load</Button>
                            <Button variant="outline" size="sm">Offer</Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredNFTs.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No streams found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
