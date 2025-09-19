import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, Filter, TrendingUp, Eye, ShoppingCart, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Mock marketplace data
const mockNFTs = [
  {
    id: "nft_001",
    title: "Senior Dev Salary Stream",
    description: "6-month salary stream for senior developer position",
    currentPrice: 45.5,
    originalValue: 60000,
    streamedValue: 22500,
    remainingValue: 37500,
    duration: "4 months remaining",
    yield: "8.2%",
    seller: "0x742d35cc...",
    image: "https://images.unsplash.com/photo-1744473755637-e09f0c2fab41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvY3VycmVuY3klMjBmaW5hbmNpYWwlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1ODI3MTIwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "active",
    category: "salary"
  },
  {
    id: "nft_002",
    title: "Token Vesting Plan",
    description: "Founder token unlock schedule",
    currentPrice: 125.0,
    originalValue: 500000,
    streamedValue: 125000,
    remainingValue: 375000,
    duration: "18 months remaining",
    yield: "12.5%",
    seller: "0x8ba1f109...",
    image: "https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZnQlMjBkaWdpdGFsJTIwYXJ0JTIwbWFya2V0cGxhY2V8ZW58MXx8fHwxNzU4MjcxMjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "active",
    category: "vesting"
  },
  {
    id: "nft_003",
    title: "Marketing Retainer",
    description: "Monthly marketing consultant payments",
    currentPrice: 8.75,
    originalValue: 15000,
    streamedValue: 7500,
    remainingValue: 7500,
    duration: "2 months remaining",
    yield: "6.8%",
    seller: "0x1f9840a8...",
    image: "https://images.unsplash.com/photo-1713455212325-3841dd409519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc3RyZWFtJTIwZmxvd2luZyUyMHdhdGVyJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzU4MjcxMjAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "active",
    category: "consulting"
  },
  {
    id: "nft_004",
    title: "SaaS Revenue Share",
    description: "Monthly subscription revenue distribution",
    currentPrice: 32.1,
    originalValue: 50000,
    streamedValue: 12000,
    remainingValue: 38000,
    duration: "10 months remaining",
    yield: "15.2%",
    seller: "0x6b175474...",
    image: "https://images.unsplash.com/photo-1744473755637-e09f0c2fab41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvY3VycmVuY3klMjBmaW5hbmNpYWwlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1ODI3MTIwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "active",
    category: "revenue"
  },
  {
    id: "nft_005",
    title: "Freelance Project",
    description: "Web development project milestone payments",
    currentPrice: 15.3,
    originalValue: 25000,
    streamedValue: 10000,
    remainingValue: 15000,
    duration: "6 weeks remaining",
    yield: "9.1%",
    seller: "0xa0b86991...",
    image: "https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZnQlMjBkaWdpdGFsJTIwYXJ0JTIwbWFya2V0cGxhY2V8ZW58MXx8fHwxNzU4MjcxMjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "active",
    category: "freelance"
  },
  {
    id: "nft_006",
    title: "Investment Returns",
    description: "Quarterly dividend payments from fund",
    currentPrice: 89.2,
    originalValue: 100000,
    streamedValue: 25000,
    remainingValue: 75000,
    duration: "12 months remaining",
    yield: "11.8%",
    seller: "0xdac17f95...",
    image: "https://images.unsplash.com/photo-1713455212325-3841dd409519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc3RyZWFtJTIwZmxvd2luZyUyMHdhdGVyJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzU4MjcxMjAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    status: "active",
    category: "investment"
  }
];

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price-low");

  const filteredNFTs = mockNFTs
    .filter(nft => 
      nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(nft => selectedCategory === "all" || nft.category === selectedCategory)
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
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background pt-8 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Stream NFT Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and trade ChronoFlow stream NFTs - liquid representations of cash flows
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search streams..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="vesting">Token Vesting</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="revenue">Revenue Share</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="yield-high">Yield: High to Low</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{mockNFTs.length}</div>
              <p className="text-sm text-muted-foreground">Active Listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">${(mockNFTs.reduce((acc, nft) => acc + nft.currentPrice, 0)).toFixed(1)}K</div>
              <p className="text-sm text-muted-foreground">Total Volume</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{(mockNFTs.reduce((acc, nft) => acc + parseFloat(nft.yield), 0) / mockNFTs.length).toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Avg Yield</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">24</div>
              <p className="text-sm text-muted-foreground">Sales (24h)</p>
            </CardContent>
          </Card>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNFTs.map((nft) => (
            <Card key={nft.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-border">
              <div className="relative">
                <ImageWithFallback
                  src={nft.image}
                  alt={nft.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-background/80 backdrop-blur">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-background/80 backdrop-blur">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/20">
                    {nft.yield} APY
                  </Badge>
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
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{nft.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seller</span>
                    <span className="font-mono">{nft.seller}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button className="flex-1" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Buy Now
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Make Offer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No streams found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}